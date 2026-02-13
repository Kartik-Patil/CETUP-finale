const db = require("../config/db");

/* Get Global Leaderboard */
exports.getLeaderboard = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const userId = req.user?.id;

    const { rows: leaderboard } = await db.query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u.total_points,
        u.rank,
        u.streak_days,
        COUNT(DISTINCT ma.id)::int AS total_tests,
        ROUND(AVG((ma.score::float / NULLIF(ma.total,0)) * 100), 2) AS avg_score,
        COUNT(DISTINCT ub.badge_id)::int AS badges_earned,
        MAX(ma.created_at) AS last_test_date
      FROM users u
      LEFT JOIN mcq_attempts ma ON u.id = ma.user_id
      LEFT JOIN user_badges ub ON u.id = ub.user_id
      WHERE u.role = 'student' AND u.is_active = true
      GROUP BY u.id
      ORDER BY u.total_points DESC, u.rank ASC
      LIMIT $1 OFFSET $2`,
      [parseInt(limit), parseInt(offset)]
    );

    let currentUserRank = null;

    if (userId) {
      const { rows } = await db.query(
        `SELECT 
          u.id,
          u.name,
          u.total_points,
          u.rank,
          u.streak_days,
          COUNT(DISTINCT ma.id)::int AS total_tests,
          ROUND(AVG((ma.score::float / NULLIF(ma.total,0)) * 100), 2) AS avg_score,
          COUNT(DISTINCT ub.badge_id)::int AS badges_earned
        FROM users u
        LEFT JOIN mcq_attempts ma ON u.id = ma.user_id
        LEFT JOIN user_badges ub ON u.id = ub.user_id
        WHERE u.id = $1
        GROUP BY u.id`,
        [userId]
      );
      currentUserRank = rows[0] || null;
    }

    const { rows: countRows } = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM users
       WHERE role = 'student' AND is_active = true`
    );

    const total = countRows[0].total;

    res.json({
      leaderboard,
      currentUserRank,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < total
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};


/* Update User Rankings (Postgres Version using ROW_NUMBER) */
exports.updateRankings = async (req, res) => {
  try {
    await db.query(`
      UPDATE users u
      SET rank = ranked.new_rank
      FROM (
        SELECT id,
               ROW_NUMBER() OVER (ORDER BY total_points DESC, id ASC) AS new_rank
        FROM users
        WHERE role = 'student' AND is_active = true
      ) ranked
      WHERE u.id = ranked.id
    `);

    res.json({ message: "Rankings updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update rankings" });
  }
};


/* Calculate and Award Points */
exports.awardPoints = async (userId, score, total, timeTaken, chapterId) => {
  try {
    const percentage = (score / total) * 100;
    let points = 0;

    if (percentage >= 90) points += 50;
    else if (percentage >= 80) points += 40;
    else if (percentage >= 70) points += 30;
    else if (percentage >= 60) points += 20;
    else if (percentage >= 50) points += 10;

    if (percentage === 100) points += 25;

    const { rows: chapterRows } = await db.query(
      `SELECT time_limit, questions_per_test
       FROM chapters
       WHERE id = $1`,
      [chapterId]
    );

    const chapter = chapterRows[0];

    if (chapter && chapter.time_limit && timeTaken) {
      const expectedTime = (chapter.questions_per_test || total) * 2 * 60;
      if (timeTaken < expectedTime * 0.5) {
        points += 15;
      }
    }

    await db.query(
      `UPDATE users
       SET total_points = total_points + $1,
           last_activity = NOW()
       WHERE id = $2`,
      [points, userId]
    );

    await checkAndAwardBadges(userId);
    await updateStreak(userId);

    return points;

  } catch (error) {
    console.error(error);
    return 0;
  }
};


/* Check and Award Badges */
async function checkAndAwardBadges(userId) {
  try {
    const { rows: userRows } = await db.query(
      `SELECT 
        u.total_points,
        u.streak_days,
        COUNT(DISTINCT ma.id)::int AS total_tests,
        MAX((ma.score::float / NULLIF(ma.total,0)) * 100) AS best_score
       FROM users u
       LEFT JOIN mcq_attempts ma ON u.id = ma.user_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [userId]
    );

    const user = userRows[0];
    if (!user) return;

    const { rows: availableBadges } = await db.query(
      `SELECT *
       FROM badges
       WHERE id NOT IN (
         SELECT badge_id FROM user_badges WHERE user_id = $1
       )`,
      [userId]
    );

    for (const badge of availableBadges) {
      let shouldAward = false;

      switch (badge.name) {
        case 'First Steps':
          shouldAward = user.total_tests >= 1;
          break;
        case 'Bronze Achiever':
          shouldAward = user.total_points >= 100;
          break;
        case 'Silver Star':
          shouldAward = user.total_points >= 500;
          break;
        case 'Gold Champion':
          shouldAward = user.total_points >= 1000;
          break;
        case 'Diamond Elite':
          shouldAward = user.total_points >= 5000;
          break;
        case '3-Day Streak':
          shouldAward = user.streak_days >= 3;
          break;
        case 'Week Warrior':
          shouldAward = user.streak_days >= 7;
          break;
        case 'Month Master':
          shouldAward = user.streak_days >= 30;
          break;
        case 'Perfect Score':
          shouldAward = user.best_score === 100;
          break;
      }

      if (shouldAward) {
        await db.query(
          `INSERT INTO user_badges (user_id, badge_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [userId, badge.id]
        );
      }
    }

  } catch (error) {
    console.error(error);
  }
}


/* Update User Streak (Postgres Date Handling) */
async function updateStreak(userId) {
  try {
    const { rows } = await db.query(
      `SELECT last_activity::date AS last_date
       FROM users
       WHERE id = $1`,
      [userId]
    );

    const lastDate = rows[0]?.last_date;

    if (!lastDate) {
      await db.query(
        `UPDATE users SET streak_days = 1 WHERE id = $1`,
        [userId]
      );
      return;
    }

    const { rows: diffRows } = await db.query(
      `SELECT CURRENT_DATE - $1::date AS diff`,
      [lastDate]
    );

    const diffDays = diffRows[0].diff;

    if (diffDays === 1) {
      await db.query(
        `UPDATE users SET streak_days = streak_days + 1 WHERE id = $1`,
        [userId]
      );
    } else if (diffDays > 1) {
      await db.query(
        `UPDATE users SET streak_days = 1 WHERE id = $1`,
        [userId]
      );
    }

  } catch (error) {
    console.error(error);
  }
}

module.exports.updateStreak = updateStreak;