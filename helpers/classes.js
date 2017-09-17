
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const glob = require('glob');

const ask = require('./ask-question');
const classesPath = path.resolve(__dirname + '/../classes');

class Base {
  constructor(stats) {
    this.name = '';
    this.lvl = 1;

    this.strength = 10;
    this.stamina = 10;
    this.agility = 10;
    this.intelligence = 10;
    this.wisdom = 10;

    this.strengthGrowth = 1;
    this.staminaGrowth = 1;
    this.agilityGrowth = 1;
    this.intelligenceGrowth = 1;
    this.wisdomGrowth = 1;

    Object.keys(stats).forEach(key => this[key] && (this[key] = stats[key]));
  }

  get currentHp() {
    return this.maxHp - this.damage;
  }

  get maxHp() {
    return (this.stamina * 10) + (0.1 * this.strength);
  }

  get currentMp() {
    return this.maxMp - this.manaUsed;
  }

  get maxMp() {
    return (this.wisdom * 6) + (this.intelligence * 4);
  }

  get physicalAtk() {
    return this.strength + (this.stamina * 0.1) + (this.agility * 0.2);
  }

  get physicalDef() {
    return (this.stamina * 0.5) + (this.strength * 0.3);
  }

  get spellAtk() {
    return this.intelligence + (this.wisdom * 0.1) + (this.agility * 0.2);
  }

  get spellDef() {
    return (this.wisdom * 0.5) + (this.intelligence * 0.3);
  }

  get speed() {
    return 1 + (this.agility * 2);
  }

  get moveRange() {
    return 3;
  }

  get jumpHeight() {
    return 2;
  }

  get evasion() {
    return (this.agility * 0.2) + (this.wisdom * 0.15);
  }

  get crit() {
    return (this.strength * 0.05) + (this.intelligence * 0.05);
  }

  get debuffResistance() {
    return (this.stamina * 0.05) + (this.wisdom * 0.05);
  }
}
exports.base = Base;

const statCategories = [ 'strength', 'stamina', 'agility', 'intelligence', 'wisdom' ];

exports.add = async (goBack) => {
  const { base } = exports;
  const newClass = new base();
  const classMap = [
    { question: 'What would you like to name the class?', map: 'name' },
    ...statCategories.map(category => ({ question: `How much ${category} does it start with? Base: ${newClass[category]}`, map: category })),
    ...statCategories.map(c => c + 'Growth').map(category => ({ question: `How much ${category} does it get per level? Base: ${newClass[category]}`, map: category }))
  ];

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

    const choices = [
      ...statCategories,
      ...statCategories.map(c => c + 'Growth'),
      'Done'
    ];

    let editingField = '';
    do {
      const { choice }  = await inquirer.prompt({
        type: 'list',
        message: 'Pick a field to edit',
        name: 'choice',
        choices
      });

      editingField = choice;
      if(editingField === 'Done')
        break;

      editableClass[editingField] = await ask(`Please enter a new value for ${editingField}, currently: ${editableClass[editingField] || ''}`);
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
