const Post = require("../models/Post");

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