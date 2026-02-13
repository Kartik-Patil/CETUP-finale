const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const subjectController = require("../controllers/subjectController");

router.post("/", auth, role("admin"), subjectController.createSubject);
router.get("/", auth, subjectController.getSubjects);
router.delete("/:id", auth, role("admin"), subjectController.deleteSubject);

module.exports = router;