// utils/twitter.js
const { TwitterApi } = require("twitter-api-v2");
const axios = require("axios");
require("dotenv").config();

/**
 * Downloads an image from a URL and posts it to Twitter/X with a caption.
 */
exports.sendMessageToTwitter = async (imageUrl, caption) => {
  try {
    // 1. Authenticate (Using standard OAuth 1.0a User Context)
    const client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    // 2. Download the image into memory as an ArrayBuffer
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data, "binary");

    // Extract mime type from response headers, default to png
    const mimeType = response.headers["content-type"] || "image/png";

    // 3. Upload the media to Twitter (v1.1 API)
    const mediaId = await client.v1.uploadMedia(imageBuffer, { mimeType });

    // 4. Create the tweet (v2 API)
    const { data: createdTweet } = await client.v2.tweet(caption, {
      media: { media_ids: [mediaId] },
    });

    return { message: "Tweet posted successfully", data: createdTweet };
  } catch (error) {
    console.error("Twitter Utility Error:", error);
    // Extract a cleaner error message if it comes from the Twitter API
    const errorMessage = error.data?.detail || error.message || "Failed to post to Twitter";
    throw new Error(errorMessage);
  }
};