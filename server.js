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

async function addJob() {
    const departmentChoices = await departmentID();
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the title of the new role:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary for the new role:",
        },
        {
          type: "list",
          name: "department",
          message: "Select the department ID for the new role:",
          choices: departmentChoices,
        },
      ])
      .then((data) => {
        const query = `INSERT INTO job (title, salary, departmentID) 
                       VALUES ("${data.title}", "${data.salary}", "${data.department}")`;
  
        db.query(query, (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} role added!\n`);
          questions();
        });
      });
  }
  

  // Queries the department table
  function departmentID() {
    return new Promise((resolve, reject) => {
      const departmentID = [];
      db.query("SELECT * FROM department", function (err, res) {
        if (err) {
          reject(err);
        } else {
          for (let i = 0; i < res.length; i++) {
            departmentID.push(res[i].id);
          }
          resolve(departmentID);
        }
      });
    });
  }
  
// Prompts the user to add an Employee
function addEmployee() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message:
            "Please enter the first name of the employee you would like to add.",
        },
        {
          type: "input",
          name: "last_name",
          message:
            "Please enter the last name of the employee you would like to add.",
        },
        {
          type: "list",
          name: "job_id",
          message:
            "Please choose the role ID of the employee you would like to add.",
          choices: employeeRole(),
        },
        {
          type: "list",
          name: "manager_id",
          message:
            "Please choose the manager ID of the employee you would like to add.",
          choices: employeeIDList(),
        },
      ])
      // Adds the user selection to the employee table
      .then(function (data) {
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.first_name}","${data.last_name}", "${data.job_id}", "${data.manager_id}")`;
  
        db.query(query, (err, res) => {
          if (err) {
            throw err;
          } else {
            console.table(res);
            questions();
          }
        });
      });
}
  
  // Adds the user selection to the employee table
  .then(function(data) {
    const query = `INSERT INTO employee (firstName, lastName, jobID, managerID) VALUES ("${data.first_name}", "${data.last_name}", "${data.job_id}", "${data.manager_id}")`;
  
    db.query(query, (err, res) => {
      if (err) {
        throw err;
      } else {
        console.table(res);
        questions();
      }
    });
});

function employeeRole() {
  const employeeRoles = [];
  db.query("SELECT * FROM job", (err, res) => {
    if (err) {
      throw err;
    } else {
      for (let i = 0; i < res.length; i++) {
        employeeRoles.push(res[i].id);
      }
    }
  });
  return employeeRoles;
}

  
  function employeeIDList() {
    const managerRoles = [];
    db.query("SELECT * FROM employee", (err, res) => {
      if (err) {
        throw err;
      } else {
        for (let i = 0; i < res.length; i++) {
          managerRoles.push(res[i].id);
        }
      }
    });
    return managerRoles;
  }
  
  function employeeUpdate() {
    inquirer
      .prompt([
        {
          name: "employeeID",
          type: "list",
          message: "Please select the employee ID you would like to update.",
          choices: employeeIDList(),
        },
        {
          name: "jobID",
          type: "list",
          message:
            "Please select the role ID of the employee you would like to update.",
          choices: employeeRoleID(),
        },
      ])
      .then(function (data) {
        const query = `UPDATE employee SET jobID = "${data.jobID}" WHERE id = "${data.employeeID}"`;
        db.query(query, (err, res) => {
          if (err) {
            throw err;
          } else {
            console.table(res);
            questions();
          }
        });
      });
  }
  
  function employeeRoleID() {
    const employeeJobID = [];
    db.query("SELECT * FROM job", (err, res) => {
      if (err) {
        throw err;
      } else {
        for (let i = 0; i < res.length; i++) {
          employeeJobID.push(res[i].id);
        }
      }
    });
    return employeeJobID;
  }
  
  questions();
  