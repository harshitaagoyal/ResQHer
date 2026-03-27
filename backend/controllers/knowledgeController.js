// controllers/knowledgeController.js
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { generateTextEmbedding } = require("../utils/embedding");

/**
 * 🟢 Read local documents and upload their embeddings to MongoDB
 * (Translates: /upload_embeddings)
 */
exports.uploadEmbeddings = async (req, res) => {
  try {
    const docsDir = path.join(__dirname, "../../docs"); // Assuming 'docs' is at root level
    const files = fs.readdirSync(docsDir);

    const collection = mongoose.connection.collection("doc_embedding");

    let uploadedCount = 0;

    for (const filename of files) {
      const filePath = path.join(docsDir, filename);
      
      // Read file content (Translates your common.py logic)
      if (fs.statSync(filePath).isFile() && filename.endsWith(".txt")) {
        const content = fs.readFileSync(filePath, "utf-8");
        
        // Generate Vector Embedding
        const embedding = await generateTextEmbedding(content);

        // Save to Database natively (NO Python Pickle!)
        await collection.insertOne({
          filename: filename,
          embedding: embedding, // Stored natively as an array of floats
          content: content.substring(0, 500), // Store first 500 chars as preview
          uploadedAt: new Date()
        });
        
        uploadedCount++;
      }
    }

    res.status(200).json({ message: `Successfully uploaded ${uploadedCount} document embeddings.` });
  } catch (error) {
    console.error("Upload Embeddings Error:", error);
    res.status(500).json({ error: "Failed to upload embeddings", details: error.message });
  }
};

/**
 * 🟢 Find matches using MongoDB Atlas Vector Search
 * (Translates: /find-match)
 */
exports.findMatch = async (req, res) => {
  try {
    const { info, collectionName } = req.body; // Pass the text to search for, and the collection

    if (!info || !collectionName) {
      return res.status(400).json({ error: "Missing 'info' text or 'collectionName'" });
    }

    // 1. Convert user query to vector
    const descriptionEmbedding = await generateTextEmbedding(info);

    // 2. Perform Vector Search (Direct translation of your MongoDB Pipeline)
    const collection = mongoose.connection.collection(collectionName);
    
    const results = await collection.aggregate([
      {
        $vectorSearch: {
          path: collectionName === "complains2" ? "culprit_embedding" : "embedding",
          index: collectionName === "complains2" ? "culpritIndex2" : "docIndex", // Must match your Atlas Index name
          queryVector: descriptionEmbedding,
          numCandidates: 100,
          limit: 1, // num_results = 1
        }
      },
      {
        $project: {
          _id: 1,
          filename: 1,
          content: 1,
          culprit: 1,
          score: { $meta: "vectorSearchScore" } // Gets the similarity score natively
        }
      }
    ]).toArray();

    res.status(200).json({ success: true, matches: results });

  } catch (error) {
    console.error("Find Match Error:", error);
    res.status(500).json({ error: "Failed to find matches" });
  }
};