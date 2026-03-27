// utils/steganography.js
const sharp = require('sharp');

const END_MARKER = "1111111111111110";

// Helper: Convert text to binary string
const textToBinary = (text) => {
  let bin = "";
  for (let i = 0; i < text.length; i++) {
    bin += text.charCodeAt(i).toString(2).padStart(8, '0');
  }
  return bin + END_MARKER;
};

// Helper: Convert binary string back to text
const binaryToText = (binary) => {
  let text = "";
  for (let i = 0; i < binary.length; i += 8) {
    let byte = binary.substring(i, i + 8);
    if (byte.length === 8) {
      text += String.fromCharCode(parseInt(byte, 2));
    }
  }
  return text;
};

exports.encodeTextInImage = async (imageBuffer, text) => {
  try {
    // Read raw pixels. ensureAlpha() standardizes channels to 4 (RGBA)
    const { data, info } = await sharp(imageBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const binaryText = textToBinary(text);

    // info.channels will be 4 because of ensureAlpha()
    if (binaryText.length > (data.length / info.channels)) {
      throw new Error("Text is too long to hide in this image.");
    }

    let bitIdx = 0;
    // Iterate through pixels. data[i] is Red, data[i+1] is Green, etc.
    for (let i = 0; i < data.length; i += info.channels) {
      if (bitIdx < binaryText.length) {
        const bit = parseInt(binaryText[bitIdx], 10);
        // Modify LSB of the Red channel (matches Python logic)
        data[i] = (data[i] & ~1) | bit;
        bitIdx++;
      } else {
        break;
      }
    }

    // Return as PNG buffer (PNG is lossless, which is required for LSB)
    return await sharp(data, {
      raw: { width: info.width, height: info.height, channels: info.channels }
    }).png().toBuffer();

  } catch (error) {
    console.error("Steganography Encode Error:", error);
    throw error;
  }
};

exports.decodeTextFromImage = async (imageBuffer) => {
  try {
    const { data, info } = await sharp(imageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    let binaryText = "";

    // Iterate through pixels to read the Red channel LSB
    for (let i = 0; i < data.length; i += info.channels) {
      binaryText += (data[i] & 1).toString();

      // Check if we hit the end marker
      if (binaryText.endsWith(END_MARKER)) {
        const cleanBinary = binaryText.slice(0, -16); // Remove end marker
        return binaryToText(cleanBinary);
      }
    }
    return ""; // No hidden text found
  } catch (error) {
    console.error("Steganography Decode Error:", error);
    throw error;
  }
};