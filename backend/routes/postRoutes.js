const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/create", postController.createAndSharePost);
router.get("/getPosts", postController.getAllPosts); 
router.get("/postbyid/:id", postController.getPostById);
router.post("/closeIssue/:id", postController.closeIssue);

module.exports = router;