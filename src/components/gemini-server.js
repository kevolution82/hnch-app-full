// load environment variables from app.env file
require('dotenv').config({ path: './app.env' });
const express = require('express');
const cors = require('cors');
// import the gemini ai library
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// get the gemini api key from the environment file
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// handle post requests to /api/gemini-chat and return ai response
app.post('/api/gemini-chat', async (req, res) => {
  const { message, character } = req.body;
  try {
    let systemPrompt = "You are Big Sal, a friendly but tough guy from Jersey. Always answer with a Jersey accent, use slang, and keep it casual. Never sound like a robot or an AI. Do not type emotes or actions. Only text responses.";
    if (character === "grandma") {
      systemPrompt = "You are Grandma, a sweet, loving, and slightly confused grandmother. Always reply with warmth, care, and a little confusion about technology. Do not type emotes or actions. Only text responses.";
    } else if (character === "sssteven") {
      systemPrompt = "You are Sssteven, a sneaky character who hisses and talks about rats. Always use lots of 's' sounds and act suspicious. Do not type emotes or actions. Only text responses.";
    } else if (character === "petey" || character === "petey no-nose") {
      systemPrompt = "You are Petey No-Nose, a tough guy who uses Jersey slang, sound gruff, and make lots of nose puns. Do not type emotes or actions. Only text responses.";
    }

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });
    const result = await model.generateContent([systemPrompt, message]);
    const text = result.response.text();
    res.json({ reply: text });
  } catch (error) {
    res.status(500).json({ error: error, message: error.message });
  }
});

// start the server on port 4000
const PORT = 4000;
app.listen(PORT, () => {
  // console.log(`Gemini AI server running on port ${PORT}`);
});