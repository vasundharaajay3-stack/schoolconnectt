CREATE DATABASE IF NOT EXISTS schoolconnect;
USE schoolconnect;
CREATE TABLE IF NOT EXISTS student (
  admission_no VARCHAR(20) PRIMARY KEY,
  student_name VARCHAR(100) NOT NULL,
  class_number TINYINT NOT NULL CHECK (class_number BETWEEN 1 AND 7),
  section VARCHAR(5) NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS teacher (
  teacher_id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS admin (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  admin_name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS attendance (
  attendance_id INT AUTO_INCREMENT PRIMARY KEY,
  admission_no VARCHAR(20) NOT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('Present','Absent') NOT NULL,
  UNIQUE KEY uq_student_day (admission_no, attendance_date),
  FOREIGN KEY (admission_no) REFERENCES student(admission_no) ON DELETE CASCADE
);
