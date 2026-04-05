const steganography = require("../utils/steganography");
const regexPtr = require("../utils/regexPtr");

exports.parseText = (req, res) => {
  const { text } = req.body;
  const structuredData = regexPtr.extractInfo(text);
  res.status(200).json({ success: true, data: structuredData });
};