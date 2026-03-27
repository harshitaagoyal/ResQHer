// controllers/securityController.js
const steganography = require("../utils/steganography");
const regexPtr = require("../utils/regexPtr");

// 🟢 Encode Text into Image
exports.hideData = async (req, res) => {
  try {
    if (!req.file || !req.body.text) {
      return res.status(400).json({ error: "Image file and text are required." });
    }

    const encodedBuffer = await steganography.encodeTextInImage(req.file.buffer, req.body.text);
    
    // Send the safe image back to the user
    res.set('Content-Type', 'image/png');
    res.send(encodedBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Decode Text from Image
exports.revealData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required." });
    }

    const hiddenText = await steganography.decodeTextFromImage(req.file.buffer);
    
    res.status(200).json({ success: true, hiddenText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Test the Regex Extractor (Optional: Can be used inside your aiController too)
exports.parseText = (req, res) => {
  const { text } = req.body;
  const structuredData = regexPtr.extractInfo(text);
  res.status(200).json({ success: true, data: structuredData });
};