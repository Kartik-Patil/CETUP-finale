const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const chapterController = require("../controllers/chapterController");

router.post("/", auth, role("admin"), chapterController.createChapter);
router.get("/:subjectId", auth, chapterController.getChaptersBySubject);
router.delete("/:id", auth, role("admin"), chapterController.deleteChapter);

// Test configuration
router.put("/:chapterId/test-config", auth, role("admin"), chapterController.updateTestConfig);
router.get("/:chapterId/test-config", auth, chapterController.getTestConfig);

module.exports = router;