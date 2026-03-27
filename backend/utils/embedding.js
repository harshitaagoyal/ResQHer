// utils/embedding.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * 🟢 Generates a 768-dimensional vector from text using Gemini
 */
exports.generateTextEmbedding = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    
    const result = await model.embedContent({
      content: text,
      taskType: "RETRIEVAL_DOCUMENT",
      title: "Embedding of info",
    });

    // Returns an array of 768 floats
    return result.embedding.values; 
  } catch (error) {
    console.error("Embedding Error:", error);
    throw error;
  }
};