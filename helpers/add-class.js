
const fs = require('fs');
const path = require('path');
const classBase = require('./class-base');

const classMap = [
  { question: 'What would you like to name the class?', map: 'name' },
  ...Object.keys(new classBase()).filter(k => k !== 'name').map(k => ({ question: `How much ${k} does it get per level?`, map: k }))
];

const ask = require('./ask-question');
const classesPath = path.resolve(__dirname + '/../classes');

module.exports = async (goBack) => {
  const newClass = new classBase();
  for(let i = 0; i < classMap.length; i++) {
    const { question, map } = classMap[i];
    newClass[map] = await ask(question);
  }

  fs.writeFileSync(path.resolve(`${classesPath}/${newClass.name.toLowerCase()}.json`), JSON.stringify(newClass, null, 2));
  goBack();
};
