const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const mcqController = require("../controllers/mcqController");

// Image upload fields for MCQs
const mcqImageFields = upload.fields([
  { name: 'question_image', maxCount: 1 },
  { name: 'option_a_image', maxCount: 1 },
  { name: 'option_b_image', maxCount: 1 },
  { name: 'option_c_image', maxCount: 1 },
  { name: 'option_d_image', maxCount: 1 }
]);

router.post("/", auth, role("admin"), mcqImageFields, mcqController.createMCQ);
router.get("/admin/:chapterId", auth, role("admin"), mcqController.getAdminMCQsByChapter);
router.put("/:mcqId", auth, role("admin"), mcqImageFields, mcqController.updateMCQ);
router.delete("/:mcqId", auth, role("admin"), mcqController.deleteMCQ);
router.get("/:chapterId", auth, mcqController.getMCQsByChapter);
router.get("/:chapterId/check-attempt", auth, mcqController.checkAttempt);
router.post(
  "/:chapterId/submit",
  auth,
  mcqController.submitMCQs
);

module.exports = router;