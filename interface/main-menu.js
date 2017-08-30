
const inquirer = require('inquirer');
const glob = require('globby');
const path = require('path');

const menuOptions = {
  'Exit': () => process.exit()
};
glob.sync(__dirname + path.sep + '*.js')
  .filter(fp => !fp.includes('main-menu'))
  .forEach(fp => {
    const { action, name } = require(fp);
    menuOptions[name] = action;
  });

exports.action = async () => {
  const { choice }  = await inquirer.prompt({
    type: 'list',
    message: 'What would you like to do?',
    name: 'choice',
    choices: Object.keys(menuOptions).sort((a,b) => a < b)
  });

  menuOptions[choice](exports.action);
};

exports.name = 'Main Menu';
