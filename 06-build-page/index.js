const fs = require('fs/promises');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');
const distAssetsFolder = path.join(projectDist, 'assets');

async function createProjectDist() {
  await fs.mkdir(projectDist, { recursive: true });
}

async function generateHTML() {
  const template = await fs.readFile(templatePath, 'utf-8');
  const componentFiles = await fs.readdir(componentsFolder, {
    withFileTypes: true,
  });

  let modifiedTemplate = template;
  for (const file of componentFiles) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      const tagName = `{{${path.parse(file.name).name}}}`;
      const componentContent = await fs.readFile(
        path.join(componentsFolder, file.name),
        'utf-8',
      );
      modifiedTemplate = modifiedTemplate.split(tagName).join(componentContent);
    }
  }

  await fs.writeFile(
    path.join(projectDist, 'index.html'),
    modifiedTemplate,
    'utf-8',
  );
}

async function mergeStyles() {
  const styleFiles = await fs.readdir(stylesFolder, { withFileTypes: true });
  const bundlePath = path.join(projectDist, 'style.css');

  const styles = [];
  for (const file of styleFiles) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const styleContent = await fs.readFile(
        path.join(stylesFolder, file.name),
        'utf-8',
      );
      styles.push(styleContent);
    }
  }

  await fs.writeFile(bundlePath, styles.join('\n'), 'utf-8');
}

async function copyAssets(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const items = await fs.readdir(src, { withFileTypes: true });

  for (const item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      await copyAssets(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function buildPage() {
  try {
    await createProjectDist();

    await generateHTML();

    await mergeStyles();

    await copyAssets(assetsFolder, distAssetsFolder);

    console.log('The page has been built');
  } catch (error) {
    console.error('Error:', error);
  }
}

buildPage();
