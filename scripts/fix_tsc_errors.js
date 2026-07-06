const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});

project.addSourceFilesAtPaths(path.join(__dirname, '../src/screens/**/*.tsx'));

for (const sourceFile of project.getSourceFiles()) {
  let modified = false;

  // 1. Fix "Cannot redeclare block-scoped variable 't'"
  const blocks = sourceFile.getDescendantsOfKind(SyntaxKind.Block);
  for (const block of blocks) {
    const varDecls = block.getVariableDeclarations().filter(vd => vd.getName() === 't');
    if (varDecls.length > 1) {
      // Keep the first one, remove the rest
      for (let i = 1; i < varDecls.length; i++) {
        const stmt = varDecls[i].getFirstAncestorByKind(SyntaxKind.VariableStatement);
        if (stmt) {
          stmt.remove();
          modified = true;
        }
      }
    }
  }

  // 2. Fix "Cannot find name 't'"
  const identifiers = sourceFile.getDescendantsOfKind(SyntaxKind.Identifier);
  for (const id of identifiers) {
    if (id.getText() === 't') {
      const callExpr = id.getParentIfKind(SyntaxKind.CallExpression);
      if (callExpr && callExpr.getExpression() === id) {
        // It's a call to t()
        // Check if t is in scope
        const scopeFunc = id.getFirstAncestorByKind(SyntaxKind.ArrowFunction) || id.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration);
        
        if (scopeFunc) {
          const body = scopeFunc.getBody();
          if (body && body.getKind() === SyntaxKind.Block) {
            // Check if it already has 't' declared
            const hasT = body.getVariableDeclarations().some(vd => vd.getName() === 't');
            if (!hasT) {
              // Inject it
              // But only if this is a React component (starts with capital letter or is in a file where we can)
              // Actually, if it returns JSX, it's a component.
              const returnsJsx = scopeFunc.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0 || scopeFunc.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0;
              
              if (returnsJsx) {
                body.insertStatements(0, 'const { t } = useTranslation();');
                modified = true;
                
                // Ensure import
                const hasImport = sourceFile.getImportDeclaration(dec => dec.getModuleSpecifierValue() === 'react-i18next');
                if (!hasImport) {
                  sourceFile.addImportDeclaration({
                    namedImports: ['useTranslation'],
                    moduleSpecifier: 'react-i18next',
                  });
                }
              } else {
                // If not a component, replace `t(` with `i18n.t(`
                id.replaceWithText('i18n.t');
                modified = true;
                
                // Add i18n import
                const hasI18nImport = sourceFile.getImportDeclaration(dec => dec.getModuleSpecifierValue() === '../../i18n' || dec.getModuleSpecifierValue() === '../../../i18n');
                if (!hasI18nImport) {
                   // Calculate relative path
                   const dir = path.dirname(sourceFile.getFilePath());
                   const depth = dir.split('src/screens/')[1].split('/').length;
                   const relPath = depth === 1 ? '../../i18n' : '../../../i18n';
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
    console.log('Fixed', path.basename(sourceFile.getFilePath()));
  }
}
