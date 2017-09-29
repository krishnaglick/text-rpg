
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const classesPath = path.resolve(__dirname + '/../abilities');
if(!fs.existsSync(classesPath))
  fs.mkdirSync(classesPath);

const { add, edit, remove } = require('../helpers/abilities');

const menuOptions = {
  'Add Ability': add,
  'Edit Ability': edit,
  'Remove Ability': remove
};

exports.action = async (goBack) => {
  menuOptions['Go Back'] = goBack;
  const { choice }  = await inquirer.prompt({
    type: 'list',
    message: 'What would you like to do?',
    name: 'choice',
    choices: Object.keys(menuOptions)
  });

  try {
    await menuOptions[choice](() => exports.action(goBack));
  }
  catch(x) {
    console.error(x);
    exports.action(goBack);
  }
};

exports.name = 'Manage Abilities';
