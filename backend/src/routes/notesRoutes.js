const express = require("express");
const router = express.Router();
const multer = require("multer");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const notesController = require("../controllers/notesController");

// Configure multer to use memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Only accept PDF files
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// Error handler middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size too large. Maximum 10MB allowed." });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message || "Failed to upload file" });
  }
  next();
};

// Admin routes
router.post(
  "/chapters/:chapterId/upload",
  auth,
  role("admin"),
  upload.single("pdf"),
  handleMulterError,
  notesController.uploadPDF
);

// Admin route for Google Drive link
router.post(
  "/chapters/:chapterId/google-drive-link",
  auth,
  role("admin"),
  notesController.saveGoogleDriveLink
);

router.delete(
  "/chapters/:chapterId/pdf",
  auth,
  role("admin"),
  notesController.deletePDF
);

// Student routes
router.get(
  "/chapters/:chapterId/check",
  auth,
  notesController.checkPDF
);

router.get(
  "/chapters/:chapterId/view",
  auth,
  notesController.viewPDF
);

module.exports = router;
