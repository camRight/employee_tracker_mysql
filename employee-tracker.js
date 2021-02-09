const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const util = require("util");
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_tracker_db"
})

const query = util.promisify(connection.query).bind(connection);

connection.connect(function(error) {
    if (error) {
        throw error
    }
    console.log("connection ID", connection.threadId)
    menu()
})

// Add departments, roles, employees

// View departments, roles, employees

// Update employee roles
function menu() {

    inquirer
        .prompt([
            {
                type: "list",
                message: "Select the following",
                choices: ["Add departments", "Add roles", "Add employees", "View departments",
                    "View roles", "View employees", "Update employee roles"
                ],
                name: "choices"
            }
        ])
        .then(answers => {
            switch (answers.choices) {
                case "Add departments":
                    addDepartment()
                    break;
                case "Add roles":
                    addRoles()
                    break;
                case "Add employees":
                    addEmployees()
                    break;
                case "View departments":
                    viewDepartments()
                    break;
                case "View roles":
                    viewRoles()
                    break;
                case "View employees":
                    viewEmployees()
                    break;
                // default: update employee roles.
                default:
                    updateRoles()
                    break;
            }
            // Use user feedback for... whatever!!
        })
        .catch(error => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else when wrong
            }
        });

}





async function addDepartment() {
    const response = await inquirer
        .prompt ([{
            type: "input",
            message: "What department are you adding?",
            name: "department"
        }])
        console.log(response)
        const data = await query(`INSERT INTO department (name) VALUES ("${response.department}")`) 
        menu()
};

async function addRoles() {
    const response = await inquirer
        .prompt ([
            {
            type: "input",
            message: "What role are you adding?",
            name: "role"
            }
        ])
        console.log(response)
        const data = await query(`INSERT INTO role (title) VALUES ("${response.role}")`)
        menu()
};

async function addEmployees() {
    const response = await inquirer
        .prompt ([
            {
            type: "input",
            message: "Employee's first name?",
            name: "firstName"
            },
            {
            type: "input",
            message: "Employee's last name?",
            name: "lastName"
            }
        ])
        console.log(response)
        const data = await query(`INSERT INTO employee (first_name, last_name) VALUES ("${response.firstName}, ${response.lastName}")`)
        menu()
    };

async function viewDepartments() {
   const data = await query("SELECT * FROM department")
   console.table(data)
   menu()
};

async function viewRoles() {
    const data = await query("SELECT * FROM role")
    console.table(data)
    menu()
};

async function viewEmployees() {
    const data = await query("SELECT * FROM employee")
    console.table(data)
    menu()
};

function updateRoles() {

};
