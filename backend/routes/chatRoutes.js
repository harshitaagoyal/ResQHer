// routes/chatRoutes.js
const express = require("express");
const router = express.Router();

// Import the controller
const chatController = require("../controllers/chatController");

// ✅ Fix: Make sure it calls .chat, not .handleChat
router.post("/", chatController.chat);

module.exports = router;