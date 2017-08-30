
const fs = require('fs');
const path = require('path');

const classBase = {};

const ask = require('./ask-question');
module.exports = async (goBack) => {
  const className = await ask('What would you like to name the class?');
  const classesPath = path.resolve(__dirname + '/../classes');
  fs.writeFileSync(path.resolve(`${classesPath}/${className}.json`), JSON.stringify({ name: className }, null, 2));
  goBack();
};
