const express = require("express");
const router = express.Router();
const performanceController = require("../controllers/performanceController");
const auth = require("../middleware/authMiddleware");

// Student routes - get their own performance
router.get("/insights", auth, performanceController.getPerformanceInsights);
router.get("/recommendations", auth, performanceController.getRecommendations);

module.exports = router;
