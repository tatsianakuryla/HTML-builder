const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;
const filePath = path.join(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

stdout.write(
  'Hello! I am waiting for your input to add it to a new file or you can enter "exit" to cancel the project \n',
);

stdin.on('data', (data) => {
  const input = data.toString().trim();

  if (input.toLowerCase() === 'exit') {
    stdout.write('The programm was stopped. Good bye!');
    exit();
  }

  writeStream.write(input + '\n', () => {
    stdout.write(
      'You can add a message to the file or enter "exit" to cancel \n',
    );
  });
});

process.on('SIGINT', () => {
  stdout.write('The programm was stopped. Good bye!');
  exit();
});
