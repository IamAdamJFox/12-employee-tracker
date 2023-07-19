// Imports
const mysql = require('mysql2');
const inquirer = require('inquirer');


const server = mysql.createConnection({
  host: 'localhost',
  port: 3001,
  user: 'root',
  password: 'Iamthebest1993',
  database: 'company_db',
});

server.connect((err) => {
  if (err) throw err;
  console.log('Welcome to the company database!');

  start();
})

// Initialize the server
function start() {
    inquirer
        .prompt({
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Add a manager",
                "Update an employee's role",
                "View employees by manager",
                "View employees by department",
                "Delete department, role, or employee",
                "View total utilized budget of a department",
                "Exit",
            ],
        })
        .then(({ action }) => {
            switch (action) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viewAllEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Add a manager":
                    addManager();
                    break;
                case "Update an employee's role":
                    updateEmployeeRole();
                    break;
                case "View employees by manager":
                    viewEmployeesByManager();
                    break;
                case "View employees by department":
                    viewEmployeesByDepartment();
                    break;
                case "Exit":
                    connection.end();
                    console.log("Goodbye!");
                    break;
            }
        });
}

// View all departments
function viewAllDepartments() {
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// View all roles
function viewAllRoles() {
    const query = `
        SELECT 
            roles.title, 
            roles.id, 
            departments.department_name, 
            roles.salary 
        FROM 
            roles 
        JOIN 
            departments 
        ON 
            roles.department_id = departments.id
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// View all employees
function viewAllEmployees() {
    const query = `
        SELECT 
            e.id, 
            e.first_name, 
            e.last_name, 
            r.title, 
            d.department_name, 
            r.salary, 
            CONCAT(m.first_name, ' ', m.last_name) AS manager_name
        FROM 
            employee e
        LEFT JOIN 
            roles r ON e.role_id = r.id
        LEFT JOIN 
            departments d ON r.department_id = d.id
        LEFT JOIN 
            employee m ON e.manager_id = m.id;
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Add a department
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "name",
            message: "Enter the name of the new department:",
        })
        .then(({ name }) => {
            const query = `INSERT INTO departments (department_name) VALUES ("${name}")`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log(`Added department ${name} to the database!`);
                start();
            });
        });
}

// Add a role
function addRole() {
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const choices = res.map(({ id, department_name }) => ({
            name: department_name,
            value: id,
        }));
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
                    message: "Enter the salary of the new role:",
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "Select the department for the new role:",
                    choices,
                },
            ])
            .then(({ title, salary, department_id }) => {
                const query =
                    "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
                const values = [title, salary, department_id];
                connection.query(query, values, (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Added role ${title} with salary ${salary} to the database!`
                    );
                    start();
                });
            });
    });
}

// Add an employee
function addEmployee() {
    connection.query("SELECT * FROM roles", (error, results) => {
        if (error) throw error;
        const roles = results.map(({ id, title }) => ({
            name: title,
            value: id,
        }));

        connection.query("SELECT * FROM employee", (error, results) => {
            if (error) throw error;
            const employees = results.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id,
            }));

            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "first_name",
                        message: "What is employee's first name:",
                    },
                    {
                        type: "input",
                        name: "last_name",
                        message: "What is employee's last name:",
                    },
                    {
                        type: "list",
                        name: "role_id",
                        message: "What is employee's role:",
                        choices: roles,
                    },
                    {
                        type: "list",
                        name: "manager_id",
                        message: "What is employee's manager:",
                        choices: [
                            { name: "None", value: null },
                            ...employees,
                        ],
                    },
                ])
                .then(({ first_name, last_name, role_id, manager_id }) => {
                    const query = `
                        INSERT INTO 
                            employee (first_name, last_name, role_id, manager_id)
                        VALUES 
                            (?, ?, ?, ?)
                    `;
                    const values = [first_name, last_name, role_id, manager_id];
                    connection.query(query, values, (err, res) => {
                        if (err) throw err;
                        console.log("Employee added successfully");
                        start();
                    });
                });
        });
    });
}

// Add a manager
function addManager() {
    connection.query("SELECT * FROM departments", (err, departments) => {
        if (err) throw err;
        connection.query("SELECT * FROM employee", (err, employees) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "department_id",
                        message: "Select the department:",
                        choices: departments.map(({ id, department_name }) => ({
                            name: department_name,
                            value: id,
                        })),
                    },
                    {
                        type: "list",
                        name: "employee_id",
                        message: "Select the employee to add a manager to:",
                        choices: employees.map(({ id, first_name, last_name }) => ({
                            name: `${first_name} ${last_name}`,
                            value: id,
                        })),
                    },
                    {
                        type: "list",
                        name: "manager_id",
                        message: "Select the employee's manager:",
                        choices: employees.map(({ id, first_name, last_name }) => ({
                            name: `${first_name} ${last_name}`,
                            value: id,
                        })),
                    },
                ])
                .then(({ department_id, employee_id, manager_id }) => {
                    const query = `
                        UPDATE 
                            employee 
                        SET 
                            manager_id = ? 
                        WHERE 
                            id = ? 
                            AND role_id IN (
                                SELECT 
                                    id 
                                FROM 
                                    roles 
                                WHERE 
                                    department_id = ?
                            )
                    `;
                    connection.query(query, [manager_id, employee_id, department_id], (err, res) => {
                        if (err) throw err;
                        console.log(
                            `Added manager successfully`
                        );
                        start();
                    });
                });
        });
    });
}

// Update an employee's role
function updateEmployeeRole() {
    connection.query("SELECT * FROM employee", (err, employees) => {
        if (err) throw err;
        connection.query("SELECT * FROM roles", (err, roles) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee_id",
                        message: "What employee are you update:",
                        choices: employees.map(({ id, first_name, last_name }) => ({
                            name: `${first_name} ${last_name}`,
                            value: id,
                        })),
                    },
                    {
                        type: "list",
                        name: "role_id",
                        message: "What is thier new role:",
                        choices: roles.map(({ id, title }) => ({
                            name: title,
                            value: id,
                        })),
                    },
                ])
                .then(({ employee_id, role_id }) => {
                    const query = "UPDATE employee SET role_id = ? WHERE id = ?";
                    connection.query(query, [role_id, employee_id], (err, res) => {
                        if (err) throw err;
                        console.log(
                            `Updated employee successfully`
                        );
                        start();
                    });
                });
        });
    });
}
function viewEmployeesByManager() {
    const query = `
        SELECT 
            e.id, 
            e.first_name, 
            e.last_name, 
            r.title, 
            d.department_name, 
            CONCAT(m.first_name, ' ', m.last_name) AS manager_name
        FROM 
            employee e
        INNER JOIN 
            roles r ON e.role_id = r.id
        INNER JOIN 
            departments d ON r.department_id = d.id
        LEFT JOIN 
            employee m ON e.manager_id = m.id
        ORDER BY 
            manager_name, 
            e.last_name, 
            e.first_name
    `;

    connection.query(query, (err, res) => {
        if (err) throw err;

        const employeesByManager = res.reduce((acc, cur) => {
            const managerName = cur.manager_name;
            if (acc[managerName]) {
                acc[managerName].push(cur);
            } else {
                acc[managerName] = [cur];
            }
            return acc;
        }, {});

        console.log("Employees by manager:");
        for (const managerName in employeesByManager) {
            console.log(`\n${managerName}:`);
            const employees = employeesByManager[managerName];
            employees.forEach(({ first_name, last_name, title, department_name }) => {
                console.log(
                    `  ${first_name} ${last_name} | ${title} | ${department_name}`
                );
            });
        }
        start();
    });
}

function viewEmployeesByDepartment() {
    const query = `
        SELECT 
            departments.department_name, 
            employee.first_name, 
            employee.last_name 
        FROM 
            employee 
        INNER JOIN 
            roles ON employee.role_id = roles.id 
        INNER JOIN 
            departments ON roles.department_id = departments.id 
        ORDER BY 
            departments.department_name ASC
    `;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("\nEmployees by department:");
        console.table(res);
        start();
    });
}





start();