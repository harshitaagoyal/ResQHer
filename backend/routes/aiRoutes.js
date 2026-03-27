const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// Define the endpoints
router.post("/generate-report", aiController.generateReport);
router.post("/analyze-incident", aiController.analyzeIncident);
router.post("/get-inspiration", aiController.getInspiration);

module.exports = router;