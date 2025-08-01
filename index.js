require('dotenv').config({ path: './app.env' });

const { GoogleGenAI } = require("@google/genai");

// Access your API key from the environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("API key not found. Please set the GEMINI_API_KEY environment variable.");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY
});

async function run() {
  // Choose the Gemini model you want to use
  const model = ai.getGenerativeModel({ model: "gemini-pro" });

  const prompt = "Write a short poem about the beauty of the ocean.";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

run();