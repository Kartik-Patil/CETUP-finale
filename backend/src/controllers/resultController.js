const db = require("../config/db");

/* STUDENT: My results */
exports.getMyResults = async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows } = await db.query(
      `
      SELECT 
        ma.id,
        ma.score,
        ma.total AS total_marks,
        ma.attempted_at,
        c.name AS chapter_name,
        s.name AS subject_name
      FROM mcq_attempts ma
      JOIN chapters c ON ma.chapter_id = c.id
      JOIN subjects s ON c.subject_id = s.id
      WHERE ma.user_id = $1
      ORDER BY ma.attempted_at DESC
      `,
      [userId]
    );

    res.json(rows);

  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Failed to fetch results" });
  }
};


/* ADMIN: Analytics */
exports.getAnalytics = async (req, res) => {
  try {
    const { rows } = await db.query(
      `
      SELECT 
        s.name AS subject,
        c.name AS chapter,
        COUNT(ma.id)::int AS attempts,
        AVG(ma.score)::numeric(10,2) AS avg_score,
        AVG(ma.total)::numeric(10,2) AS avg_total
      FROM mcq_attempts ma
      JOIN chapters c ON ma.chapter_id = c.id
      JOIN subjects s ON c.subject_id = s.id
      GROUP BY c.id, c.name, s.name
      `
    );

    res.json(rows);

  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};