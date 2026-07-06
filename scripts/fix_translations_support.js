const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});

project.addSourceFilesAtPaths(__dirname.replace(/\\/g, '/') + '/../src/screens/support/*.tsx');

let modifiedFiles = 0;

for (const sourceFile of project.getSourceFiles()) {
  let modified = false;

  // 1. Replace i18n.t( with t( everywhere in the file text
  // Ts-morph doesn't have a simple "replace all text" that keeps AST perfectly synced without re-parsing,
  // but we can just manipulate the source file text and re-parse it.
  let text = sourceFile.getFullText();
  if (text.includes('i18n.t(')) {
    text = text.replace(/i18n\.t\(/g, 't(');
    sourceFile.replaceWithText(text);
    modified = true;
  }

  // 2. Add import for useTranslation if missing
  if (modified || text.includes('t(')) {
    const hasImport = sourceFile.getImportDeclaration(dec => dec.getModuleSpecifierValue() === 'react-i18next');
    if (!hasImport) {
      sourceFile.addImportDeclaration({
        namedImports: ['useTranslation'],
        moduleSpecifier: 'react-i18next',
      });
      modified = true;
    }
  }

  // 3. Inject `const { t } = useTranslation();` into any function that uses `t(`
  const functions = [
    ...sourceFile.getDescendantsOfKind(SyntaxKind.FunctionDeclaration),
    ...sourceFile.getDescendantsOfKind(SyntaxKind.ArrowFunction)
  ];

  for (const func of functions) {
    const body = func.getBody();
    if (body && body.getKind() === SyntaxKind.Block) {
      const blockText = body.getText();
      // Only inject if the block contains `t(` but doesn't already declare `useTranslation`
      if (blockText.includes('t(') && !blockText.includes('useTranslation()')) {
        func.insertStatements(0, 'const { t } = useTranslation();');
        modified = true;
      }
    } else if (body && body.getKind() !== SyntaxKind.Block) {
      // If it's an arrow function returning JSX directly e.g. () => (<View>...</View>)
      const bodyText = body.getText();
      if (bodyText.includes('t(')) {
         // Convert to block body
         const newBody = `{ const { t } = useTranslation(); return ${bodyText}; }`;
         func.setBodyText(writer => {
            writer.write(newBody);
         });
         modified = true;
      }
    }
  }

  if (modified) {
    sourceFile.saveSync();
    console.log(`Fixed translations in ${path.basename(sourceFile.getFilePath())}`);
    modifiedFiles++;
  }
}

console.log(`Successfully fixed translations in ${modifiedFiles} screens.`);
