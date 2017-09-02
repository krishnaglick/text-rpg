
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const glob = require('glob');

const ask = require('./ask-question');
const classesPath = path.resolve(__dirname + '/../classes');

exports.base = class {
  constructor() {
    this.name = '';
    this.strength = 8;
    this.agility = 8;
    this.intelligence = 8;
    this.stamina = 10;
    this.wisdom = 10;
  }
};

exports.add = async (goBack) => {
  const { base } = exports;
  const classMap = [
    { question: 'What would you like to name the class?', map: 'name' },
    ...Object.keys(new base()).filter(k => k !== 'name').map(k => ({ question: `How much ${k} does it get per level?`, map: k }))
  ];

  const newClass = new base();
  for(let i = 0; i < classMap.length; i++) {
    const { question, map } = classMap[i];
    newClass[map] = await ask(question);
  }

  fs.writeFileSync(path.resolve(`${classesPath}/${newClass.name.toLowerCase()}.json`), JSON.stringify(newClass, null, 2));
  goBack();
};

const deleteConfirmation = async ({ name, file }, askQuestion, goBack) => {
  const answer = await askQuestion(`Are you sure you want to remove ${name}? Y/N`);
  if(['Y', 'y', 'yes'].includes(answer)) {
    fs.unlinkSync(file);
    goBack();
  }
  else if(['N', 'n', 'no'].includes(answer))
    goBack();
  else
    deleteConfirmation({ name, file }, goBack);
};

exports.remove = async (goBack) => {
  const { load } = exports;
  const classes = load();
  Object.keys(classes).forEach(k => {
    const name = k;
    const file = classes[k];
    classes[k] = async () => await deleteConfirmation({ name, file }, ask, goBack);
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

exports.edit = async (goBack) => {
  const { load } = exports;
  const classes = load();
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
      if(editableClass[editingField] !== undefined) {
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

exports.load = () => {
  const classes = {};
  glob.sync(classesPath + '/**/*.json').forEach((file) => {
    file = path.resolve(file);
    const name = file.split(path.sep).slice(-1)[0].split('.')[0];
    classes[name] = file;
  });
  return classes;
};
