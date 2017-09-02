
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const classesPath = path.resolve(__dirname + '/../abilities');
if(!fs.existsSync(classesPath))
  fs.mkdirSync(classesPath);

const { add, edit, remove } = {};

const menuOptions = {
  'Add Class': add,
  'Edit Class': edit,
  'Remove Class': remove
};

exports.action = async (goBack) => {
  menuOptions['Go Back'] = goBack;
  const { choice }  = await inquirer.prompt({
    type: 'list',
    message: 'What would you like to do?',
    name: 'choice',
    choices: Object.keys(menuOptions)
  });

  menuOptions[choice](() => exports.action(goBack));
};

exports.name = 'Manage Abilities';
