const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const { rows: existing } = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.length > 0)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const { rows: users } = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (users.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows: users } = await db.query(
      `SELECT id, name, email, role, class, cet_year, phone, address
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json(users[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, class: userClass, cet_year, phone, address } = req.body;

    // Check if email already exists (excluding current user)
    if (email) {
      const { rows: existing } = await db.query(
        "SELECT id FROM users WHERE email = $1 AND id != $2",
        [email, userId]
      );

      if (existing.length > 0)
        return res.status(409).json({ message: "Email already in use" });
    }

    const updates = [];
    const values = [];
    let index = 1;

    if (name !== undefined) {
      updates.push(`name = $${index++}`);
      values.push(name);
    }

    if (email !== undefined) {
      updates.push(`email = $${index++}`);
      values.push(email);
    }

    if (userClass !== undefined) {
      updates.push(`class = $${index++}`);
      values.push(userClass);
    }

    if (cet_year !== undefined) {
      updates.push(`cet_year = $${index++}`);
      values.push(cet_year);
    }

    if (phone !== undefined) {
      updates.push(`phone = $${index++}`);
      values.push(phone);
    }

    if (address !== undefined) {
      updates.push(`address = $${index++}`);
      values.push(address);
    }

    if (updates.length === 0)
      return res.status(400).json({ message: "No fields to update" });

    values.push(userId);

    await db.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = $${index}`,
      values
    );

    const { rows: updatedUser } = await db.query(
      `SELECT id, name, email, role, class, cet_year, phone, address
       FROM users
       WHERE id = $1`,
      [userId]
    );

    res.json(updatedUser[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};