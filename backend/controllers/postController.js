// controllers/postController.js
const Post = require("../models/Post");
const twitterUtils = require("../utils/twitter");

/**
 * 🟢 Creates a new post in the DB and optionally shares to Platform X
 */
exports.createAndSharePost = async (req, res) => {
  try {
    const postData = req.body; // This contains the data matching PostInfo

    // 1. Validate and Save to Database
    const newPost = new Post(postData);
    await newPost.save();

    // 2. Check if we need to post to Twitter
    // Assuming the frontend sends 'imageUrl' and 'caption' if they want to tweet
    if (postData.imageUrl && postData.caption) {
      const twitterResult = await twitterUtils.sendMessageToTwitter(
        postData.imageUrl, 
        postData.caption
      );

      return res.status(201).json({
        success: true,
        message: "Post saved and shared to Platform X.",
        dbRecord: newPost,
        twitterResponse: twitterResult
      });
    }

    // 3. If no Twitter info, just return success for DB save
    res.status(201).json({
      success: true,
      message: "Post saved to database.",
      dbRecord: newPost
    });

  } catch (error) {
    console.error("Post Controller Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add these to controllers/postController.js

/**
 * 🟢 Retrieve all posts (Translates: /get-admin-posts)
 */
exports.getAllPosts = async (req, res) => {
  try {
    // Fetches all posts and sorts them by newest first
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
};

/**
 * 🟢 Retrieve a specific post by ID (Translates: /get-post/{post_id})
 */
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ detail: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error retrieving post:", error);
    res.status(500).json({ error: "Invalid ID format or server error" });
  }
};

/**
 * 🟢 Mark an issue as closed (Translates: /close-issue/{issue_id})
 */
exports.closeIssue = async (req, res) => {
  try {
    // Updates the document and returns the newly updated version
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "closed" } },
      { new: true } // Returns the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ detail: "Issue not found or already closed" });
    }

    res.status(200).json({ status: "Issue marked as closed", data: updatedPost });
  } catch (error) {
    console.error("Error closing issue:", error);
    res.status(500).json({ error: "Failed to close issue" });
  }
};