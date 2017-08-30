
const glob = require('glob');
const path = require('path');

const classesPath = path.resolve(__dirname + '/../classes');

module.exports = () => {
  const classes = {};
  glob.sync(classesPath + '/**/*.json').forEach((file) => {
    file = path.resolve(file);
    const name = file.split(path.sep).slice(-1)[0].split('.')[0];
    classes[name] = file;
  });
  return classes;
};
