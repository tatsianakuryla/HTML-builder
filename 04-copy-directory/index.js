const fs = require('fs/promises');
const path = require('path');

async function copyDirectoryHelper(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });

    const items = await fs.readdir(src, { withFileTypes: true });

    for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isDirectory()) {
        await copyDirectoryHelper(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error(`Error while copying from ${src} to ${dest}:`, err);
    throw err;
  }
}

async function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  try {
    await fs.rm(destDir, { recursive: true, force: true });

    await copyDirectoryHelper(sourceDir, destDir);

    console.log('The directory has been coppied');
  } catch (error) {
    console.error('Error:', error);
  }
}

copyDir();
