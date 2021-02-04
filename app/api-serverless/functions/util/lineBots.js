'use strict';
const line = require('@line/bot-sdk');

//LINEアクセストークン設定
const client = new line.Client({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN
});

exports.handler = async event => {
    console.log('◆EVENT:', event);
    const event_data = JSON.parse(event.body);
    console.log('◆EVENT.BODY:', JSON.stringify(event_data));
    const messageData = event_data.events && event_data.events[0];
    console.log("◆TEXT:" + JSON.stringify(messageData.message.text)); //メッセージ内容表示


    const postData =  {
            "type": "text",
            "text": messageData.message.text
    }

    try {
        await client.replyMessage(messageData.replyToken, postData);
    } catch (error) {
        console.log(error)
    }
};
// const line = require('@line/bot-sdk');
// const express = require('express');

// // create LINE SDK config from env variables
// const config = {
//   channelAccessToken: process.env.LINE_ACCESS_TOKEN,
//   channelSecret: process.env.LINE_CHANNEL_SECRET,
// };
// // create LINE SDK client
// const client = new line.Client(config);

// // create Express app
// // about Express itself: https://expressjs.com/
// const app = express();

// // register a webhook handler with middleware
// // about the middleware, please refer to doc
// exports.handler = async e => {
// console.log(config)

//   console.log(`handler event:`);
//   console.log(e);
//   console.log("middleware:");
//   console.log(line.middleware(config));

//   // event handler
//   function handleEvent(event) {
//     if (event.type !== 'message' || event.message.type !== 'text') {
//       // ignore non-text-message event
//   console.log("handleEvent:");
//   return Promise.resolve(null);
//     }

//     // create a echoing text message
//     const echo = { type: 'text', text: event.message.text };

//     // use reply API
//     return client.replyMessage(event.replyToken, echo);
//   }
//   app.post('/callback', line.middleware(config), (req, res) => {
//     console.log(`req: ${req}`);
//     Promise
//       .all(req.body.events.map(handleEvent))
//       .then((result) => res.json(result))
//       .catch((err) => {
//         console.error(err);
//         res.status(500).end();
//       });
//   });
// }


// // listen on port
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`listening on ${port}`);
// });