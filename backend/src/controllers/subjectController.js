const db = require("../config/db");

// CREATE subject (Admin)
exports.createSubject = async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res.status(400).json({ message: "Subject name required" });

  try {
    await db.query(
      "INSERT INTO subjects (name) VALUES ($1)",
      [name]
    );

    res.status(201).json({ message: "Subject created" });

  } catch (err) {
    console.error("Error creating subject:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET all subjects (Admin + Student)
exports.getSubjects = async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM subjects ORDER BY id ASC"
    );

    res.json(rows);

  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE subject (Admin)
exports.deleteSubject = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM subjects WHERE id = $1",
      [req.params.id]
    );

    res.json({ message: "Subject deleted" });

  } catch (err) {
    console.error("Error deleting subject:", err);
    res.status(500).json({ message: "Server error" });
  }
};