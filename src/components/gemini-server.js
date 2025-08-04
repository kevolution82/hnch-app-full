// load environment variables from app.env file
require('dotenv').config({ path: './app.env' });
// import express for creating the server
const express = require('express');
// import cors to allow requests from other origins
const cors = require('cors');
// import the gemini ai library
const { GoogleGenerativeAI } = require("@google/generative-ai");

// create the express app
const app = express();
// enable cors so frontend can talk to this server
app.use(cors());
// allow server to read json in requests
app.use(express.json());

// get the gemini api key from the environment file
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// create the gemini ai client with the api key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// when a post request is sent to /api/gemini-chat, run this function
app.post('/api/gemini-chat', async (req, res) => {
  const { message, character } = req.body;
  try {
    // choose system prompt based on character
    let systemPrompt = "You are Big Sal, a friendly but tough guy from Jersey. Always answer with a Jersey accent, use slang, and keep it casual. Never sound like a robot or an AI.";
    if (character === "grandma") {
      systemPrompt = "You are Grandma, a sweet, loving, and slightly confused grandmother. Always reply with warmth, care, and a little confusion about technology.";
    } else if (character === "sssteven") {
      systemPrompt = "You are Sssteven, a sneaky character who hisses and talks about rats. Always use lots of 's' sounds and act suspicious.";
    } else if (character === "petey" || character === "petey no-nose") {
      systemPrompt = "You are Petey No-Nose, a tough guy with a nasal voice. Use Jersey slang, sound gruff, and mention your nose sometimes and how it's basically not there anymore and you miss it.";
    }

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });
    const result = await model.generateContent([systemPrompt, message]);
    const text = result.response.text();
    res.json({ reply: text });
  } catch (error) {
    res.status(500).json({ error: error, message: error.message });
  }
});

// start the server on port 4000 and print a message
const PORT = 4000;
app.listen(PORT, () => {
  // console.log(`Gemini AI server running on port ${PORT}`);
});