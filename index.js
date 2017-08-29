
const { ask, end } = require('./ask.js');
console.log('Hello, welcome to the world of Firenz.');
const inquirer = require('inquirer');

const menuOptions = [
  'Add/Edit Class',
  'Add/Edit Ability',
  'Exit'
];

const main = async () => {
  //const choice = await ask(`What would you like to do?\n${menuOptions.map((opt, i) => `${i}: ${opt}`).join('\n')}`);
  const { choice }  = await inquirer.prompt({
    type: 'list',
    message: 'What would you like to do?',
    name: 'choice',
    choices: menuOptions
  });
  console.log(choice);
  if(choice === 'Exit')
    return end();
  main();
};

main();
