const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: Object, required: true },
  duration_of_abuse: { type: String, required: true },
  frequency_of_incidents: { type: String, required: true },
  preferred_contact_method: { type: [String], required: true }, 
  current_situation: { type: String, required: true },
  culprit_description: { type: String, required: true },
  custom_text: { type: String, default: null }, 
  
  // Appended fields for database tracking
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", PostSchema);