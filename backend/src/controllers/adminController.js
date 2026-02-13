const db = require("../config/db");

/* ADMIN: Get dashboard statistics */
exports.getDashboardStats = async (req, res) => {
  try {
    const { rows: [{ total_students }] } = await db.query(
      "SELECT COUNT(*)::int AS total_students FROM users WHERE role = 'student'"
    );

    const { rows: [{ total_subjects }] } = await db.query(
      "SELECT COUNT(*)::int AS total_subjects FROM subjects"
    );

    const { rows: [{ total_chapters }] } = await db.query(
      "SELECT COUNT(*)::int AS total_chapters FROM chapters"
    );

    const { rows: [{ total_mcqs }] } = await db.query(
      "SELECT COUNT(*)::int AS total_mcqs FROM mcqs"
    );

    const { rows: [{ attempts_today }] } = await db.query(
      `SELECT COUNT(*)::int AS attempts_today
       FROM mcq_attempts
       WHERE attempted_at::date = CURRENT_DATE`
    );

    const { rows: [{ attempts_week }] } = await db.query(
      `SELECT COUNT(*)::int AS attempts_week
       FROM mcq_attempts
       WHERE DATE_TRUNC('week', attempted_at) = DATE_TRUNC('week', NOW())`
    );

    const { rows: [{ avg_score }] } = await db.query(
      `SELECT AVG((score::float / total) * 100) AS avg_score
       FROM mcq_attempts
       WHERE total > 0`
    );

    const { rows: most_attempted } = await db.query(
      `SELECT c.name AS chapter, s.name AS subject, COUNT(*)::int AS attempts
       FROM mcq_attempts ma
       JOIN chapters c ON ma.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       GROUP BY ma.chapter_id, c.name, s.name
       ORDER BY attempts DESC
       LIMIT 5`
    );

    const { rows: recent_activity } = await db.query(
      `SELECT u.name AS student_name,
              s.name AS subject,
              c.name AS chapter,
              ma.score,
              ma.total,
              ma.attempted_at
       FROM mcq_attempts ma
       JOIN users u ON ma.user_id = u.id
       JOIN chapters c ON ma.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       ORDER BY ma.attempted_at DESC
       LIMIT 10`
    );

    res.json({
      total_students,
      total_subjects,
      total_chapters,
      total_mcqs,
      attempts_today,
      attempts_week,
      avg_score: Math.round(avg_score || 0),
      most_attempted,
      recent_activity
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
};


/* ADMIN: Get all students */
exports.getAllStudents = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT u.id, u.name, u.email, u.is_active, u.created_at,
              COUNT(DISTINCT ma.id)::int AS total_attempts,
              AVG(CASE WHEN ma.total > 0 THEN (ma.score::float / ma.total) * 100 END) AS avg_score
       FROM users u
       LEFT JOIN mcq_attempts ma ON u.id = ma.user_id
       WHERE u.role = 'student'
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};


/* ADMIN: Get student details */
exports.getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    const { rows: studentRows } = await db.query(
      `SELECT id, name, email, is_active, created_at
       FROM users
       WHERE id = $1 AND role = 'student'`,
      [studentId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = studentRows[0];

    const { rows: test_history } = await db.query(
      `SELECT s.name AS subject,
              c.name AS chapter,
              ma.score,
              ma.total,
              ma.passed,
              ma.time_taken,
              ma.attempted_at
       FROM mcq_attempts ma
       JOIN chapters c ON ma.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       WHERE ma.user_id = $1
       ORDER BY ma.attempted_at DESC`,
      [studentId]
    );

    const { rows: summaryRows } = await db.query(
      `SELECT COUNT(*)::int AS total_attempts,
              AVG(CASE WHEN total > 0 THEN (score::float / total) * 100 END) AS avg_score,
              (SUM(CASE WHEN passed = true THEN 1 ELSE 0 END)::float
               / NULLIF(COUNT(*), 0)) * 100 AS pass_rate
       FROM mcq_attempts
       WHERE user_id = $1`,
      [studentId]
    );

    const summary = summaryRows[0];

    res.json({
      student,
      test_history,
      summary: {
        total_attempts: summary.total_attempts || 0,
        avg_score: Math.round(summary.avg_score || 0),
        pass_rate: Math.round(summary.pass_rate || 0)
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch student details" });
  }
};


/* ADMIN: Toggle student active status */
exports.toggleStudentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { is_active } = req.body;

    await db.query(
      `UPDATE users
       SET is_active = $1
       WHERE id = $2 AND role = 'student'`,
      [is_active, studentId]
    );

    res.json({ message: "Student status updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update student status" });
  }
};


/* ADMIN: Enhanced analytics */
exports.getEnhancedAnalytics = async (req, res) => {
  try {
    const { rows: subject_performance } = await db.query(
      `SELECT s.id AS subject_id,
              s.name AS subject_name,
              COUNT(DISTINCT m.id)::int AS total_mcqs,
              COUNT(DISTINCT ma.id)::int AS total_attempts,
                ROUND(AVG(CASE WHEN ma.total > 0 THEN (ma.score::numeric / ma.total) * 100 END), 2) AS avg_score,
                ROUND((SUM(CASE WHEN ma.passed = true THEN 1 ELSE 0 END)::numeric
                  / NULLIF(COUNT(ma.id), 0)) * 100, 2) AS pass_rate
       FROM subjects s
       LEFT JOIN chapters c ON s.id = c.subject_id
       LEFT JOIN mcqs m ON c.id = m.chapter_id
       LEFT JOIN mcq_attempts ma ON c.id = ma.chapter_id
       GROUP BY s.id, s.name
       ORDER BY avg_score DESC`
    );

    const { rows: chapter_statistics } = await db.query(
      `SELECT s.name AS subject_name,
              c.name AS chapter_name,
              COUNT(DISTINCT m.id)::int AS total_mcqs,
              COUNT(DISTINCT ma.id)::int AS total_attempts,
                ROUND(AVG(CASE WHEN ma.total > 0 THEN (ma.score::numeric / ma.total) * 100 END), 2) AS avg_score,
                ROUND((SUM(CASE WHEN ma.passed = true THEN 1 ELSE 0 END)::numeric
                  / NULLIF(COUNT(ma.id), 0)) * 100, 2) AS pass_rate,
                ROUND(AVG(ma.time_taken)::numeric, 0) AS avg_time_taken,
              MAX(ma.attempted_at) AS last_attempt
       FROM chapters c
       JOIN subjects s ON c.subject_id = s.id
       LEFT JOIN mcqs m ON c.id = m.chapter_id
       LEFT JOIN mcq_attempts ma ON c.id = ma.chapter_id
       GROUP BY c.id, c.name, s.name
       ORDER BY total_attempts DESC
       LIMIT 50`
    );

    const { rows: performance_trends } = await db.query(
      `SELECT attempted_at::date AS date,
              COUNT(*)::int AS tests_taken,
              ROUND(AVG(CASE WHEN total > 0 THEN (score::numeric / total) * 100 END), 2) AS avg_score,
              COUNT(DISTINCT user_id)::int AS unique_students
       FROM mcq_attempts
       WHERE attempted_at >= NOW() - INTERVAL '30 days'
       GROUP BY attempted_at::date
       ORDER BY date ASC`
    );

    const { rows: difficulty_performance } = await db.query(
      `SELECT m.difficulty,
              COUNT(DISTINCT m.id)::int AS total_questions
       FROM mcqs m
       GROUP BY m.difficulty`
    );

    res.json({
      subject_performance,
      chapter_statistics,
      performance_trends,
      difficulty_performance
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};