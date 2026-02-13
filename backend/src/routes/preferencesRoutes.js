const express = require("express");
const router = express.Router();
const preferencesController = require("../controllers/preferencesController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, preferencesController.getPreferences);
router.put("/", auth, preferencesController.updatePreferences);

module.exports = router;
