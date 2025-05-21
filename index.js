const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log("🔑 Token loaded:", process.env.LINE_CHANNEL_ACCESS_TOKEN);

// 🛡️ Bypass ngrok browser warning
app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

// ✅ 驗證 LINE Webhook 簽章
function validateSignature(req, res, buf) {
  const signature = req.headers['x-line-signature'];
  const body = buf.toString();

  const hash = crypto
    .createHmac('sha256', process.env.LINE_CHANNEL_SECRET)
    .update(body)
    .digest('base64');

  if (signature !== hash) {
    console.warn('❌ 驗證失敗：X-Line-Signature 不符');
    throw new Error('Invalid signature');
  }
}

app.use(express.json({ verify: validateSignature }));

// 👉 可選：靜態圖片目錄
app.use('/images', express.static('images'));

app.get('/', (req, res) => {
  res.send('🚀 LINE Bot Server is running.');
});

app.post('/webhook', async (req, res) => {
  try {
    console.log('📩 Webhook 收到資料：', JSON.stringify(req.body, null, 2));
    const events = req.body.events;

    if (!events || events.length === 0) {
      console.log("⚠️ 沒有 events 內容");
      return res.sendStatus(400);
    }

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        console.log(`✉️ 收到訊息：${event.message.text}`);
        console.log('📤 準備傳送圖片...');

        await axios.post('https://api.line.me/v2/bot/message/reply', {
          replyToken: event.replyToken,
          messages: [
            {
              type: 'image',
              originalContentUrl: `https://i.imgur.com/XaDrRaV.jpeg`,
              previewImageUrl: `https://i.imgur.com/XaDrRaV.jpeg`,
            }
          ]
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
          }
        });

        console.log('✅ 圖片傳送指令已發送');
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ webhook 整體錯誤:", err.stack || err.message);
    res.sendStatus(500);
  }
});

// 👉 fallback 404 router
app.use((req, res) => {
  console.log(`🚨 未處理的路由：${req.method} ${req.path}`);
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
