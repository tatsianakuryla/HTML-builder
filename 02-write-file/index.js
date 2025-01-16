const fs = require('fs');
const path = require('path');
const { stdin } = process;
const filePath = path.join(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log(
  'Hello! I am waiting for your input to add it to a new file or you can enter "exit" to cancel the project',
);

stdin.on('data', (data) => {
  const input = data.toString().trim();

  if (input.toLowerCase() === 'exit') {
    console.log('Good bye!');
    process.exit();
  }

  writeStream.write(input + '\n', () => {
    console.log('You can add a message to the file or enter "exit" to cancel');
  });
});

process.on('SIGINT', () => {
  console.log('Good bye!');
  process.exit();
});
