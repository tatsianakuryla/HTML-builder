const fs = require('fs/promises');
const path = require('path');
const { stdout } = process;

const folderPath = path.join(__dirname, 'secret-folder');

async function displayFilesInfo() {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);

        try {
          const stats = await fs.stat(filePath);

          stdout.write(
            `${path.parse(file.name).name} - ${path
              .extname(file.name)
              .slice(1)} - ${(stats.size / 1024).toFixed(3)}kb \n`,
          );
        } catch (err) {
          console.error(`Error: ${file.name}`, err);
        }
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

displayFilesInfo();
