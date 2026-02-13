const db = require("../config/db");

// CREATE chapter (Admin)
exports.createChapter = async (req, res) => {
  const { subject_id, name } = req.body;

  if (!subject_id || !name)
    return res.status(400).json({ message: "All fields required" });

  try {
    await db.query(
      "INSERT INTO chapters (subject_id, name) VALUES ($1, $2)",
      [subject_id, name]
    );

    res.status(201).json({ message: "Chapter created" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET chapters by subject (Admin + Student)
exports.getChaptersBySubject = async (req, res) => {
  try {
    const { rows: chapters } = await db.query(
      `SELECT c.id,
              c.subject_id,
              c.name,
              c.time_limit,
              c.passing_percentage,
              c.is_active,
              c.randomize_questions,
              c.randomize_options,
              c.questions_per_test,
              c.notes_pdf,
              COUNT(m.id)::int AS mcq_count,
              CASE WHEN c.notes_pdf IS NOT NULL THEN 1 ELSE 0 END AS has_notes
       FROM chapters c
       LEFT JOIN mcqs m ON m.chapter_id = c.id
       WHERE c.subject_id = $1
       GROUP BY c.id
       ORDER BY c.id`,
      [req.params.subjectId]
    );

    res.json(chapters);

  } catch (err) {
    console.error("Error fetching chapters:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE chapter (Admin)
exports.deleteChapter = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM chapters WHERE id = $1",
      [req.params.id]
    );

    res.json({ message: "Chapter deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE chapter test configuration (Admin)
exports.updateTestConfig = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const {
      time_limit,
      passing_percentage,
      is_active,
      randomize_questions,
      randomize_options,
      questions_per_test
    } = req.body;

    await db.query(
      `UPDATE chapters SET
        time_limit = $1,
        passing_percentage = $2,
        is_active = $3,
        randomize_questions = $4,
        randomize_options = $5,
        questions_per_test = $6
       WHERE id = $7`,
      [
        time_limit,
        passing_percentage,
        is_active,
        randomize_questions,
        randomize_options,
        questions_per_test,
        chapterId
      ]
    );

    res.json({ message: "Test configuration updated successfully" });

  } catch (err) {
    console.error("Error updating test config:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET chapter test configuration
exports.getTestConfig = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT time_limit,
              passing_percentage,
              is_active,
              randomize_questions,
              randomize_options,
              questions_per_test
       FROM chapters
       WHERE id = $1`,
      [req.params.chapterId]
    );

    res.json(rows[0] || {});

  } catch (err) {
    console.error("Error fetching test config:", err);
    res.status(500).json({ message: "Server error" });
  }
};