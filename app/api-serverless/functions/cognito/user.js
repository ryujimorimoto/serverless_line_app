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
  console.log('----- POST /users/create -----');
  console.log("req:", req);
  // let params = {
  //   Key: "Users",
  //   AttributeName: {
  //     username: "送られてきたデータ",
  //   }
  // }
  // docClient.get(params, body).then((value) => {})
  return {}
});


/**********************
 * DBに保存 *
 **********************/
app.post(`${process.env.COGNITO_API_URL}/create`, (req, res) =>{
  const token = crypto.randomBytes(64).toString('base64').substring(0, 64)

  console.log('----- POST /users/create -----');
  // console.log("req:", req);
  // let params = {
  //   Key: "Users",
  //   AttributeName: {
  //     username: "送られてきたデータ",
  //     token: token,
  //     email: email
  //   }
  // }
  // docClient.put(params, body)
  //   .then( (data) => {
  //     res.json({success: '保存に成功'})
  //   })
  //   .catch((err) => {
  //     res.json({error: err})
  //   });
  return {}
});