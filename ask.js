
const readline = require('readline');
const interact = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

exports.ask = (question) => {
  return new Promise((res) => {
    interact.question(`${question}\n`, res);
  });
};

exports.end = () => interact.close();
