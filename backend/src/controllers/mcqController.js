const db = require("../config/db");
const { awardPoints } = require("./leaderboardController");

/* ADMIN: Add MCQ */
exports.createMCQ = async (req, res) => {
  const {
    chapter_id,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_options,
    explanation,
    difficulty,
  } = req.body;

  if (
    !chapter_id || !question ||
    !option_a || !option_b ||
    !option_c || !option_d ||
    !Array.isArray(correct_options) ||
    correct_options.length === 0
  ) {
    return res.status(400).json({ message: "All fields required" });
  }

  const questionImage = req.files?.question_image?.[0]?.filename || null;
  const optionAImage = req.files?.option_a_image?.[0]?.filename || null;
  const optionBImage = req.files?.option_b_image?.[0]?.filename || null;
  const optionCImage = req.files?.option_c_image?.[0]?.filename || null;
  const optionDImage = req.files?.option_d_image?.[0]?.filename || null;

  await db.query(
    `INSERT INTO mcqs
     (chapter_id, question, question_image,
      option_a, option_a_image,
      option_b, option_b_image,
      option_c, option_c_image,
      option_d, option_d_image,
      correct_options, explanation, difficulty)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [
      chapter_id,
      question,
      questionImage,
      option_a,
      optionAImage,
      option_b,
      optionBImage,
      option_c,
      optionCImage,
      option_d,
      optionDImage,
      JSON.stringify(correct_options),
      explanation || null,
      difficulty || "medium",
    ]
  );

  res.status(201).json({ message: "MCQ created" });
};


/* ADMIN: Get MCQs */
exports.getAdminMCQsByChapter = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, question, question_image,
              option_a, option_a_image,
              option_b, option_b_image,
              option_c, option_c_image,
              option_d, option_d_image,
              correct_options, explanation, difficulty
       FROM mcqs
       WHERE chapter_id = $1`,
      [req.params.chapterId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch MCQs" });
  }
};


/* STUDENT: Get MCQs */
exports.getMCQsByChapter = async (req, res) => {
  const { rows } = await db.query(
    `SELECT id, question, question_image,
            option_a, option_a_image,
            option_b, option_b_image,
            option_c, option_c_image,
            option_d, option_d_image
     FROM mcqs
     WHERE chapter_id = $1`,
    [req.params.chapterId]
  );
  res.json(rows);
};


/* DELETE MCQ */
exports.deleteMCQ = async (req, res) => {
  await db.query("DELETE FROM mcqs WHERE id = $1", [req.params.mcqId]);
  res.json({ message: "MCQ deleted successfully" });
};


/* UPDATE MCQ */
exports.updateMCQ = async (req, res) => {
  const { mcqId } = req.params;
  const {
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_options,
    explanation,
    difficulty
  } = req.body;

  if (!question || !option_a || !option_b || !option_c || !option_d || !correct_options)
    return res.status(400).json({ message: "All fields required" });

  await db.query(
    `UPDATE mcqs SET
      question = $1,
      option_a = $2,
      option_b = $3,
      option_c = $4,
      option_d = $5,
      correct_options = $6,
      explanation = $7,
      difficulty = $8
     WHERE id = $9`,
    [
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      JSON.stringify(correct_options),
      explanation || null,
      difficulty || "medium",
      mcqId
    ]
  );

  res.json({ message: "MCQ updated successfully" });
};


/* CHECK ATTEMPT */
exports.checkAttempt = async (req, res) => {
  const userId = req.user.id;
  const chapterId = req.params.chapterId;

  const { rows: attempts } = await db.query(
    `SELECT * FROM mcq_attempts
     WHERE user_id = $1 AND chapter_id = $2`,
    [userId, chapterId]
  );

  if (attempts.length === 0)
    return res.json({ attempted: false });

  const attempt = attempts[0];

  const { rows: questionAttempts } = await db.query(
    `SELECT qa.mcq_id, qa.selected_options, qa.is_correct,
            m.correct_options, m.explanation
     FROM question_attempts qa
     JOIN mcqs m ON qa.mcq_id = m.id
     WHERE qa.attempt_id = $1 AND qa.user_id = $2`,
    [attempt.id, userId]
  );

  const results = questionAttempts.map(qa => ({
    mcqId: qa.mcq_id,
    correctOptions: typeof qa.correct_options === 'string' 
      ? JSON.parse(qa.correct_options) 
      : qa.correct_options,
    explanation: qa.explanation,
    isCorrect: qa.is_correct === true,
    userAnswers: typeof qa.selected_options === 'string'
      ? JSON.parse(qa.selected_options)
      : qa.selected_options
  }));

  res.json({
    attempted: true,
    previousResult: {
      score: attempt.score,
      total: attempt.total,
      passed: attempt.passed,
      pointsEarned: attempt.points_earned || 0,
      results
    }
  });
};


/* SUBMIT MCQs */
exports.submitMCQs = async (req, res) => {
  const { answers, time_taken } = req.body;
  const userId = req.user.id;
  const chapterId = req.params.chapterId;

  const { rows: existing } = await db.query(
    `SELECT id FROM mcq_attempts
     WHERE user_id = $1 AND chapter_id = $2`,
    [userId, chapterId]
  );

  if (existing.length > 0)
    return res.status(400).json({
      message: "You have already attempted this test."
    });

  let score = 0;
  const results = [];

  for (const ans of answers) {
    const { rows } = await db.query(
      `SELECT correct_options, explanation
       FROM mcqs WHERE id = $1`,
      [ans.mcqId]
    );

    const mcq = rows[0];
    if (!mcq) continue;

    const correctOptions = typeof mcq.correct_options === 'string'
      ? JSON.parse(mcq.correct_options)
      : mcq.correct_options;
    const selectedOptions = Array.isArray(ans.selected)
      ? ans.selected
      : [ans.selected];

    const isCorrect =
      correctOptions.length === selectedOptions.length &&
      correctOptions.sort().join(",") ===
      selectedOptions.sort().join(",");

    if (isCorrect) score++;

    results.push({
      mcqId: ans.mcqId,
      isCorrect,
      correctOptions,
      userAnswers: selectedOptions,
      explanation: mcq.explanation
    });
  }

  const { rows: chapterRows } = await db.query(
    `SELECT passing_percentage FROM chapters WHERE id = $1`,
    [chapterId]
  );

  const passingPercentage = chapterRows[0]?.passing_percentage || 40;
  const scorePercentage = (score / answers.length) * 100;
  const passed = scorePercentage >= passingPercentage;

  const pointsEarned = await awardPoints(
    userId,
    score,
    answers.length,
    time_taken,
    chapterId
  );

  const { rows: attemptRows } = await db.query(
    `INSERT INTO mcq_attempts
     (user_id, chapter_id, score, total, time_taken, passed)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id`,
    [userId, chapterId, score, answers.length, time_taken || null, passed]
  );

  const attemptId = attemptRows[0].id;

  for (const result of results) {
    await db.query(
      `INSERT INTO question_attempts
       (user_id, mcq_id, attempt_id, selected_options, is_correct)
       VALUES ($1,$2,$3,$4,$5)`,
      [
        userId,
        result.mcqId,
        attemptId,
        JSON.stringify(result.userAnswers),
        result.isCorrect
      ]
    );
  }

  res.json({
    score,
    total: answers.length,
    results,
    passed,
    passingPercentage,
    pointsEarned
  });
};