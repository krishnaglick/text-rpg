
const readline = require('readline');

module.exports = (question) => {
  const interact = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((res) => {
    interact.question(`${question}\n`, (answer) => {
      res(answer);
      interact.close();
    });
  });
};
