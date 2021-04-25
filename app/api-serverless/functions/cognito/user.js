console.log('----user.js----')
var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var axiosBase = require('axios')
var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

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


/**********************
 * DBを参照 *
 **********************/
app.get(`${process.env.COGNITO_API_URL}/check/:username`, (req, res) =>{
  console.log('----- GET /users/check -----');
  console.log("req:", req);
  var params = {
    TableName : 'Users',
    Key: {
      username: req.apiGateway.event.queryStringParameters.username
    }
  };
  docClient.get(params, (err, data) => {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      res.json({error: err})
    } else {
      // emailを強制的に更新する処理
      console.log(data.Item.emailata);
      console.log("got item:", JSON.stringify(data, null, 2));
      res.json({success: '保存に成功'})
    }
  })
});


/**********************
 * DBに保存 *
 **********************/
app.post(`${process.env.COGNITO_API_URL}/create`, (req, res) =>{
  console.log('----- POST /users/create -----');
  console.log("req:", req);

  const token = crypto.randomBytes(64).toString('base64').substring(0, 64)
  try {
    const params = {
      TableName: "Users",
      Item:{
        shop_id: "shopOrigin",
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
        res.json({success: '保存に成功'})
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
