const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});

const targetDirs = ['profile', 'settings', 'availability', 'account', 'reviews'];
for (const dir of targetDirs) {
  project.addSourceFilesAtPaths(path.join(__dirname, `../src/screens/${dir}/**/*.tsx`));
}

let modifiedCount = 0;

for (const sourceFile of project.getSourceFiles()) {
  let modified = false;
  
  // Replace all i18n.t(...) with t(...)
  const sourceText = sourceFile.getFullText();
  if (sourceText.includes('i18n.t(')) {
    const newText = sourceText.replace(/i18n\.t\(/g, 't(');
    sourceFile.replaceWithText(newText);
    modified = true;
  }

  if (modified) {
    const hasImport = sourceFile.getImportDeclaration(dec => dec.getModuleSpecifierValue() === 'react-i18next');
    if (!hasImport) {
      sourceFile.addImportDeclaration({
        namedImports: ['useTranslation'],
        moduleSpecifier: 'react-i18next',
      });
    }

    let injected = false;
    const functionDecs = sourceFile.getFunctions();
    for (const func of functionDecs) {
      if (func.isExported() && func.getName() && func.getName().endsWith('Screen')) {
        const body = func.getBody();
        if (body && body.getKind() === SyntaxKind.Block) {
           const hasT = body.getVariableDeclarations().some(vd => vd.getName() === 't');
           if (!hasT) {
              func.insertStatements(0, 'const { t } = useTranslation();');
           }
           injected = true;
           break;
        }
      }
    }

    if (!injected) {
      const variableDecls = sourceFile.getVariableDeclarations();
      for (const vd of variableDecls) {
        if (vd.getName() && vd.getName().endsWith('Screen')) {
          const init = vd.getInitializerIfKind(SyntaxKind.ArrowFunction);
          if (init) {
            const body = init.getBody();
            if (body && body.getKind() === SyntaxKind.Block) {
              const hasT = body.getVariableDeclarations().some(vd => vd.getName() === 't');
              if (!hasT) {
                init.insertStatements(0, 'const { t } = useTranslation();');
              }
              injected = true;
            }
            break;
          }
        }
      }
    }
    
    sourceFile.saveSync();
    console.log('Migrated i18n.t in:', path.basename(sourceFile.getFilePath()));
    modifiedCount++;
  }
}
console.log('Fixed', modifiedCount, 'files.');
