CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department (
id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(30)
);

CREATE TABLE role (
id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30),
-- decimal 20 is the twenty digits in front of the decimal, the 2 is to the hundredth place
salary DECIMAL (20, 2),
department_id INTEGER,
foreign key(department_id) references department(id)
);

CREATE TABLE employee (
id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INTEGER,
foreign key(role_id) REFERENCES role(id),
manager_id INTEGER,
FOREIGN KEY(manager_id) REFERENCES employee(id)
);