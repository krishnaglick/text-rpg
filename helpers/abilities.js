
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const glob = require('glob');

const ask = require('./ask-question');
const abilitiesPath = path.resolve(__dirname + '/../abilities');

class Base {
  constructor(options) {
    this.name = '';
    this.notes = ['']; //offensive, reflectable, ignoreReact, silencable, magical, physical
    this.range = ''; //self, cone, constant, weapon, line, doubleLine, global

    this.scalesWith = ['']; // physicalAtk, spellAtk, weapon

    this.element = ''; //none, fire, ice, lightning, water, earth, wind, holy, dark

    this.targets = []; //ko, self, ally, enemy

    this.targetIncludes = [];
    this.targetExcludes = [];
    //undead, animal, dragon, [more based on races]

    Object.keys(options).forEach(key => typeof this[key] !== undefined && (this[key] = options[key]));
  }
}
exports.base = Base;

const noteTypes = {
  'Offensive': 'offensive',
  'Reflectable': 'reflectable',
  'Ignore React': 'ignoreReact',
  'Silencable': 'silencable',
  'Magical': 'magical',
  'Physical': 'physical'
};
const rangeTypes = {
  'Self': 'self',
  'Cone': 'cone',
  'Constant': 'constant',
  'Weapon': 'weapon',
  'Line': 'line',
  'Line in Front and Behind': 'doubleLine',
  'Lines in the shape of a +': 'cross',
  'Global': 'global'
};
const scalingTypes = {
  'Physical Attack': 'physicalAtk',
  'Spell Attack': 'spellAtk',
  'Weapon': 'weapon'
};
const elements = [
  'None',
  'Fire',
  'Ice',
  'Lightning',
  'Water',
  'Earth',
  'Wind',
  'Holy',
  'Dark'
];
const targetTypes = {
  Dead: 'ko',
  Self: 'self',
  Allies: 'ally',
  Enemies: 'enemy'
};
const targetFilters = {
  'Undead': 'undead',
  'Animal': 'animal',
  'Dragon': 'dragon'
};

exports.add = async (goBack) => {
  const { base } = exports;

  const abilityOptions = {
    name: await ask('What is the ability name?')
  };
  const { choice: abilityElement }  = await inquirer.prompt({
    type: 'list',
    message: 'What element is this ability?',
    name: 'choice',
    choices: elements
  });
  abilityOptions.element = abilityElement.toLowerCase();

  const { choice: abilityNotes } = await inquirer.prompt({
    type: 'checkbox',
    message: 'Choose ability options',
    name: 'choice',
    choices: Object.keys(noteTypes)
  });
  abilityOptions.notes = abilityNotes.map(c => noteTypes[c]);

  const { choice: abilityRanges } = await inquirer.prompt({
    type: 'checkbox',
    message: 'Choose ability options',
    name: 'choice',
    choices: Object.keys(rangeTypes)
  });
  abilityOptions.range = abilityRanges.map(c => rangeTypes[c]);

  const { choice: abilityScaling } = await inquirer.prompt({
    type: 'checkbox',
    message: 'Choose ability options',
    name: 'choice',
    choices: Object.keys(scalingTypes)
  });
  abilityOptions.scalesWith = abilityScaling.map(c => scalingTypes[c]);

  const { choice: abilityTargets } = await inquirer.prompt({
    type: 'checkbox',
    message: 'Choose ability options',
    name: 'choice',
    choices: Object.keys(targetTypes)
  });
  abilityOptions.targets = abilityTargets.map(c => targetTypes[c]);

  const { choice: abilityTargetIncludes } = await inquirer.prompt({
    type: 'checkbox',
    message: 'Does this ability hit ONLY any of the following?',
    name: 'choice',
    choices: Object.keys(targetFilters)
  });
  abilityOptions.targetIncludes = abilityTargetIncludes.map(c => targetFilters[c]);

  const { choice: abilityTargetExcludes } = await inquirer.prompt({
    type: 'checkbox',
    message: 'Does this ability never affect any of the following?',
    name: 'choice',
    choices: Object.keys(targetFilters)
  });
  abilityOptions.targetExcludes = abilityTargetExcludes.map(c => targetFilters[c]);

  const newAbility = new base(abilityOptions);

  fs.writeFileSync(path.resolve(`${abilitiesPath}/${newAbility.name.toLowerCase()}.json`), JSON.stringify(newAbility, null, 2));
  goBack();
};

exports.load = () => {
  const classes = {};
  glob.sync(abilitiesPath + '/**/*.json').forEach((file) => {
    file = path.resolve(file);
    const name = file.split(path.sep).slice(-1)[0].split('.')[0];
    classes[name] = file;
  });
  return classes;
};
