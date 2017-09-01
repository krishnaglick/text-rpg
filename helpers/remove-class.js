
const inquirer = require('inquirer');
const fs = require('fs');

const ask = require('./ask-question');
const loadClasses = require('./load-classes');

const deleteConfirmation = async ({ name, file }, goBack) => {
  console.log(name, file);
  const answer = await ask(`Are you sure you want to remove ${name}? Y/N`);
  if(['Y', 'y', 'yes'].includes(answer)) {
    fs.unlinkSync(file);
    goBack();
  }
  else if(['N', 'n', 'no'].includes(answer))
    goBack();
  else
    deleteConfirmation({ name, file }, goBack);
};

module.exports = async (goBack) => {
  const classes = loadClasses();
  Object.keys(classes).forEach(k => {
    const name = k;
    const file = classes[k];
    classes[k] = async () => await deleteConfirmation({ name, file }, goBack);
  });
  classes['Go Back'] = goBack;
  const { choice }  = await inquirer.prompt({
    type: 'list',
    message: 'Pick a class to remove',
    name: 'choice',
    choices: Object.keys(classes)
  });
  try {
    await classes[choice](goBack);
  }
  catch(x) {
    console.error(x);
    module.exports(goBack);
  }
};
