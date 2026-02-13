-- Database Migration Script
-- This script updates the mcqs table to support multiple correct options and explanations

-- Step 1: Add new columns
ALTER TABLE mcqs 
ADD COLUMN correct_options JSON AFTER option_d,
ADD COLUMN explanation TEXT AFTER correct_options;

-- Step 2: Migrate existing data (if you have existing MCQs with correct_option column)
-- This converts single correct_option values (like 'A', 'B', etc.) to JSON arrays
UPDATE mcqs 
SET correct_options = JSON_ARRAY(correct_option)
WHERE correct_option IS NOT NULL AND correct_options IS NULL;

-- Step 3: (Optional) Drop the old correct_option column after verifying data migration
-- Uncomment the line below only after confirming the migration worked correctly
-- ALTER TABLE mcqs DROP COLUMN correct_option;

-- Verify the migration
SELECT id, question, correct_option, correct_options, explanation FROM mcqs LIMIT 5;
