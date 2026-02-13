const express = require("express");
const router = express.Router();
const leaderboardController = require("../controllers/leaderboardController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Public/Student routes
router.get("/", leaderboardController.getLeaderboard);

// Admin routes
router.post("/update-rankings", auth, role("admin"), leaderboardController.updateRankings);

module.exports = router;
