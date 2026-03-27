const aiService = require("../services/aiService");

/**
 * 🟢 Main Chat Controller for ResQHer
 * Handles real-time empathetic support, legal awareness, and safety advice.
 * * Expected Request Body:
 * {
 * "message": "User's text input",
 * "history": [], // Optional array of previous messages
 * "mode": "law" | "therapy" | "general" // Optional mode to switch AI personality
 * }
 */
exports.chat = async (req, res) => {
  try {
    const { message, history, mode } = req.body;

    // 1. Validation: Ensure there is a message to process
    if (!message || message.trim() === "") {
      return res.status(400).json({ 
        success: false, 
        error: "Message is required to get a response." 
      });
    }

    // 2. Logging for debugging (helps track which bot is being used)
    const activeMode = mode || "general";
    console.log(`[Chat] Mode: ${activeMode} | Message: ${message}`);

    /** * 3. Call the Chat Service
     * We pass the message, the conversation history, and the specific mode.
     * The service will use the prompts from prompts.js based on this mode.
     */
    const reply = await aiService.getChatResponse(
      message, 
      history || [], 
      activeMode
    );

    // 4. Return the AI response along with the mode used
    res.status(200).json({ 
      success: true,
      reply,
      mode: activeMode 
    });

  } catch (error) {
    console.error("Chat Controller Error:", error);
    
    // 5. Detailed Error Response with safety instructions
    res.status(500).json({ 
      success: false,
      error: "The AI assistant is currently unavailable. Please try again or contact emergency services immediately if you are in danger.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};