# Shapes Relay

This project is a relay interface between Discord bots and the [Shapes API](https://shapes.inc), allowing you to integrate multimodal AI (text, image, voice) into your bot **without directly violating Discord’s Terms of Service**.

> **Disclaimer:** This project is for educational and learning purposes only.  
> It is not affiliated with or endorsed by Shapes Inc.  
> **Do not sell or commercialize this relay in any form.**

---

## ❗ Important Recommendation

**Use an ALT account to create and operate your bot.**  
Even though this relay minimizes detection risks, there is no absolute guarantee that Discord won’t detect or flag the interaction in the future.

Using an alternate account ensures your main account remains safe.

---

## ✅ What does Shapes Relay do?

- Receives formatted payloads from Discord bots
- Forwards the content to [Shapes API](https://api.shapes.inc/v1/)
- Returns the AI-generated response for your bot to reply
- Supports:
  - Plain text
  - Text + image
  - Text + audio
  - Structured callback responses

---

## ⚙️ Requirements

- Node.js 18+
- A Shapes account with an active Shape: [https://shapes.inc](https://shapes.inc)
- A Discord bot (source code here: [Shapes Discord Bot Handler](https://github.com/your-org/your-discord-bot))
- A hosting environment (Render, Railway, Vercel, etc.)

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-org/shapes-relay
cd shapes-relay
npm install
```

Create a `.env` file with:

```env
SHAPESINC_API_KEY=your-shapes-api-key
SHAPESINC_SHAPE_USERNAME=your-shape-name
```

---

## ▶️ Running the Relay

```bash
node shapesRelay.js
```

You should see: `Shapes Relay is running on port 3000`

---

## 🔌 Endpoint

### `POST /api/shape`

Sends a message to your Shape and returns the AI's response.

#### Request body:

```json
{
  "prompt": "Text or multimodal structure",
  "user_id": "user-id",
  "channel_id": "channel-id"
}
```

- `prompt` can be:
  - Plain text
  - A JSON array like:
    ```json
    [
      { "type": "text", "text": "Message" },
      { "type": "image_url", "image_url": { "url": "https://..." } },
      { "type": "audio_url", "audio_url": { "url": "https://..." } }
    ]
    ```

#### Response:

```json
{
  "response": "AI-generated reply"
}
```

---

## ✅ Axios Example

```js
const axios = require('axios');

const response = await axios.post("https://your-relay.onrender.com/api/shape", {
  prompt: "Hello, how are you?",
  user_id: "123456789",
  channel_id: "987654321"
});

console.log(response.data.response);
```

---

## ✨ Additional Features

This relay can be extended to:

- Execute response callbacks (e.g. `<imageGenerate: ...>`)
- Integrate into full Discord handler systems
- Use internal logic via Google Gemini for context filtering

---

## ❌ Legal Note

This project is entirely independent and **not affiliated with Shapes Inc. or Discord**.  
For educational use only.  
Do not use to automate messages with real users without their consent.  
Use at your own risk.

---

## ❤️ Credits

To all developers building creative and responsible bots.

---

## 🔗 Related Repositories

- **Discord Bot Source Code** (Handlers, AI integration):  
  [https://github.com/your-org/your-discord-bot](https://github.com/your-org/your-discord-bot)
