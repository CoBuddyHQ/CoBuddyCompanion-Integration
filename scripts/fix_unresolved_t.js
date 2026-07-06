const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});

project.addSourceFilesAtPaths(path.join(__dirname, '../src/screens/**/*.tsx'));

let modifiedCount = 0;

for (const sourceFile of project.getSourceFiles()) {
  let modified = false;

  const identifiers = sourceFile.getDescendantsOfKind(SyntaxKind.Identifier);
  for (const id of identifiers) {
    if (id.getText() === 't') {
      const callExpr = id.getParentIfKind(SyntaxKind.CallExpression);
      if (callExpr && callExpr.getExpression() === id) {
        
        // Find if 't' is defined in scope
        let tInScope = false;
        let current = id;
        while (current) {
          const parent = current.getParent();
          if (!parent) break;
          
          if (parent.getKind() === SyntaxKind.Block) {
             const hasT = parent.getVariableDeclarations().some(vd => vd.getName() === 't');
             if (hasT) {
               tInScope = true;
               break;
             }
          }
          current = parent;
        }

        if (!tInScope) {
          id.replaceWithText('i18n.t');
          modified = true;
          
          const hasI18nImport = sourceFile.getImportDeclaration(dec => {
             const mod = dec.getModuleSpecifierValue();
             return mod.endsWith('i18n') && (mod.includes('../../') || mod.includes('../../../'));
          });
          
          if (!hasI18nImport) {
             const dir = path.dirname(sourceFile.getFilePath());
             const depth = dir.split('src/screens/')[1].split('/').length;
             const relPath = depth === 1 ? '../../i18n' : depth === 2 ? '../../../i18n' : '../../../../i18n';
             sourceFile.addImportDeclaration({
               defaultImport: 'i18n',
               moduleSpecifier: relPath,
             });
          }
        }
      }
    }
  }

  if (modified) {
    sourceFile.saveSync();
    console.log('Replaced unresolved t() in:', path.basename(sourceFile.getFilePath()));
    modifiedCount++;
  }
}
console.log('Fixed', modifiedCount, 'files.');
