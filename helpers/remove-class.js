
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');

const ask = require('./ask-question');
const classesPath = path.resolve(__dirname + '/../classes');

const classes = {};
glob.sync(classesPath + '/**/*.json').forEach((file) => {
  file = path.resolve(file);
  const name = file.split(path.sep).slice(-1)[0].split('.')[0];

  const confirmation = async (goBack) => {
    const answer = await ask(`Are you sure you want to remove ${name}? Y/N`);
    if(['Y', 'y', 'yes'].includes(answer)) {
      fs.unlinkSync(file);
      console.log('Deleted');
      goBack();
    }
    else if(['N', 'n', 'no'].includes(answer))
      goBack();
    else
      confirmation();
  };

  classes[name] = confirmation;
});

module.exports = async (goBack) => {
  classes['Go Back'] = goBack;
  const { choice }  = await inquirer.prompt({
    type: 'list',
    message: 'Pick a class to remove?',
    name: 'choice',
    choices: Object.keys(classes)
  });
  await classes[choice]();
};
