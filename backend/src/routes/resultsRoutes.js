const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const resultController = require("../controllers/resultController");

// student
router.get("/my", auth, resultController.getMyResults);
router.get("/my-results", auth, resultController.getMyResults);

// admin
router.get("/analytics", auth, role("admin"), resultController.getAnalytics);

module.exports = router;