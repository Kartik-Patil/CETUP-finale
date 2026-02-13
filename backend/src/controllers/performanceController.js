const db = require("../config/db");

/* Get Student Performance Insights */
exports.getPerformanceInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    /* 1. Overall Stats */
    const { rows: overallRows } = await db.query(
      `SELECT 
        COUNT(DISTINCT ma.id)::int AS total_tests,
        COUNT(DISTINCT ma.chapter_id)::int AS chapters_attempted,
        AVG((ma.score::float / NULLIF(ma.total,0)) * 100) AS avg_score,
        SUM(ma.score)::int AS total_correct,
        SUM(ma.total)::int AS total_questions,
        SUM(CASE WHEN ma.passed = true THEN 1 ELSE 0 END)::int AS tests_passed,
        AVG(ma.time_taken) AS avg_time_taken,
        u.total_points,
        u.rank,
        u.streak_days
      FROM users u
      LEFT JOIN mcq_attempts ma ON u.id = ma.user_id
      WHERE u.id = $1
      GROUP BY u.id`,
      [userId]
    );

    const overallStats = overallRows[0] || {};

    /* 2. Chapter Performance */
    const { rows: chapterPerformance } = await db.query(
      `SELECT 
        c.id AS chapter_id,
        c.name AS chapter_name,
        s.name AS subject_name,
        ma.score,
        ma.total,
        ROUND((ma.score::float / NULLIF(ma.total,0)) * 100, 2) AS percentage,
        ma.passed,
        ma.time_taken,
        ma.created_at AS attempted_at
      FROM mcq_attempts ma
      JOIN chapters c ON ma.chapter_id = c.id
      JOIN subjects s ON c.subject_id = s.id
      WHERE ma.user_id = $1
      ORDER BY ma.created_at DESC`,
      [userId]
    );

    /* 3. Difficulty Performance */
    const { rows: difficultyPerformance } = await db.query(
      `SELECT 
        m.difficulty,
        COUNT(qa.id)::int AS total_attempted,
        SUM(CASE WHEN qa.is_correct = true THEN 1 ELSE 0 END)::int AS correct_answers,
        ROUND(
          SUM(CASE WHEN qa.is_correct = true THEN 1 ELSE 0 END)::float 
          / NULLIF(COUNT(qa.id),0) * 100, 2
        ) AS accuracy
      FROM question_attempts qa
      JOIN mcqs m ON qa.mcq_id = m.id
      WHERE qa.user_id = $1
      GROUP BY m.difficulty`,
      [userId]
    );

    /* 4. Weak Topics */
    const { rows: weakTopics } = await db.query(
      `SELECT 
        c.id AS chapter_id,
        c.name AS chapter_name,
        s.name AS subject_name,
        ROUND((AVG(ma.score::float / NULLIF(ma.total,0)) * 100), 2) AS percentage,
        COUNT(DISTINCT ma.id)::int AS attempts
      FROM mcq_attempts ma
      JOIN chapters c ON ma.chapter_id = c.id
      JOIN subjects s ON c.subject_id = s.id
      WHERE ma.user_id = $1
      GROUP BY c.id, c.name, s.name
      HAVING AVG(ma.score::float / NULLIF(ma.total,0)) * 100 < 60
      ORDER BY percentage ASC
      LIMIT 5`,
      [userId]
    );

    /* 5. Strong Topics */
    const { rows: strongTopics } = await db.query(
      `SELECT 
        c.id AS chapter_id,
        c.name AS chapter_name,
        s.name AS subject_name,
        ROUND((AVG(ma.score::float / NULLIF(ma.total,0)) * 100), 2) AS percentage,
        COUNT(DISTINCT ma.id)::int AS attempts
      FROM mcq_attempts ma
      JOIN chapters c ON ma.chapter_id = c.id
      JOIN subjects s ON c.subject_id = s.id
      WHERE ma.user_id = $1
      GROUP BY c.id, c.name, s.name
      HAVING AVG(ma.score::float / NULLIF(ma.total,0)) * 100 >= 80
      ORDER BY percentage DESC
      LIMIT 5`,
      [userId]
    );

    /* 6. Recent Progress */
    const { rows: recentProgress } = await db.query(
      `SELECT 
        ma.id,
        c.name AS chapter_name,
        ROUND((ma.score::float / NULLIF(ma.total,0)) * 100, 2) AS percentage,
        ma.passed,
        ma.created_at
      FROM mcq_attempts ma
      JOIN chapters c ON ma.chapter_id = c.id
      WHERE ma.user_id = $1
      ORDER BY ma.created_at DESC
      LIMIT 10`,
      [userId]
    );

    /* 7. Time Analysis */
    const { rows: timeAnalysis } = await db.query(
      `SELECT 
        created_at::date AS date,
        COUNT(*)::int AS tests_taken,
        AVG((score::float / NULLIF(total,0)) * 100) AS avg_score
      FROM mcq_attempts
      WHERE user_id = $1
        AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY created_at::date
      ORDER BY date DESC`,
      [userId]
    );

    /* 8. Badges */
    const { rows: badges } = await db.query(
      `SELECT 
        b.id,
        b.name,
        b.description,
        b.category,
        b.points_required,
        ub.earned_at
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = $1
      ORDER BY ub.earned_at DESC`,
      [userId]
    );

    /* Update weak/strong topics */
    const weakTopicIds = weakTopics.map(t => t.chapter_id);
    const strongTopicIds = strongTopics.map(t => t.chapter_id);

    await db.query(
      `UPDATE users
       SET weak_topics = $1,
           strong_topics = $2
       WHERE id = $3`,
      [
        JSON.stringify(weakTopicIds),
        JSON.stringify(strongTopicIds),
        userId
      ]
    );

    res.json({
      overallStats,
      chapterPerformance,
      difficultyPerformance,
      weakTopics,
      strongTopics,
      recentProgress,
      timeAnalysis,
      badges
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch performance insights" });
  }
};


/* Get Recommendations */
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows: recommendations } = await db.query(
      `SELECT 
        c.id AS chapter_id,
        c.name AS chapter_name,
        s.name AS subject_name,
        COUNT(m.id)::int AS available_questions,
        COALESCE(
          (
            SELECT ROUND(AVG(ma2.score::float / NULLIF(ma2.total,0)) * 100, 2)
            FROM mcq_attempts ma2
            WHERE ma2.user_id = $1
              AND ma2.chapter_id = c.id
          ), 0
        ) AS current_accuracy,
        'Practice this chapter to improve' AS reason
      FROM chapters c
      JOIN subjects s ON c.subject_id = s.id
      JOIN mcqs m ON c.id = m.chapter_id
      WHERE c.is_active = true
      GROUP BY c.id, c.name, s.name
      HAVING COALESCE(
               (
                 SELECT AVG(ma2.score::float / NULLIF(ma2.total,0)) * 100
                 FROM mcq_attempts ma2
                 WHERE ma2.user_id = $1
                   AND ma2.chapter_id = c.id
               ), 0
             ) < 70
      ORDER BY current_accuracy ASC, available_questions DESC
      LIMIT 5`,
      [userId]
    );

    res.json({ recommendations });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
};