'use strict';

const line = require('@line/bot-sdk');

//LINEアクセストークン設定
const client = new line.Client({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN
});

exports.handler = async event => {
    console.log('◆EVENT:', event);
    // const event_data = JSON.parse(event.body);
    // console.log('◆EVENT.BODY:', JSON.stringify(event_data));
    // if(event_data.events.length === 0){
    //   client.pushMessage(event_data.destination, "");
    //   console.log('疎通確認用');
    //   return; 
    // }
    // const messageData = event_data.events && event_data.events[0];
    // console.log("◆TEXT:" + JSON.stringify(messageData.message.text)); //メッセージ内容表示
    const messageData = event.queryStringParameters.message;
    console.log("◆TEXT:" + JSON.stringify(messageData)); //メッセージ内容表示
    const postData =  {
            "type": "text",
            "text": messageData
    }
    try {
      await client.pushMessage("U74816317451589d8bcd1e6fadacbdcad", postData);
    } catch (error) {
      console.log(error)
    }
};