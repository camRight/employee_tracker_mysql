const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const util = require("util");
const { error } = require("console");
const { DefaultDeserializer } = require("v8");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_tracker_db"
})

const query = util.promisify(connection.query).bind(connection);

connection.connect(function (error) {
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
                case "Update employee roles":
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
        .prompt([{
            type: "input",
            message: "What department are you adding?",
            name: "department"
        }])
    console.log(response)
    const data = await query(`INSERT INTO department (name) VALUES ("${response.department}");`)
    menu()
};

async function addRoles() {

    const depArr = await query("SELECT * FROM department")
    const newDepArr = depArr.map(department => ({ name: department.name, value: department.id }))
    const response = inquirer
        .prompt([
            {
                type: "input",
                message: "What role are you adding?",
                name: "role"
            },
            {
                type: "input",
                message: "What salary should this role have? Salary number MUST end in the hundredths place: e.g. 75000.00",
                name: "salary"
            },
            {
                type: "list",
                message: "What department is this role in?",
                choices: newDepArr,
                name: "roleSal"

            }
        ])
        .then(async response => {
            console.log(response)
            const data = await query("INSERT INTO role SET ?", {
                title: response.role,
                salary: response.salary,
                department_id: response.roleSal
            });
            console.log("New role added.")
            menu()
        })

};





async function addEmployees() {

    // RowDataPacket is a normal constructor object in an array
    // let roles = await query(`SELECT DISTINCT title FROM role ORDER BY id;`);
    // console.log(roles)

    // console.log(roles)
    // let roleObj = (Object.values(roles));

    // checking if array
    // console.log([0].constructor.name);

    //  may need to concat arrays? probably not though... one big array

    // let roleArr = [i].;

    // console.log(error, roleObj); 
    // returns 8

    // rolesArr[[role, id], [role, id]...]


    // let rolesArr = [];
    // roles.forEach((obj, i) => {
    //     let roleAndId = [obj.title, roles[i]]
    //     rolesArr.push(roleAndId)

    //     // below works
    //     // rolesArr.push(obj.title)
    //     idNum = roles[i]
    // });

    //  psuedo column with id that passes along both name and number



    // console.log((roles[0].title));
    // console.log(rolesArr);
    const rolesArr = await query("SELECT * FROM role")
    const newRolesArr = rolesArr.map(role => ({ name: role.title, value: role.id }))

    const employeeTable = await query("SELECT * FROM employee")
    // console.log(employeeTable)
    const newEmployeeTable = employeeTable.map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee.id }))
    // console.log(newEmployeeTable)
    const response = await inquirer
        .prompt([
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
                choices: newRolesArr,
                name: "empRole"
            },
            {
                type: "list",
                message: "Who is the manager?",
                choices: newEmployeeTable,
                name: "manager"
            }
        ])

    const data = await query("INSERT INTO employee SET ?", {
        first_name: response.firstName,
        last_name: response.lastName,
        role_id: response.empRole,
        manager_id: response.manager
    });
    console.log("New employee added.")
    menu()
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
    // todo left join
    // left join shows all rows in table
    // this will show when there is a primary key and secondary key match
    const data = await query("SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee left join role ON employee.role_id=role.id;")
    console.table(data)
    menu()
};

// let the user pick the employee to update the employee role


async function updateRoles() {
    // viewing employees
    const employeeTable = await query("SELECT * FROM employee")
    console.log(employeeTable)
    const newEmployeeTable = employeeTable.map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee.id }))
    console.log(newEmployeeTable)



    // viewing roles to map
    const rolesArr = await query("SELECT * FROM role")
    const newRolesArr = rolesArr.map(role => ({ name: role.title, value: role.id }))

    const response = await inquirer
        .prompt([
            // for update employees role, not implemented.
            // {
            //     type: "input",
            //     message: "Empolyee's first name for update:",
            //     name: "updateFirst"
            // },
            // {
            //     type: "input",
            //     message: "Employee's last name for update:",
            //     name: "employeeLast"
            // },

            {
                type: "list",
                message: "Update info on which employee?",
                choices: newEmployeeTable,
                name: "employeeId"
            },
            {
                type: "list",
                message: "Update which role?",
                choices: newRolesArr,
                name: "roleId"
            } 
        ])
    const data = await query("UPDATE employee SET ? WHERE ?",
        [
            {role_id: response.roleId },
            { id: response.employeeId}
        ])
        console.log("Employees new role updated.")
        menu()
    
};
