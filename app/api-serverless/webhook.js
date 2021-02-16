'use strict';
const awsServerlessExpress = require('aws-serverless-express');
const app = require('./functions/webhook.js');

const server = awsServerlessExpress.createServer(app);
console.log("webhook");

exports.handler = (event, context) => {
  console.log(`WEBHOOK EVENT: ${JSON.stringify(event)}`);
  awsServerlessExpress.proxy(server, event, context);
};