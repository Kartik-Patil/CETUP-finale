const db = require("../config/db");

/* Get User Preferences */
exports.getPreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows } = await db.query(
      `SELECT * 
       FROM user_preferences
       WHERE user_id = $1`,
      [userId]
    );

    if (rows.length === 0) {
      // Return default preferences if none exist
      return res.json({
        theme: "light",
        notifications_enabled: true,
        email_notifications: true,
        language: "en"
      });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch preferences" });
  }
};


/* Update User Preferences */
exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      theme,
      notifications_enabled,
      email_notifications,
      language
    } = req.body;

    await db.query(
      `INSERT INTO user_preferences
        (user_id, theme, notifications_enabled, email_notifications, language)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id)
       DO UPDATE SET
         theme = EXCLUDED.theme,
         notifications_enabled = EXCLUDED.notifications_enabled,
         email_notifications = EXCLUDED.email_notifications,
         language = EXCLUDED.language`,
      [
        userId,
        theme,
        notifications_enabled,
        email_notifications,
        language
      ]
    );

    res.json({ message: "Preferences updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update preferences" });
  }
};