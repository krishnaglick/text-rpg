
const inquirer = require('inquirer');
const fs = require('fs');

const ask = require('./ask-question');
const loadClasses = require('./load-classes');

const deleteConfirmation = async ({ name, file }, goBack) => {
  const answer = await ask(`Are you sure you want to remove ${name}? Y/N`);
  if(['Y', 'y', 'yes'].includes(answer)) {
    fs.unlinkSync(file);
    console.log('Deleted');
    goBack();
  }
  else if(['N', 'n', 'no'].includes(answer))
    goBack();
  else
    deleteConfirmation({ name, file }, goBack);
};

module.exports = async (goBack) => {
  const classes = loadClasses(goBack);
  Object.keys(classes).forEach(k => classes[k] = deleteConfirmation({ name: k, file: classes[k]}, goBack));
  classes['Go Back'] = goBack;
  const { choice }  = await inquirer.prompt({
    type: 'list',
    message: 'Pick a class to remove',
    name: 'choice',
    choices: Object.keys(classes)
  });
  await classes[choice](goBack);
};
