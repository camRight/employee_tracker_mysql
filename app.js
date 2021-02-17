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
        })
        .catch(error => {
            if (error.isTtyError) {
                console.log("Cannot be rendered in current environment")
            } else {
                throw error;
            }
        });
};



async function addDepartment() {
    const response = await inquirer
        .prompt ([{
            type: "input",
            message: "What department are you adding?",
            name: "department"
        }])
        console.log(response)
        const data = await query(`INSERT INTO department (name) VALUES ("${response.department}");`) 
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
        const data = await query(`INSERT INTO role (title) VALUES ("${response.role}");`)
        menu()
};

async function addEmployees() {
    let roles = query(`SELECT DISTINCT title FROM role ORDER BY title;`);
    console.log(roles)
    let roleArr = Object.value(roles);

    console.log(roleArr);
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
            },
            {
            type: "list",
            message: "Employee's role?",
            choices: [roleArr],
            name: "empRole"
            }
        ])

        // function roleFunc() {
        //     let roleArr = Object.values(roles);
        //     // for (let i= 0; i < roles.length; i++) {
        //     //     roleArr.push(roles[i])
        //     // }




        //     return roleArr;
        // };

        // console.log(roleArr)
        // for (let i = 0; i < data.length; i++) {
        //     if (data[i].title === response.empRole) {
        //         response.role_id = data[i].id;
        //     }
        // } 

        console.log(response)
        const data = await query("INSERT INTO employee SET ?", {
            first_name: response.firstName,
            last_name: response.lastName,
            role_id: response.role_id
        }, (err, data) => {
            if (err) throw err;
        });
        console.table(data)
        menu()
    };

async function viewDepartments() {
   const data = await query("SELECT * FROM department;")
   console.table(data)
   menu()
};

async function viewRoles() {
    const data = await query("SELECT * FROM role;")
    console.table(data)
    menu()
};

async function viewEmployees() {
    const data = await query("SELECT employee.id, employee.first_name, employee.last_name, role.title, FROM employee, role WHERE (employee.role_id=role.id) OR role_id IS NULL;")
    console.table(data)
    menu()
};

function updateRoles() {

};
