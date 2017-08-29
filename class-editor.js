
const fs = require('fs');
const glob = require('glob');
const path = require('path');

class ClassEditor {

  classes: {}

  constructor() {
    this.init();
  }

  async init() {
    if(!fs.existsSync('./classes'))
      fs.mkdirSync('./classes');
    (await glob('./classes/**/*.json')).forEach((file) => {
      const name = file.split(path.sep).slice(-1)[0].split('.')[0];
      this.classes[name] = require(file);
    });
  }

  async addClass(ask) {
    const className = await ask('What is the class name?');
    fs.writeFileSync(path.resolve(`./classes/${className}.json`), JSON.stringify({ name: className }));
  }
}

module.exports = ClassEditor;
