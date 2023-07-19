// Imports
const mysql = require('mysql2');
const inquirer = require('inquirer');


const server = mysql.createConnection({
  host: 'localhost',
  port: 3001,
  user: 'root',
  password: 'Connect',
  database: 'company_db',
});

// Initialize the server
server.connect((err) => {
  if (err) throw err;
  console.log('database!');
  init();
});


async function init() {
  try {
    const { choice } = await inquirer.prompt({
      name: 'choice',
      type: 'list',
      message: 'Select an option:',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add A Department',
        'Add A Role',
        'Add An Employee',
        'Update An Employee',
      ],
    });

    
    switch (choice) {
      case 'View All Departments':
        viewDepartments();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'View All Employees':
        viewEmployees();
        break;
      case 'Add A Department':
        addDepartment();
        break;
      case 'Add A Role':
        addRole();
        break;
      case 'Add An Employee':
        addEmployee();
        break;
      case 'Update An Employee':
        updateEmployee();
        break;
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

function viewDepartments() {
    const query = 'SELECT * FROM department';
    server.query(query, (err, results) => {
      if (err) {
        console.error('An error occurred:', err);
      } else {
        console.table(results);
      }
      init();
    });
  }

  function viewRoles() {
    const query = 'SELECT roles.title, roles.department_id, roles.salary, departments.department_name FROM roles JOIN departments ON roles.department_id = departments.id';
    server.query(query, (err, results) => {
      if (err) {
        console.error('An error occurred:', err);
      } else {
        console.table(results);
      }
      init();
    });
  }

  function viewEmployees() {
    const query = 'SELECT employees.first_name, employees.last_name, roles.title FROM employees JOIN roles ON employees.role_id = roles.id';
    server.query(query, (err, results) => {
      if (err) {
        console.error('An error occurred:', err);
      } else {
        console.table(results);
      }
      init();
    });
  }

  function addDepartment() {
    inquirer
      .prompt({
        name: 'newDept',
        type: 'input',
        message: 'What is the name of the new department:',
      })
      .then((userResponse) => {
        const query = `INSERT INTO departments (department_name) VALUES (?)`;
        server.query(query, [userResponse.newDept], (err) => {
          if (err) throw err;
          console.log(`Department "${userResponse.newDept}" has been added.`);
          init();
        });
      });
  }