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
  const { message } = req.body;
  try {
    // system prompt for jersey wiseguy
    const systemPrompt = "You are Big Sal, a friendly but tough guy from Jersey. Always answer with a Jersey accent, use slang, and keep it casual. Never sound like a robot or an AI.";
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });
    // send both the system prompt and the user message
    const result = await model.generateContent([systemPrompt, message]);
    const text = result.response.text();
    res.json({ reply: text });
  } catch (error) {
    // console.error("Gemini error:", error);
    // send the full error to the frontend for now (for debugging)
    res.status(500).json({ error: error, message: error.message });
  }
});

// start the server on port 4000 and print a message
const PORT = 4000;
app.listen(PORT, () => {
  // console.log(`Gemini AI server running on port ${PORT}`);
});