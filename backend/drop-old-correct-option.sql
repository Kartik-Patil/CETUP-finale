-- Migration to remove the old correct_option column
-- Run this on your Render PostgreSQL database

-- Verify the column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'mcqs' AND column_name IN ('correct_option', 'correct_options');

-- Drop the old correct_option column
ALTER TABLE mcqs DROP COLUMN IF EXISTS correct_option;

-- Verify the column was dropped
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'mcqs' AND column_name IN ('correct_option', 'correct_options');
