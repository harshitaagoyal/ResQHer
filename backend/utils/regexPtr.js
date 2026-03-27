// utils/regexPtr.js

exports.extractInfo = (text) => {
  // Matches: "1. Key: Value"
  const pattern = /(\d+)\.\s*(.*?):\s*(.*)/g;
  const dataDict = {};
  let match;

  // Loop through all matches in the text
  while ((match = pattern.exec(text)) !== null) {
    const key = match[2].trim();
    const value = match[3].trim();
    dataDict[key] = value;
  }

  return dataDict;
};