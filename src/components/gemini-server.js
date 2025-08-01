require('dotenv').config({ path: './app.env' });
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

app.post('/api/gemini-chat', async (req, res) => {
  const { message, history = [] } = req.body;
  try {
    const model = ai.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: history,
    });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    res.json({ reply: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Gemini AI server running on port ${PORT}`);
});