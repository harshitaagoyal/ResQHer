const mongoose = require("mongoose");

const IncidentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false 
  },
  
  extractedData: {
    name: { type: String, default: "Not specified" },
    location: { type: String, default: "Not specified" },
    contactInfo: { type: String, default: "Not specified" },
    frequency: { type: String, default: "Not specified" },
    relationship: { type: String, default: "Not specified" },
    severity: { 
      type: String, 
      enum: ["Low", "Medium", "High", "Very High", "Not specified"],
      default: "Not specified"
    },
    natureOfViolence: { type: String, default: "Not specified" },
    impactOnChildren: { type: String, default: "Not specified" },
    culpritDetails: { type: String, default: "Not specified" }
  },

  narrativeReport: {
    type: String,
    required: false
  },

  status: {
    type: String,
    enum: ["Draft", "Saved", "Reported"],
    default: "Saved"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Incident", IncidentSchema);