require('dotenv').config({ path: './app.env' });
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.post('/api/gemini-chat', async (req, res) => {
  const { message } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });
    const result = await model.generateContent(message);
    const text = result.response.text();
    res.json({ reply: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Gemini AI server running on port ${PORT}`);
});