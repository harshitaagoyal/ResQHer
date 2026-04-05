const express = require("express");
const router = express.Router();
const knowledgeController = require("../controllers/knowledgeController");

router.post("/upload_embeddings", knowledgeController.uploadEmbeddings);
router.post("/find-match", knowledgeController.findMatch);

module.exports = router;