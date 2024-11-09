const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const ConnectToDB = require("./config/db");
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Enable CORS
const corsOptions = {
  origin: `${process.env.FRONTEND_URI}`, 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

ConnectToDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", contactRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
