const fs = require('fs/promises');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const outputFolder = path.join(__dirname, 'project-dist');
const bundleFile = path.join(outputFolder, 'bundle.css');

async function mergeStyles() {
  try {
    await fs.mkdir(outputFolder, { recursive: true });

    const items = await fs.readdir(stylesFolder, { withFileTypes: true });

    const cssFiles = items.filter(
      (item) => item.isFile() && path.extname(item.name) === '.css',
    );

    const stylesContent = [];

    for (const file of cssFiles) {
      const filePath = path.join(stylesFolder, file.name);

      const content = await fs.readFile(filePath, 'utf8');

      stylesContent.push(content);
    }

    await fs.writeFile(bundleFile, stylesContent.join('\n'), 'utf8');

    console.log('Styles have been merged into the new file bundle.css');
  } catch (error) {
    console.error('Error:', error);
  }
}

mergeStyles();
