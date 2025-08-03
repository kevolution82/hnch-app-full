require('dotenv').config({ path: './app.env' });

const { GoogleGenAI } = require("@google/genai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY
});

async function startChat() {
  const model = ai.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: "Hello, can you tell me a fun fact about computers?",
      },
      {
        role: "model",
        parts: "A fun fact about computers is that the first computer mouse was invented in 1964 and was made of wood.",
      },
    ],
  });

  const msg = "That's cool! What about the internet?";

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  // console.log(text);
}

startChat();