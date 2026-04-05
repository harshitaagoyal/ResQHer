const express = require("express");
const router = express.Router();
const multer = require("multer");
const securityController = require("../controllers/securityController");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/encode", upload.single("image"), securityController.hideData);
router.post("/decode", upload.single("image"), securityController.revealData);
router.post("/parse", securityController.parseText);

module.exports = router;