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
  let modified = false;

  const functionDecs = sourceFile.getFunctions();
  
  for (const func of functionDecs) {
    // Only target functions that are NOT the main exported screen
    const isScreen = func.isExported() && func.getName() && func.getName().endsWith('Screen');
    if (!isScreen) {
      const bodyText = func.getBodyText() || '';
      if (bodyText.includes('i18n.t(')) {
        // 1. Add `t: any` parameter
        func.addParameter({ name: 't', type: 'any' });
        
        // 2. Replace i18n.t with t inside body
        const newBody = bodyText.replace(/i18n\.t\(/g, 't(');
        func.setBodyText(newBody);
        
        // 3. Find references and update calls
        const funcName = func.getName();
        if (funcName) {
           const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
           for (const call of calls) {
             const exp = call.getExpression();
             if (exp.getKind() === SyntaxKind.Identifier && exp.getText() === funcName) {
               // Update arguments
               call.addArgument('t');
             }
           }
        }
        modified = true;
      }
    }
  }

  // Also handle const getGreeting = () => { ... }
  const varDecls = sourceFile.getVariableDeclarations();
  for (const vd of varDecls) {
    const isScreen = vd.getName() && vd.getName().endsWith('Screen');
    if (!isScreen) {
      const init = vd.getInitializerIfKind(SyntaxKind.ArrowFunction) || vd.getInitializerIfKind(SyntaxKind.FunctionExpression);
      if (init) {
        const bodyText = init.getBodyText() || '';
        if (bodyText.includes('i18n.t(')) {
          init.addParameter({ name: 't', type: 'any' });
          const newBody = bodyText.replace(/i18n\.t\(/g, 't(');
          init.setBodyText(newBody);

          const funcName = vd.getName();
          if (funcName) {
             const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
             for (const call of calls) {
               const exp = call.getExpression();
               if (exp.getKind() === SyntaxKind.Identifier && exp.getText() === funcName) {
                 call.addArgument('t');
               }
             }
          }
          modified = true;
        }
      }
    }
  }
  
  // As a final catch-all, if there are any remaining `i18n.t(` directly inside the React components, replace them with `t(`.
  // Because they already have `const { t } = useTranslation();` injected from earlier phases!
  if (sourceFile.getFullText().includes('i18n.t(')) {
    const newText = sourceFile.getFullText().replace(/i18n\.t\(/g, 't(');
    sourceFile.replaceWithText(newText);
    modified = true;
  }

  if (modified) {
    sourceFile.saveSync();
    console.log('Refactored helpers in:', path.basename(sourceFile.getFilePath()));
    modifiedCount++;
  }
}

console.log(`Refactored ${modifiedCount} files.`);
