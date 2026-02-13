const db = require("../config/db");

/* Extract Google Drive File ID */
const extractGoogleDriveFileId = (url) => {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/open\?id=([a-zA-Z0-9_-]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

/* Convert to Embed URL */
const convertToGoogleDriveEmbed = (url) => {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return null;
  return `https://drive.google.com/file/d/${fileId}/preview`;
};


/* Upload Disabled */
exports.uploadPDF = async (req, res) => {
  return res.status(400).json({
    message: "File uploads are disabled. Please use Google Drive links instead."
  });
};


/* Save Google Drive Link */
exports.saveGoogleDriveLink = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { googleDriveLink } = req.body;

    if (!googleDriveLink)
      return res.status(400).json({ message: "Google Drive link is required" });

    const embedLink = convertToGoogleDriveEmbed(googleDriveLink);
    if (!embedLink)
      return res.status(400).json({
        message: "Invalid Google Drive link format"
      });

    const pdfData = JSON.stringify({
      storage_type: "google_drive",
      google_drive_url: embedLink,
      original_url: googleDriveLink,
      uploaded_at: new Date().toISOString()
    });

    const result = await db.query(
      `UPDATE chapters
       SET notes_pdf = $1
       WHERE id = $2`,
      [pdfData, chapterId]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Chapter not found" });

    res.json({
      message: "Google Drive link saved successfully",
      storage_type: "google_drive"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to save Google Drive link",
      error: error.message
    });
  }
};


/* Delete PDF Link */
exports.deletePDF = async (req, res) => {
  try {
    const { chapterId } = req.params;

    await db.query(
      `UPDATE chapters
       SET notes_pdf = NULL
       WHERE id = $1`,
      [chapterId]
    );

    res.json({ message: "Google Drive link removed successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete PDF link" });
  }
};


/* Check if PDF Exists */
exports.checkPDF = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const { rows } = await db.query(
      `SELECT notes_pdf
       FROM chapters
       WHERE id = $1`,
      [chapterId]
    );

    const chapter = rows[0];

    const hasPDF = !!chapter?.notes_pdf;
    let pdfInfo = null;

    if (hasPDF) {
      try {
        pdfInfo = JSON.parse(chapter.notes_pdf);
      } catch {
        pdfInfo = { original_name: chapter.notes_pdf };
      }
    }

    res.json({
      hasPDF,
      filename: pdfInfo?.original_name || null,
      cloudinary: !!pdfInfo?.public_id,
      storage_type: pdfInfo?.storage_type || "unknown",
      notes_pdf: chapter?.notes_pdf
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to check PDF" });
  }
};


/* View PDF */
exports.viewPDF = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const userId = req.user.id;

    const { rows: chapterRows } = await db.query(
      `SELECT notes_pdf
       FROM chapters
       WHERE id = $1`,
      [chapterId]
    );

    const chapter = chapterRows[0];

    if (!chapter || !chapter.notes_pdf)
      return res.status(404).json({ message: "PDF not found" });

    const { rows: userRows } = await db.query(
      `SELECT name, email
       FROM users
       WHERE id = $1`,
      [userId]
    );

    const user = userRows[0];

    try {
      const pdfData = JSON.parse(chapter.notes_pdf);

      if (pdfData.storage_type === "google_drive") {
        console.log("Redirecting user:", user?.name);
        return res.redirect(pdfData.google_drive_url);
      }

      return res.status(400).json({
        message: "PDF not available. Please contact admin."
      });

    } catch {
      return res.status(400).json({
        message: "Invalid PDF data."
      });
    }

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Failed to load PDF",
        error: error.message
      });
    }
  }
};