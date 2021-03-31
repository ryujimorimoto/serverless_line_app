console.log('----app.js----')
var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var axiosBase = require('axios')
var Shopify = require('shopify-api-node');
var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();
var checkSignature = require('./util/shopifySignature.js')
const line = require('@line/bot-sdk');
console.log('----1----')
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())
console.log('----2----')
/**
 * Enable All CORS Requests
 * https://expressjs.com/en/resources/middleware/cors.html
*/ 



// create LINE SDK client
// const lineClient = new line.Client({
//     channelAccessToken: process.env.LINE_ACCESS_TOKEN,
//     channelSecret: process.env.LINE_CHANNEL_SECRET,
//   }
// );








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
console.log('----3----')

/**********************
 * get method *
 **********************/
app.get(`${process.env.PUBLIC_API_URL}/oauth`, (req, res) =>{
  // Add your code here
  console.log('----GET /oauth----')
  /**
   *  Step 3: Confirm installation
   *  3-2:hmac の検証
   */
  if(!checkSignature(req.apiGateway.event.queryStringParameters)){
    console.log('invalid signature')
    res.json({error: 'invalid signature'})
  }
  /**
   *   3-3.access_token,scope の取得と永続化
   */
  const code = req.apiGateway.event.queryStringParameters.code
  const shopOrigin = req.apiGateway.event.queryStringParameters.shop
  const access_token_endpoint=`https://${shopOrigin}/admin/oauth/access_token`
  const axios = axiosBase.create({
    baseURL: access_token_endpoint,
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'json'
  })
  axios.post('/',{
    client_id:process.env.SHOPIFY_API_KEY,
    client_secret:process.env.SHOPIFY_API_SECRET,
    code:code
  }).then(response=>{
    //shop_id と token を永続化
    //TODO: token を暗号化
    var table = "Tokens";
    var params = {
      TableName: table,
      Item:{
        shop_id:shopOrigin,
        token:JSON.stringify(response.data)
      }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            //tokenを返却
            res.json(response.data)
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            //tokenを返却
            res.json(response.data)
        }
    });
  }).catch(err=>{
    console.log(err)
    res.json({error: err})
  })
});

app.get(`${process.env.PUBLIC_API_URL}/shop/exist`, (req, res) =>{
  console.log('----GET /shop/exist----')
  // TODO: Shop が token を持っているかを判定する
  var table = "Tokens";
  var params = {
    TableName: table,
    Key:{
      shop_id:req.apiGateway.event.queryStringParameters.shop,
    }
  };
  docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        res.json(err)
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        res.json({exist:true})
    }
  });
});

app.get(`${process.env.PRIVATE_API_URL}/products`, (req, res) =>{
  console.log('----GET /products----')
  // TODO: Shop 情報はパラメータではなく、認証されたユーザーとshopidを紐づけて管理すること
  // TODO: Dynamo は model 化する
  var table = "Tokens";
  var params = {
    TableName: table,
    Key:{
      shop_id:req.apiGateway.event.queryStringParameters.shop,
    }
  };
  docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        res.json(err)
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        const token = JSON.parse(data.Item.token)
        // Shopify instance
        var shopify = new Shopify({
          shopName: req.apiGateway.event.queryStringParameters.shop,
          accessToken: token.access_token,
          apiVersion: '2020-04',
        });
        // Add your code here
        var params = { limit: 10 };
        shopify.product
          .list(params)
          .then((list) => res.json({products:list}))
          .catch((err) => res.json({products:err}));
    }
  });
});

app.get(`${process.env.PRIVATE_API_URL}/products/*`, (req, res) =>{
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get(`${process.env.PRIVATE_API_URL}/line/followers`, (req, res) =>{
  // Add your code here
  console.log("req:", req);
  let params = {
    TableName: 'followers'
  }
  try {
    let userProfile_list = [];

    docClient.scan(params, function(err, data) {
      console.log("data:", data)
    if(err){
        console.log("err:", err)
    }else{
      console.log("data:", data)
      console.log("Items:", data.Items)

      data.Items.forEach(async function(Follower, index) {
        console.log('■FollowerUID：', Follower.Follower);
        console.log("名前：", Follower.name);
        console.log("画像URL：", Follower.picture);
        console.log("ステータスメッセージ", Follower.message);
        console.log("言語", Follower.language);
        userProfile_list.push([Follower.Follower, Follower.name, Follower.picture, Follower.message, Follower.language]);
      });
      
      console.log("userProfile_list:", userProfile_list)

      res.json(JSON.stringify(userProfile_list));
    }
  });
    
      
  } catch (err) {
    console.error(`[Error]: ${JSON.stringify(err)}`);
    return err;
  }    
});

/****************************
* post method *
****************************/

app.post(`${process.env.PRIVATE_API_URL}/test`, (req, res) =>{
  console.log('----POST LINE API Connect Test----')

  console.log(req.apiGateway.event.queryStringParameters)
  console.log(req.query)
  
  const messageData = req.query.message;
    console.log("◆TEXT:" + JSON.stringify(messageData)); //メッセージ内容表示
    const postData =  {
            "type": "text",
            "text": messageData
    }
    try {
      lineClient.pushMessage(process.env.LINE_USER_ID, postData);
    } catch (error) {
      console.log(error)
    }
});
app.post(`${process.env.PUBLIC_API_URL}/linecallback`, (req, res, next) =>{
  (async () => {
    console.log('----POST LINE API Follow and UnFollow ----')
    const event_data = req.body;
    console.log('◆EVENT.BODY:', JSON.stringify(event_data));
    const messageData = event_data.events && event_data.events[0];
    console.log("◆USERID:" + JSON.stringify(messageData.source.userId));
    console.log ("◆TYPE:" + messageData.type);

    if (messageData.type == 'follow') {
        console.log("◆USERID:" + JSON.stringify(messageData.source.userId + 'が友達追加'));
        const follower = messageData.source.userId;
        console.log(follower);
        const lineProfile = await lineClient.getProfile(follower);
        console.log("lineProfile", lineProfile)
        const params = {
            TableName: 'followers',
            Item: {
                Follower: follower,
                name: lineProfile.displayName,
                picture: lineProfile.pictureUrl,
                message: lineProfile.statusMessage,
                language: lineProfile.language
            }
        };
        docClient.put(params, function(err, data) {
            if (err) {
                console.log('■PUTエラー：'+err)
            }else{ 
                console.log('■PUTデータ'+data)
            }
        });
    } else if (messageData.type == 'unfollow') {
        console.log("◆USERID:" + JSON.stringify(messageData.source.userId + 'が友達削除'));
        const unfollower = messageData.source.userId;
        console.log("◆unfollower:" + JSON.stringify(unfollower));
        const params = {
            TableName: 'followers',
            Key: {
                Follower: unfollower
            }
        };
        console.log("params:", params)
        docClient.delete(params, function(err, data) {
            if (err) {
                console.log('■DELETEエラー：'+err)
            }else{
                console.log('■DELETEデータ'+data);
            }
        });
    } else if (messageData.type == 'message') {

        const postData =  {
            "type": "text",
            "text": '自動返信は開発中です'
        }
        try {
          lineClient.replyMessage(messageData.replyToken, postData);
        } catch (error) {
            console.log(error)
        }
    } else {
        return;
    }
  })().catch(next);
});
app.post(`${process.env.PRIVATE_API_URL}/products`, (req, res) =>{
  console.log('----POST /products----')
  // TODO: Shop 情報はパラメータではなく、認証されたユーザーとshopidを紐づけて管理すること
  // TODO: Dynamo は model 化する
  var table = "Tokens";
  var params = {
    TableName: table,
    Key:{
      shop_id:req.apiGateway.event.queryStringParameters.shop,
    }
  };
  docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        res.json(err)
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        const token = JSON.parse(data.Item.token)
        // Shopify instance
        var shopify = new Shopify({
          shopName: req.apiGateway.event.queryStringParameters.shop,
          accessToken: token.access_token,
          apiVersion: '2020-04',
        });
        // Add your code here
        var param = {
          title: req.body.title,
          body_html: req.body.body_html,
          vendor: req.body.vendor,
          tags: req.body.tags
        }
        shopify.product
          .create(param)
          .then((item) => res.json({product:item}))
          .catch((err) => res.json({product:err}));
    }
  });
});

app.post(`${process.env.PRIVATE_API_URL}/products/*`, (req, res) =>{
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});


/****************************
* put method *
****************************/

app.put(`${process.env.PRIVATE_API_URL}/products`, (req, res) =>{
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put(`${process.env.PRIVATE_API_URL}/products/*`, (req, res) =>{
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* delete method *
****************************/

app.delete(`${process.env.PRIVATE_API_URL}/products`, (req, res) =>{
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete(`${process.env.PRIVATE_API_URL}/products/*`, (req, res) =>{
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
