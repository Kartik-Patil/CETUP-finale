const express = require("express");
const router = express.Router();
const batchImportController = require("../controllers/batchImportController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Admin routes
router.post("/mcqs", auth, role("admin"), batchImportController.batchImportMCQs);
router.get("/history", auth, role("admin"), batchImportController.getImportHistory);
router.get("/sample-csv", batchImportController.downloadSampleCSV);

module.exports = router;
