
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const loadClasses = require('./load-classes');
const ask = require('./ask-question');

const classesPath = path.resolve(__dirname + '/../classes');

module.exports = async (goBack) => {
  const classes = loadClasses();
  const menuOptions = [
    ...Object.keys(classes),
    'Cancel'
  ];
  const { choice }  = await inquirer.prompt({
    type: 'list',
    message: 'Pick a class to edit',
    name: 'choice',
    choices: menuOptions
  });

  if(classes[choice]) {
    const editableClass = require(classes[choice]);

    let editingField = '';
    do {
      const { choice }  = await inquirer.prompt({
        type: 'list',
        message: 'Pick a field to edit',
        name: 'choice',
        choices: [ ...Object.keys(editableClass), 'Done' ]
      });
      editingField = choice;
      if(editableClass[editingField]) {
        editableClass[editingField] = await ask(`Please enter a new value for ${editingField}`);
      }
    }
    while(editingField !== 'Done');
    fs.writeFileSync(path.resolve(`${classesPath}/${editableClass.name.toLowerCase()}.json`), JSON.stringify(editableClass, null, 2));
    goBack();
  }
  else
    goBack();
};
