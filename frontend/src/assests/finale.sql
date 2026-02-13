-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 11, 2026 at 03:17 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cetup`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_logs`
--

CREATE TABLE `admin_logs` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chapters`
--

CREATE TABLE `chapters` (
  `id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `notes_pdf` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_limit` int(11) DEFAULT NULL COMMENT 'Test time limit in minutes',
  `passing_percentage` int(11) DEFAULT 40 COMMENT 'Passing percentage',
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'Is chapter active for testing',
  `randomize_questions` tinyint(1) DEFAULT 0 COMMENT 'Shuffle questions',
  `randomize_options` tinyint(1) DEFAULT 0 COMMENT 'Shuffle options',
  `questions_per_test` int(11) DEFAULT NULL COMMENT 'Number of questions per test (NULL = all)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chapters`
--

INSERT INTO `chapters` (`id`, `subject_id`, `name`, `notes_pdf`, `created_at`, `time_limit`, `passing_percentage`, `is_active`, `randomize_questions`, `randomize_options`, `questions_per_test`) VALUES
(1, 1, 'Test', 'chapter_1_1770738963520.pdf', '2026-02-10 07:16:35', 10, 50, 1, 1, 1, 10),
(2, 1, 'Units & Measurements', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(3, 1, 'Motion in a Straight Line', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(4, 1, 'Laws of Motion', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(5, 1, 'Work, Energy, and Power', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(6, 1, 'System of Particles & Rotational Motion', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(7, 1, 'Gravitation', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(8, 1, 'Oscillations', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(9, 1, 'Waves', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(10, 1, 'Thermodynamics', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(11, 1, 'Kinetic Theory of Gases', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(12, 1, 'Properties of Bulk Matter', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(13, 1, 'Current Electricity', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(14, 1, 'Electromagnetic Induction', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(15, 1, 'Optics', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(16, 1, 'Modern Physics', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(17, 2, 'Atomic Structure', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(18, 2, 'Chemical Bonding & Molecular Structure', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(19, 2, 'Thermodynamics', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(20, 2, 'Equilibrium', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(21, 2, 'Redox Reactions', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(22, 2, 'The States of Matter', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(23, 2, 'The Solid State', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(24, 2, 'The Solutions', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(25, 2, 'Electrochemistry', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(26, 2, 'Chemical Kinetics', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(27, 2, 'Surface Chemistry', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(28, 2, 'Coordination Compounds', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(29, 2, 'Organic Chemistry', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(30, 2, 'Alcohols, Phenols & Ethers', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(31, 2, 'Biomolecules & Polymers', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(32, 3, 'Sets, Relations, Functions', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(33, 3, 'Complex Numbers & Quadratic Equations', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(34, 3, 'Matrices & Determinants', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(35, 3, 'Permutations & Combinations', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(36, 3, 'Binomial Theorem', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(37, 3, 'Sequences & Series', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(38, 3, 'Straight Lines & Conic Sections', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(39, 3, 'Limits, Continuity, and Differentiability', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(40, 3, 'Differential Equations', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(41, 3, 'Probability & Statistics', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(42, 3, 'Vector Algebra', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(43, 3, 'Trigonometry', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(44, 3, 'Integral Calculus', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(45, 3, 'Three-Dimensional Geometry', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(46, 3, 'Mathematical Reasoning', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(47, 4, 'Diversity of the Living World', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(48, 4, 'Structural Organisation in Animals & Plants', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(49, 4, 'Cell Structure & Function', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(50, 4, 'Plant Physiology', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(51, 4, 'Human Physiology', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(52, 4, 'Reproduction', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(53, 4, 'Genetics & Evolution', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(54, 4, 'Biology in Human Welfare', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(55, 4, 'Biotechnology & Its Applications', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10),
(56, 4, 'Ecology & Environment', NULL, '2026-02-11 13:55:23', 30, 40, 1, 1, 1, 10);

-- --------------------------------------------------------

--
-- Table structure for table `mcqs`
--

CREATE TABLE `mcqs` (
  `id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `question` text NOT NULL,
  `option_a` varchar(255) NOT NULL,
  `option_b` varchar(255) NOT NULL,
  `option_c` varchar(255) NOT NULL,
  `option_d` varchar(255) NOT NULL,
  `correct_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`correct_options`)),
  `explanation` text DEFAULT NULL,
  `correct_option` enum('A','B','C','D') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `difficulty` enum('easy','medium','hard') DEFAULT 'medium'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mcqs`
--

INSERT INTO `mcqs` (`id`, `chapter_id`, `question`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_options`, `explanation`, `correct_option`, `created_at`, `difficulty`) VALUES
(1, 1, 'What is thermodynamics', 'A', 'B', 'C ', 'D', '[\"A\"]', NULL, 'A', '2026-02-10 07:58:50', 'medium'),
(2, 1, 'Hello', 'S', 'A', 'C', 'D', '[\"A\",\"D\"]', NULL, 'A', '2026-02-10 13:54:51', 'medium'),
(3, 1, 'What is Physics', 'A', 'B', 'C', 'D', '[\"A\"]', 'It is because it is', 'A', '2026-02-10 16:09:32', 'medium');

-- --------------------------------------------------------

--
-- Table structure for table `mcq_attempts`
--

CREATE TABLE `mcq_attempts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `attempted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_taken` int(11) DEFAULT NULL COMMENT 'Time taken in seconds',
  `passed` tinyint(1) DEFAULT 0 COMMENT 'Pass/Fail status'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mcq_attempts`
--

INSERT INTO `mcq_attempts` (`id`, `user_id`, `chapter_id`, `score`, `total`, `attempted_at`, `time_taken`, `passed`) VALUES
(1, 1, 1, 1, 2, '2026-02-10 15:35:41', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `created_at`) VALUES
(1, 'Physics', '2026-02-10 06:44:45'),
(2, 'Chemistry', '2026-02-10 06:46:05'),
(3, 'Maths', '2026-02-10 06:46:05'),
(4, 'Biology', '2026-02-10 06:46:05');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','admin') DEFAULT 'student',
  `class` varchar(50) DEFAULT NULL,
  `cet_year` int(4) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'Enable/Disable user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `class`, `cet_year`, `phone`, `address`, `created_at`, `is_active`) VALUES
(1, 'Kartik', 'kartik@test.com', '$2b$10$R6KMv7CoQvDVTuqHUoXtiu.4Tqt53lEQ4TCGuEMYdFkWaq/rlIKj.', 'student', '11th', 2026, '9448789101', 'Gokul Hubli', '2026-02-10 06:34:12', 1),
(2, 'Saanjali', 'saanjali@cetup.com', '$2b$10$IUDKbh0BwAhRirhqwW.Vv.8zu0GP8AOHnFYbnFFebv4LYPZs/eexa', 'admin', NULL, NULL, NULL, NULL, '2026-02-10 06:42:12', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `mcqs`
--
ALTER TABLE `mcqs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Indexes for table `mcq_attempts`
--
ALTER TABLE `mcq_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_logs`
--
ALTER TABLE `admin_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chapters`
--
ALTER TABLE `chapters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `mcqs`
--
ALTER TABLE `mcqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mcq_attempts`
--
ALTER TABLE `mcq_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mcqs`
--
ALTER TABLE `mcqs`
  ADD CONSTRAINT `mcqs_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mcq_attempts`
--
ALTER TABLE `mcq_attempts`
  ADD CONSTRAINT `mcq_attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `mcq_attempts_ibfk_2` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
