// Imports
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Creates mysql connection
const server = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Iamthebest1993',
  database: 'companyData_db',
});

// Connects to the database
server.connect((err) => {
  if (err) throw err;
  console.log('Welcome to the company database!');

  start();
})

// Initialize the application as well as sets the choices to interact with data
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
                    server.end();
                    console.log("Goodbye!");
                    break;
            }
        });
}

// View all departments
function viewAllDepartments() {
    console.log("inside viewALLDepartments")

    const query = "SELECT * FROM department";
    server.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// View all roles
function viewAllRoles() {
    const query = `
        SELECT 
            role.title, 
            role.id, 
            department.department_name, 
            role.salary 
        FROM 
            role 
        JOIN 
            department
        ON 
            role.department_id = department.id
    `;
    server.query(query, (err, res) => {
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
            role r ON e.role_id = r.id
        LEFT JOIN 
            department d ON r.department_id = d.id
        LEFT JOIN 
            employee m ON e.manager_id = m.id;
    `;
    server.query(query, (err, res) => {
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
            const query = `INSERT INTO department (department_name) VALUES ("${name}")`;
            server.query(query, (err, res) => {
                if (err) throw err;
                console.log(`Added department ${name}`);
                start();
            });
        });
}

// Add a role
function addRole() {
    const query = "SELECT * FROM department";
    server.query(query, (err, res) => {
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
                    "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
                const values = [title, salary, department_id];
                server.query(query, values, (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Added role ${title} with salary ${salary}`
                    );
                    start();
                });
            });
    });
}

// Add an employee
function addEmployee() {
    server.query("SELECT * FROM role", (error, results) => {
        if (error) throw error;
        const role = results.map(({ id, title }) => ({
            name: title,
            value: id,
        }));

        server.query("SELECT * FROM employee", (error, results) => {
            if (error) throw error;
            const employee = results.map(({ id, first_name, last_name }) => ({
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
                        choices: role,
                    },
                    {
                        type: "list",
                        name: "manager_id",
                        message: "What is employee's manager:",
                        choices: [
                            { name: "None", value: null },
                            ...employee,
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
                    server.query(query, values, (err, res) => {
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
    server.query("SELECT * FROM department", (err, department) => {
        if (err) throw err;
        server.query("SELECT * FROM employee", (err, employee) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "department_id",
                        message: "Select the department:",
                        choices: department.map(({ id, department_name }) => ({
                            name: department_name,
                            value: id,
                        })),
                    },
                    {
                        type: "list",
                        name: "employee_id",
                        message: "Select the employee to add a manager to:",
                        choices: employee.map(({ id, first_name, last_name }) => ({
                            name: `${first_name} ${last_name}`,
                            value: id,
                        })),
                    },
                    {
                        type: "list",
                        name: "manager_id",
                        message: "Select the employee's manager:",
                        choices: employee.map(({ id, first_name, last_name }) => ({
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
                                    role 
                                WHERE 
                                    department_id = ?
                            )
                    `;
                    server.query(query, [manager_id, employee_id, department_id], (err, res) => {
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
    server.query("SELECT * FROM employee", (err, employee) => {
        if (err) throw err;
        server.query("SELECT * FROM role", (err, role) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee_id",
                        message: "What employee are you update:",
                        choices: employee.map(({ id, first_name, last_name }) => ({
                            name: `${first_name} ${last_name}`,
                            value: id,
                        })),
                    },
                    {
                        type: "list",
                        name: "role_id",
                        message: "What is thier new role:",
                        choices: role.map(({ id, title }) => ({
                            name: title,
                            value: id,
                        })),
                    },
                ])
                .then(({ employee_id, role_id }) => {
                    const query = "UPDATE employee SET role_id = ? WHERE id = ?";
                    server.query(query, [role_id, employee_id], (err, res) => {
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
//Views employees by manager
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
            role r ON e.role_id = r.id
        INNER JOIN 
            department d ON r.department_id = d.id
        LEFT JOIN 
            employee m ON e.manager_id = m.id
        ORDER BY 
            manager_name, 
            e.last_name, 
            e.first_name
    `;

    server.query(query, (err, res) => {
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
            const employee = employeesByManager[managerName];
            employee.forEach(({ first_name, last_name, title, department_name }) => {
                console.log(
                    `  ${first_name} ${last_name} | ${title} | ${department_name}`
                );
            });
        }
        start();
    });
}
//View Employees by department
function viewEmployeesByDepartment() {
    const query = `
        SELECT 
            department.department_name, 
            employee.first_name, 
            employee.last_name 
        FROM 
            employee 
        INNER JOIN 
            role ON employee.role_id = role.id 
        INNER JOIN 
            department ON role.department_id = department.id 
        ORDER BY 
            department.department_name ASC
    `;

    server.query(query, (err, res) => {
        if (err) throw err;
        console.log("\nEmployees by department:");
        console.table(res);
        start();
    });
}





