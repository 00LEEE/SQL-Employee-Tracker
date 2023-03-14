INSERT INTO department (id, departmentName)
VALUES (1, 'Human Resources'), (2, 'Engineering'), (3, 'Information Technology'), (4, 'Maintenance'), (5, 'Management'), (6, 'Marketing');

INSERT INTO job (id, title, salary, departmentID)
VALUES (01, 'HR Analyst', 62000, 1),(02, 'Information Systems Specialist', 55000, 3), (03, 'Mechanical Engineer', 78500, 2), (04, 'General Manager', 87000, 5), (05, 'Business Marketing', 43000, 6), (06, 'Maintenance Technician', 40000, 4);

INSERT INTO employee (firstName, lastName, jobID, managerID) 
VALUES ('Eren', 'Yeager', 3, 1), ('Killua', 'Zoldyck', 6, 1), ('Itachi', 'Uchiha', 5, 1), ('Light', 'Yagami', 1, 1), ('Shoto', 'Todoroki', 4, 1), ('Inosuke', 'Hashibira', 2, NULL);