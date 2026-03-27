// routes/securityRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const securityController = require("../controllers/securityController");

// Use memory storage so we don't save raw files to the hard drive (safer)
const upload = multer({ storage: multer.memoryStorage() });

router.post("/encode", upload.single("image"), securityController.hideData);
router.post("/decode", upload.single("image"), securityController.revealData);
router.post("/parse", securityController.parseText);

module.exports = router;