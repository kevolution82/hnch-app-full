require('dotenv').config({ path: './app.env' });

const { GoogleGenAI } = require("@google/genai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY
});

async function run() {
  const model = ai.getGenerativeModel({ model: "gemini-pro" });
  const prompt = "Write a short poem about the beauty of the ocean.";
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
  } catch (error) {
  }
}

run();