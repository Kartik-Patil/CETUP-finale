const db = require("../config/db");
const fs = require("fs");
const path = require("path");

/* Batch Import MCQs from CSV */
exports.batchImportMCQs = async (req, res) => {
  try {
    const { csvData, chapterId } = req.body;
    const adminId = req.user.id;

    if (!csvData || !chapterId) {
      return res.status(400).json({ message: "CSV data and chapter ID required" });
    }

    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    const requiredHeaders = [
      'question',
      'option_a',
      'option_b',
      'option_c',
      'option_d',
      'correct_options'
    ];

    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

    if (missingHeaders.length > 0) {
      return res.status(400).json({
        message: `Missing required columns: ${missingHeaders.join(', ')}`,
        requiredFormat:
          'question,option_a,option_b,option_c,option_d,correct_options,explanation,difficulty'
      });
    }

    let successCount = 0;
    let failCount = 0;
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const values = parseCSVLine(line);
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        if (
          !row.question ||
          !row.option_a ||
          !row.option_b ||
          !row.option_c ||
          !row.option_d ||
          !row.correct_options
        ) {
          errors.push({ line: i + 1, error: 'Missing required fields' });
          failCount++;
          continue;
        }

        let correctOptionsArray;
        try {
          const optionLetters = row.correct_options
            .split(',')
            .map(o => o.trim().toUpperCase());

          correctOptionsArray = optionLetters.map(letter => {
            const map = { A: 'A', B: 'B', C: 'C', D: 'D' };
            return map[letter] || letter;
          });
        } catch (e) {
          errors.push({ line: i + 1, error: 'Invalid correct_options format' });
          failCount++;
          continue;
        }

        await db.query(
          `INSERT INTO mcqs
           (chapter_id, question, option_a, option_b, option_c, option_d,
            correct_options, explanation, difficulty)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            chapterId,
            row.question,
            row.option_a,
            row.option_b,
            row.option_c,
            row.option_d,
            JSON.stringify(correctOptionsArray), // JSONB column recommended
            row.explanation || null,
            row.difficulty || 'medium'
          ]
        );

        successCount++;
      } catch (error) {
        console.error(`Error processing line ${i + 1}:`, error);
        errors.push({ line: i + 1, error: error.message });
        failCount++;
      }
    }

    await db.query(
      `INSERT INTO import_logs
       (admin_id, filename, total_rows, successful_rows, failed_rows, error_log)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        adminId,
        'csv_import',
        lines.length - 1,
        successCount,
        failCount,
        JSON.stringify(errors) // JSONB recommended
      ]
    );

    res.json({
      message: 'Import completed',
      successCount,
      failCount,
      totalRows: lines.length - 1,
      errors: errors.length > 0 ? errors : null
    });

  } catch (error) {
    console.error("Error in batch import:", error);
    res.status(500).json({
      message: "Failed to import MCQs",
      error: error.message
    });
  }
};


/* Parse CSV Line */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}


/* Get Import History */
exports.getImportHistory = async (req, res) => {
  try {
    const { rows: logs } = await db.query(
      `SELECT il.*,
              u.name AS admin_name
       FROM import_logs il
       JOIN users u ON il.admin_id = u.id
       ORDER BY il.imported_at DESC
       LIMIT 50`
    );

    res.json({ logs });

  } catch (error) {
    console.error("Error fetching import history:", error);
    res.status(500).json({ message: "Failed to fetch import history" });
  }
};


/* Download Sample CSV Template */
exports.downloadSampleCSV = (req, res) => {
  const sampleCSV = `question,option_a,option_b,option_c,option_d,correct_options,explanation,difficulty
"What is 2+2?","3","4","5","6","B","Basic arithmetic: 2+2=4",easy
"What is the capital of France?","London","Berlin","Paris","Madrid","C","Paris is the capital city of France",medium
"Which of the following are programming languages? (Multiple answers)","Python","Banana","JavaScript","Apple","A,C","Python and JavaScript are programming languages",medium
"What is the speed of light?","299792458 m/s","300000000 m/s","299000000 m/s","150000000 m/s","A","The exact speed of light in vacuum",hard`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="mcq_import_template.csv"');
  res.send(sampleCSV);
};