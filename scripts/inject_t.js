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
        // It's a call to t()
        const scopeFunc = id.getFirstAncestorByKind(SyntaxKind.ArrowFunction) || id.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration);
        
        if (scopeFunc) {
          const body = scopeFunc.getBody();
          if (body && body.getKind() === SyntaxKind.Block) {
            const hasT = body.getVariableDeclarations().some(vd => vd.getName() === 't');
            if (!hasT) {
              const returnsJsx = scopeFunc.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0 || scopeFunc.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0;
              
              if (returnsJsx) {
                body.insertStatements(0, 'const { t } = useTranslation();');
                modified = true;
                
                const hasImport = sourceFile.getImportDeclaration(dec => dec.getModuleSpecifierValue() === 'react-i18next');
                if (!hasImport) {
                  sourceFile.addImportDeclaration({
                    namedImports: ['useTranslation'],
                    moduleSpecifier: 'react-i18next',
                  });
                }
              } else {
                id.replaceWithText('i18n.t');
                modified = true;
                
                const hasI18nImport = sourceFile.getImportDeclaration(dec => dec.getModuleSpecifierValue() === '../../i18n' || dec.getModuleSpecifierValue() === '../../../i18n' || dec.getModuleSpecifierValue() === '../../../../i18n');
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
      }
    }
  }

  if (modified) {
    sourceFile.saveSync();
    console.log('Injected missing t in:', path.basename(sourceFile.getFilePath()));
    modifiedCount++;
  }
}
console.log('Fixed', modifiedCount, 'files.');
