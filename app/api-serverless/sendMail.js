'use strict';
const AWS = require('aws-sdk');

module.exports.sendMail = (event, context, callback) => {
  const ses = new AWS.SES({region: process.env.REGION}); //メールを登録したリージョン
  const data = event.body;
  console.log("\n***************************************\n")
  console.log("data", data);

  console.log("\n***************************************\n")
  const params = {
    Source: 'forest.book.programmer@gmail.com',
    Destination: {
      ToAddresses: ['forest.book.programmer@gmail.com'], //配列で記述
    },
    Message: {
      Subject: {
        Data: '挨拶',
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
            <h1>こんにちは</h1>
          </body>
          </html>
            `,
          Charset: 'UTF-8',
        },
      },
    },
  };

  ses.sendEmail(params, (err, result) => {
    if (err) {
      console.error(err);
      callback(null, {
        statusCode: err.statusCode || 501,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*',
        },
        body: "Couldn't send contact mail",
      });
    } else {
      const response = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(result),
      };

      callback(null, response);
    }
  });
};