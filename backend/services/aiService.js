const { GoogleGenerativeAI } = require("@google/generative-ai");
const Prompts = require("./prompts"); // Ensure the path is correct
require("dotenv").config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using the 2026 workhorse model
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

// 🧠 EXPAND USER TEXT (Formal Report Generation)
exports.expandUserText = async (data) => {
  try {
    // Injecting user data into the detailed prompt template
    let prompt = Prompts.USER_POST_TEXT_EXPANSION_PROMPT
      .replace("{{name}}", data.name || "Not specified")
      .replace("{{phone}}", data.phone || "Not specified")
      .replace("{{location}}", data.location || "Not specified")
      .replace("{{duration}}", data.duration || "Not specified")
      .replace("{{frequency}}", data.frequency || "Not specified")
      .replace("{{contactMethod}}", data.contactMethod || "Not specified")
      .replace("{{situation}}", data.situation || "Not specified")
      .replace("{{culprit}}", data.culprit || "Not specified");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error (Expand):", error);
    throw error;
  }
};

// Add this function to services/aiService.js

// Update this function in services/aiService.js

exports.getChatResponse = async (userMessage, history = [], mode = "general") => {
  try {
    // Determine which prompt to use based on the mode
    let systemInstruction = Prompts.SYSTEM_CHAT_PROMPT; // Default
    
    if (mode === "law") systemInstruction = Prompts.LAW_BOT_PROMPT;
    if (mode === "therapy") systemInstruction = Prompts.THERAPY_BOT_PROMPT;

    const chat = model.startChat({
      history: history,
      systemInstruction: systemInstruction,
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(`AI Service Error (${mode}):`, error);
    throw error;
  }
};

// 🧠 DECOMPOSE TEXT (Structured Data Extraction)
exports.decomposeText = async (userInput) => {
  try {
    // Combine the extraction instructions with the user's raw paragraph
    const prompt = `${Prompts.USER_POST_TEXT_DECOMPOSITION_PROMPT}\n\nInput Paragraph: ${userInput}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error (Decompose):", error);
    throw error;
  }
};

// 🧠 CREATE POEM (Inspirational Content)
exports.createPoem = async (userInput) => {
  try {
    // Use the specific rhyming poem prompt for ResQHer
    const prompt = `${Prompts.INSPIRATION_POEM_PROMPT}\n\nContext/Mood for the poem: ${userInput}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error (Poem):", error);
    throw error;
  }
};