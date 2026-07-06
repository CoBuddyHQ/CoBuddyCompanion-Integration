const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});

const targetDirs = ['dashboard', 'requests', 'sessions'];
for (const dir of targetDirs) {
  project.addSourceFilesAtPaths(path.join(__dirname, `../src/screens/${dir}/**/*.tsx`));
}

let modifiedCount = 0;

for (const sourceFile of project.getSourceFiles()) {
  const sourceText = sourceFile.getFullText();
  if (sourceText.includes('i18n.t(')) {
    const newText = sourceText.replace(/i18n\.t\(/g, 't(');
    sourceFile.replaceWithText(newText);
    sourceFile.saveSync();
    modifiedCount++;
    console.log('Replaced in:', path.basename(sourceFile.getFilePath()));
  }
}
console.log(`Replaced in ${modifiedCount} files.`);
