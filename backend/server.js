const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); 
require("dotenv").config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Helps with form data
app.use("/api/security", require("./routes/securityRoutes"));
app.use("/api/knowledge", require("./routes/knowledgeRoutes"));
// --- DATABASE CONNECTION ---

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected: ResQHer Database Ready"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// --- ROUTES ---
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

app.get("/", (req, res) => {
  res.status(200).send("ResQHer API is live and protecting.");
});

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// --- SERVER INITIALIZATION ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});