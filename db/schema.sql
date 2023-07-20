-- Drop the database if it already exists
DROP DATABASE IF EXISTS companyData_db;

-- Create a new database named companyData_db
CREATE DATABASE companyData_db;

-- Use the companyData_db database
USE companyData_db;

CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR(255) NOT NULL
);

CREATE TABLE role (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255),
salary DECIMAL(10,2),
department_id INT,
FOREIGN KEY (department_id)
REFERENCES department(id)
ON DELETE SET NULL
);

CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT,
manager_id INT NOT NULL,
FOREIGN KEY(role_id)
REFERENCES role(id)
ON DELETE SET NULL
);