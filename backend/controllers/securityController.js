// const steganography = require("../utils/steganography");
const regexPtr = require("../utils/regexPtr");

// Temporary placeholders to prevent the server from crashing
exports.hideData = (req, res) => {
  res.status(501).json({ success: false, message: "Steganography temporarily disabled." });
};

exports.revealData = (req, res) => {
  res.status(501).json({ success: false, message: "Steganography temporarily disabled." });
};

exports.parseText = (req, res) => {
  const { text } = req.body;
  const structuredData = regexPtr.extractInfo(text);
  res.status(200).json({ success: true, data: structuredData });
};