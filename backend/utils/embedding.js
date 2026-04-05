const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateTextEmbedding = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    
    const result = await model.embedContent({
      content: text,
      taskType: "RETRIEVAL_DOCUMENT",
      title: "Embedding of info",
    });
    return result.embedding.values; 
  } catch (error) {
    console.error("Embedding Error:", error);
    throw error;
  }
};