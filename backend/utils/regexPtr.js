exports.extractInfo = (text) => {
  const pattern = /(\d+)\.\s*(.*?):\s*(.*)/g;
  const dataDict = {};
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const key = match[2].trim();
    const value = match[3].trim();
    dataDict[key] = value;
  }

  return dataDict;
};