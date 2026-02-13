const express = require("express");
const cors = require("cors");
const path = require("path");
const mcqRoutes = require("./routes/mcqRoutes");
const resultsRoutes = require("./routes/resultsRoutes");
const notesRoutes = require("./routes/notesRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const batchImportRoutes = require("./routes/batchImportRoutes");
const preferencesRoutes = require("./routes/preferencesRoutes");

const app = express();

// CORS Configuration for production (Vercel + Render)
const frontendUrls = process.env.FRONTEND_URLS 
  ? process.env.FRONTEND_URLS.split(',').map(url => url.trim())
  : [];

const allowedOrigins = [
  "http://localhost:3000", // Local development
  "http://localhost:3001",
  ...frontendUrls, // Your frontend URLs from .env
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serve static files for images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/mcqs", mcqRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/batch-import", batchImportRoutes);
app.use("/api/preferences", preferencesRoutes);

app.get("/", (req, res) => {
  res.json({ message: "CETUp Backend is running 🚀" });
});

module.exports = app;