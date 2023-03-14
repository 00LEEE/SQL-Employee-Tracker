// Required Dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Connects to the database
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to the employee_db database.");
  questions();
});

// User prompts
function questions() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "userPrompts",
        message: "What would you like to do?",
        choices: [
          "View all Departments",
          "View all Roles",
          "View all Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])
    .then((data) => {
      switch (data.userPrompts) {
        case "View all Departments":
          viewDepartments();
          break;

        case "View all Roles":
          viewJobs();
          break;

        case "View all Employees":
          viewEmployees();
          break;

        case "Add a Department":
          addDepartment();
          break;

        case "Add a Role":
          addJob();
          break;

        case "Add an Employee":
          addEmployee();
          break;

        case "Update an Employee Role":
          employeeUpdate();
          break;
      }
    });
}

// Queries the department table
function viewDepartments() {
  const query = "SELECT department.id AS id, department.departmentName AS name FROM department";
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    questions();
  });
}

// Queries the job table
function viewJobs() {
  const query = "SELECT job.title AS title, job.id AS id, department.departmentName AS department, job.salary AS salary FROM job LEFT JOIN department ON department.id = job.departmentID";
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    questions();
  });
}

// Queries the employee table
function viewEmployees() {
  const query = 'SELECT employee.firstName AS firstName, employee.lastName AS lastName, job.title AS title, department.departmentName AS department, job.salary AS salary, CONCAT_WS(" ", manager.firstName, manager.lastName) AS manager FROM employee LEFT JOIN job ON job.id = employee.jobID LEFT JOIN department ON department.id = job.departmentID LEFT JOIN employee manager on employee.managerID = manager.id';
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    questions();
  });
}

// Prompts the user to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Please enter the name of the department you would like to add.",
      },
    ])
    .then((data) => {
      const query = "INSERT INTO department (departmentName) VALUES(?)";
      db.query(query, data.departmentName, (err, res) => {
        if (err) {
          throw err;
        } else {
          console.log("Department added successfully");
          console.table(res);
          questions();
        }
      });
    });
}