
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const classesPath = path.resolve(__dirname + '/../classes');
if(!fs.existsSync(classesPath))
  fs.mkdirSync(classesPath);

const menuOptions = {
  'Add Class': require('../helpers/add-class'),
  'Remove Class': require('../helpers/remove-class')
};

exports.action = async (goBack) => {
  menuOptions['Go Back'] = goBack;
  const { choice }  = await inquirer.prompt({
    type: 'list',
    message: 'What would you like to do?',
    name: 'choice',
    choices: Object.keys(menuOptions)
  });

  menuOptions[choice](exports.action);
};

exports.name = 'Manage Classes';
