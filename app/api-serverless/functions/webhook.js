console.log('----webhook.js----')
let express = require('express')
let bodyParser = require('body-parser')
let awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
let axiosBase = require('axios')
let Shopify = require('shopify-api-node');
let AWS = require("aws-sdk");
let docClient = new AWS.DynamoDB.DocumentClient();
let checkSignature = require('./util/shopifySignature.js')
const line = require('@line/bot-sdk');
const crypto = require("crypto")
// ---- webhook 対応
function hmac_verification(data, hmac_header){
  const calculated_hmac = crypto
                .createHmac("sha256", process.env.SHARED_SECRET)
                .update(data)
                .digest("base64");
  console.log("X-Shopify-Hmac-Sha256: ", hmac_header)
  console.log("hmac base64:", calculated_hmac)
  return calculated_hmac == hmac_header ? true : false;
}

// ---- webhook 対応終了






// declare a new express app
let app = express()

app.use(bodyParser.json( {
  // hmac 認証のための処理
  limit: "50mb",
  verify(req, res, buf) {
    if (/^\/webhook/.test(req.originalUrl)){
      req.textBody = buf.toString();
    }
  }
} ));
app.use(awsServerlessExpressMiddleware.eventContext())
/**
 * Enable All CORS Requests
 * https://expressjs.com/en/resources/middleware/cors.html
*/ 

// create LINE SDK client
const lineClient = new line.Client({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
  }
);

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
    X-Amz-User-Agent, \
    X-Shopify-Topic, \
    X-Shopify-API-Version, \
    X-Shopify-Hmac-SHA256, \
    X-Shopify-Shop-Domain, \
    X-Shopify-Order-Id \
    "
  )
  next()
});

/**********************
 * get method *
 **********************/
app.post(`${process.env.WEBHOOK_URL}/products/update`, (req, res) =>{
  console.log('----POST LINE API Connect to Webhook ----')
  // console.log("API GateWay情報", req.apiGateway)

  // hmacによる認証 true, false
  const webhook_verify = hmac_verification(req.textBody, req.headers["x-shopify-hmac-sha256"])
  console.log("hmacの認証:", webhook_verify)
  if(!webhook_verify){
    res.sendStatus(403)
  }

  const postData =  {
    "type": "text",
    "text": "「" + req.body.title + "」の商品が更新されました"
  }
  const msg = lineClient.pushMessage(process.env.LINE_USER_ID, postData)
    .then( (response) => {
      console.log("レスポンス:", response)
      res.sendStatus(200)
    })
    .catch( (err) => {
      console.log(err)
      res.sendStatus(500)
    });
});




app.listen(3000, function() {
    console.log("App started")
});



// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
