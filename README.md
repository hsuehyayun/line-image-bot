# LINE Image Bot 📸

A simple LINE chatbot that receives webhook events and responds with static images.  
Ideal for sending predefined images based on user input.

---

## 🚀 Features

- Webhook listener with Express
- Responds with static images stored in `/images`
- Environment-based secret management using `.env`
- Designed for deployment on services like Render, Glitch, or Firebase Functions

---

## 📁 Project Structure

```
line-image-bot/
├── .env               # Environment variables (LINE_ACCESS_TOKEN, LINE_SECRET, etc)
├── images/            # Static image files to be sent
├── index.js           # Main server file
├── .gitignore         # Ignore .env, node_modules, etc.
├── package.json       # Project dependencies
└── README.md          # You're reading this!
```

---

## 🔧 Setup & Installation

1. Clone the repo
2. Install dependencies  
   ```bash
   npm install
   ```
3. Create a `.env` file and add:
   ```
   LINE_CHANNEL_ACCESS_TOKEN=YOUR_TOKEN
   LINE_CHANNEL_SECRET=YOUR_SECRET
   ```
4. Run the bot locally:  
   ```bash
   node index.js
   ```

---

## 🧪 Example Use Case

Send a message to your LINE bot → it replies with a specific image based on keyword match (e.g., "cat" → `images/cat.jpg`).

---

## 🐞 Common Errors I Encountered & Fixes

### 1. `Error: listen EADDRINUSE: address already in use :::3000`

🛠 **Cause**: Port 3000 already in use  
✅ **Fix**: End the running process using that port or choose a different port

---

### 2. `404 Not Found` or `🚨 未處理的路由：POST /webhook`

🛠 **Cause**: Webhook route not correctly handled  
✅ **Fix**: Make sure `app.post("/webhook", ...)` is defined before the fallback route:

```js
app.use((req, res) => {
  console.log(`🚨 未處理的路由：${req.method} ${req.path}`);
  res.status(404).send('Not Found');
});
```

---

### 3. `401 Unauthorized` for webhook call

🛠 **Cause**: Invalid `channelAccessToken` or `channelSecret`  
✅ **Fix**: Double-check `.env` values or regenerate from LINE Developer Console

---

### 4. PowerShell 無法執行 npm / git

🛠 **Cause**: PowerShell 設定執行政策限制  
✅ **Fix**:
```bash
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

或安裝 [Git for Windows](https://git-scm.com/download/win)，**記得選「Git from command line」**。

---

### 5. GitHub 誤上傳 `.env` 和 `node_modules/`

🛠 **Cause**: `.gitignore` 沒設定，或已被追蹤  
✅ **Fix**:

```bash
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore

git rm -r --cached node_modules
git rm --cached .env
git commit -m "Remove tracked secrets and node_modules"
git push
```

---

## 📦 Future Improvements

- Reply with random images
- Add keyword-to-image mapping
- Enable user-uploaded image logging

---

## 🙌 Acknowledgements

- LINE Messaging API
- Express.js
- GitHub & community docs
- Line developers documentation https://developers.line.biz/en/docs/messaging-api/using-rich-menus/#set-the-default-rich-menu

---

## 📄 License

MIT © 2025 hsuehyayun
