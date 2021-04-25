'use strict';
const awsServerlessExpress = require('aws-serverless-express');
const app = require('./functions/cognito/user.js');

const server = awsServerlessExpress.createServer(app);
console.log("cognito/user");

exports.handler = (event, context, callback) => {
  // console.log(`SERVER: ${JSON.stringify(server)}\n`);
  // console.log(`EVENT: ${JSON.stringify(event)}\n`);
  // console.log(`CONTEXT: ${JSON.stringify(context)}\n`);
  // awsServerlessExpress.proxy(server, event, context);

  const result = { message: "success" }
  // const response = {
  //   statusCode: 200,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //   },
  //   body: JSON.stringify(result),
  // };
  const body = JSON.stringify(result)
  // 
  callback(null, body);
  return body
};