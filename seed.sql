USE employee_tracker_db;

INSERT INTO `department` (name) VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

SELECT * FROM department;

-- VALUES must match schema structure
INSERT INTO `role` (title, salary, department_id) 
VALUES 
	("Sales Lead", 100000.00, 1),
    ("Salesperson", 80000.00, 1),
    ("Lead Engineer", 150000.00, 2),
    ("Software Engineer", 120000.00, 2),
    ("Accountant", 125000.00, 3),
    ("Legal Team Lead", 250000.00, 4),
    ("Lawyer", 190000.00, 4),
    ("Lead Engineer", 150000.00, 2);

SELECT * FROM role;

INSERT INTO `employee` (first_name, last_name) VALUES
	("John", "Doe"),
    ("Mike", "Chan"),
    ("Ashley", "Rodriguez"),
    ("Kevin", "Tupik"),
    ("Malia", "Brown"),
    ("Sarah", "Lourd"),
    ("Tom", "Allen"),
    ("Christian", "Eckenrode");
	
SELECT * FROM employee;