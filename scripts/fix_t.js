const { Project, SyntaxKind } = require('ts-morph');
const path = require('path');

const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});

const targetDirs = ['profile', 'settings', 'availability', 'account', 'reviews'];
for (const dir of targetDirs) {
  project.addSourceFilesAtPaths(path.join(__dirname, `../src/screens/${dir}/**/*.tsx`));
}

let fixed = 0;

for (const sourceFile of project.getSourceFiles()) {
  let modified = false;

  // Find all variable declarations named 't'
  const allTVars = sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration)
    .filter(vd => vd.getName() === 't');
  
  // If there are multiple 't' declarations in the same block, remove duplicates
  const blocks = new Map();
  for (const tVar of allTVars) {
    const parentBlock = tVar.getFirstAncestorByKind(SyntaxKind.Block);
    if (parentBlock) {
       const blockId = parentBlock.getPos();
       if (!blocks.has(blockId)) {
         blocks.set(blockId, []);
       }
       blocks.get(blockId).push(tVar);
    }
  }

  for (const [blockId, vars] of blocks) {
    if (vars.length > 1) {
      // Keep the first one, remove the rest
      for (let i = 1; i < vars.length; i++) {
        const stmt = vars[i].getFirstAncestorByKind(SyntaxKind.VariableStatement);
        if (stmt) {
          stmt.remove();
          modified = true;
        }
      }
    }
  }

  // Find where 't' is used but not defined in scope
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
               body.insertStatements(0, 'const { t } = useTranslation();');
               modified = true;
               
               const hasImport = sourceFile.getImportDeclaration(dec => dec.getModuleSpecifierValue() === 'react-i18next');
               if (!hasImport) {
                 sourceFile.addImportDeclaration({
                   namedImports: ['useTranslation'],
                   moduleSpecifier: 'react-i18next',
                 });
               }
            }
          }
        }
      }
    }
  }

  if (modified) {
    sourceFile.saveSync();
    fixed++;
  }
}
console.log('Fixed', fixed, 'files.');
