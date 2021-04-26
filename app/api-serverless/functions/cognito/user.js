console.log('----user.js----')
var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var axiosBase = require('axios')
var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
const crypto = require('crypto')


var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers", 
    "\
    Authorization, \
    Content-Type, \
    X-Amz-Date, \
    X-Api-Key, \
    X-Amz-Security-Token, \
    X-Amz-User-Agent \
    "
  )
  next()
});

// req.headers.authorization
/**********************
 * DBを参照 *
 **********************/
app.get(`/public${process.env.COGNITO_API_URL}/check/:username`, (req, res) =>{
  console.log('----- GET /users/check -----');
  console.log("req:", req);
  var params = {
    TableName : 'Users',
    Key: {
      username: req.params.username
    }
  };
  docClient.get(params, (err, data) => {
    if (err) {
      console.error("could not find item. Error JSON:", JSON.stringify(err, null, 2));
      res.json({error: err})
    } else {
      const query_string = req.apiGateway.event.queryStringParameters
      const item = data.Item
  
      if (query_string.token === item.token && query_string.shop_id === item.shop_id) {
        console.log("got item:", JSON.stringify(data, null, 2));
        const params = {
            UserAttributes: [
              { Name: 'email', Value: item.email },
              { Name: 'email_verified', Value: 'true' }
            ],
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: item.username
        };

        cognitoidentityserviceprovider.adminUpdateUserAttributes(params, function(err, data) {
          if (err) {
            console.log(err, err.stack)
            res.json({failure: '変更に失敗しました'})
          } else {
            console.log("data: ", data);
            res.json({success: '変更に成功しました'})
          }
        });
        return
      };
      console.log("=====================")
      console.log(`token in db: ${item.token}, in params: ${query_string.token}`)
      console.log(query_string.token === item.token)
      console.log(`shop_id in db: ${item.shop_id}, in params: ${query_string.shop_id}`)
      console.log(query_string.shop_id === item.shop_id)
      console.log("=====================")
      res.json({failure: 'URLが無効です'})
    }
  })
});


/**********************
 * DBに保存 *
 **********************/
app.post(`${process.env.COGNITO_API_URL}/create`, (req, res) =>{
  console.log('----- POST /users/create -----');
  console.log("req:", req);

  // 「+」と「/」は置き換える
  const token = crypto.randomBytes(64).toString("base64").replace('+', "-").replace('/', "_");
  const ses = new AWS.SES({region: process.env.REGION}); //メールを登録したリージョン
  try {
    const params = {
      TableName: "Users",
      Item:{
        shop_id: req.body.shop_id,
        username: req.body.username,
        email: req.body.email,
        token: token
      }
    }

    docClient.put(params, function(err, data) {
      if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        res.json({error: err})
      } else {
        console.log("Added item:", JSON.stringify(data, null, 2));

        // SESにてメールをおくる。
        const mail_params = {
          Source: process.env.SENDER_EMAIL,
          Destination: {
            // ToAddresses: ['cognac0004@gmail.com'],
            ToAddresses: [req.body.email], //配列で記述
          },
          Message: {
            Subject: {
              Data: '認証のお願い',
              Charset: 'utf-8',
            },
            Body: {
              Html: {
                Data: `
                <html>
                  <head>
                    <style>
                      body {
                          font-size: 14px;
                          color: #484848;
                      }
                    </style>
                  </head>
                  <body>
                    <h3>以下のURLをクリックして、メールアドレスを認証してください</h3><br/>
                    ${process.env.PUBLIC_COGNITO_API_URL}/check/${req.body.username}?token=${token}&shop_id=${req.body.shop_id}
                  </body>
                </html>
              `,
              Charset: 'UTF-8',
              },
            },
          },
        }
        ses.sendEmail(mail_params, (err, result) => {
          if (err) {
            console.log(err);
            res.json({error: err})
          } else {
            console.log("--- send mail ---");
            res.json({success: "success"})
          };
        })
      }
    })
  } catch (error) {
    console.log(error);
    return res.json(error)
  } 
});

app.listen(3000, function() {
    console.log("App started")
});

module.exports = app
