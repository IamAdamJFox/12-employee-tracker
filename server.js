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