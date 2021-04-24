'use strict';
const awsServerlessExpress = require('aws-serverless-express');
const app = require('./functions/cognito/user.js');

const server = awsServerlessExpress.createServer(app);
console.log("cognito/user");

exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  awsServerlessExpress.proxy(server, event, context);
};