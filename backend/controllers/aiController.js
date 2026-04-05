const aiService = require("../services/aiService");

exports.generateReport = async (req, res) => {
  try {
    const userData = req.body; // Expecting { name, phone, location, etc. }

    if (!userData) {
      return res.status(400).json({ error: "No data provided for the report." });
    }

    const report = await aiService.expandUserText(userData);
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.analyzeIncident = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided for analysis." });
    }

    const structuredData = await aiService.decomposeText(text);

    res.status(200).json({
      success: true,
      data: structuredData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getInspiration = async (req, res) => {
  try {
    const { mood } = req.body; // Optional context like "feeling scared"
    const poem = await aiService.createPoem(mood || "general strength");

    res.status(200).json({
      success: true,
      data: poem
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};