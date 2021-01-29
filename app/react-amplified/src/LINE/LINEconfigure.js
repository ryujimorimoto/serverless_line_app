const { LineClient } = require('messaging-api-line');

// get accessToken and channelSecret from LINE developers website
const client = new LineClient({
  accessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
});