// Update routes/postRoutes.js

const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// Existing route
router.post("/create", postController.createAndSharePost); // Maps to /save or /create

// 🟢 NEW ROUTES mapping to your Haven frontend structure
router.get("/getPosts", postController.getAllPosts); 
router.get("/postbyid/:id", postController.getPostById);
router.post("/closeIssue/:id", postController.closeIssue);

module.exports = router;