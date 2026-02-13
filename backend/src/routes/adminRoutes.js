const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const adminController = require("../controllers/adminController");

// Dashboard statistics
router.get("/dashboard/stats", auth, role("admin"), adminController.getDashboardStats);

// Student management
router.get("/students", auth, role("admin"), adminController.getAllStudents);
router.get("/students/:studentId", auth, role("admin"), adminController.getStudentDetails);
router.put("/students/:studentId/status", auth, role("admin"), adminController.toggleStudentStatus);

// Enhanced analytics
router.get("/analytics/enhanced", auth, role("admin"), adminController.getEnhancedAnalytics);

module.exports = router;
