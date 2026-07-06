const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});

project.addSourceFilesAtPaths(path.join(__dirname, '../src/screens/**/*.tsx'));

const DICT = {
  'Cancel': 'cancel',
  'Confirm': 'confirm',
  'Save': 'save',
  'Continue': 'continue',
  'Submit': 'submit',
  'Yes': 'yes',
  'No': 'no',
  'Back': 'back',
  'Next': 'next',
  'Done': 'done',
  'Required': 'required',
};

let modifiedFiles = 0;

for (const sourceFile of project.getSourceFiles()) {
  const filePath = sourceFile.getFilePath();
  if (filePath.includes('/auth/') || filePath.includes('/application/')) {
    continue;
  }

  let modified = false;

  // Find all JSX Text nodes
  const jsxTexts = sourceFile.getDescendantsOfKind(SyntaxKind.JsxText);

  for (const jsxText of jsxTexts) {
    const text = jsxText.getLiteralText().trim();
    if (DICT[text]) {
      const parent = jsxText.getParentIfKind(SyntaxKind.JsxElement) || jsxText.getParentIfKind(SyntaxKind.JsxSelfClosingElement);
      if (parent) {
        jsxText.replaceWithText(`{t('common.${DICT[text]}')}`);
        modified = true;
      }
    }
  }

  if (modified) {
    // Check if useTranslation is already imported
    const hasImport = sourceFile.getImportDeclaration(dec => dec.getModuleSpecifierValue() === 'react-i18next');
    if (!hasImport) {
      sourceFile.addImportDeclaration({
        namedImports: ['useTranslation'],
        moduleSpecifier: 'react-i18next',
      });
    }

    // Find the main component function to inject the hook
    let injected = false;

    // Try finding standard function declarations (e.g. export function MyScreen)
    const functionDecs = sourceFile.getFunctions();
    for (const func of functionDecs) {
      if (func.isExported() && func.getName() && func.getName().endsWith('Screen')) {
        func.insertStatements(0, 'const { t } = useTranslation();');
        injected = true;
        break;
      }
    }

    // Try finding arrow functions assigned to const variables (e.g. const MyScreen = () => ...)
    if (!injected) {
      const variableDecls = sourceFile.getVariableDeclarations();
      for (const vd of variableDecls) {
        if (vd.getName() && vd.getName().endsWith('Screen')) {
          const init = vd.getInitializerIfKind(SyntaxKind.ArrowFunction);
          if (init) {
            const body = init.getBody();
            if (body.getKind() === SyntaxKind.Block) {
              // Standard block body
              init.insertStatements(0, 'const { t } = useTranslation();');
              injected = true;
            } else if (body.getKind() === SyntaxKind.ParenthesizedExpression || body.getKind() === SyntaxKind.JsxElement) {
              // Implicit return: () => (<View/>)
              // This is harder to modify safely in AST without deep reconstruction, skip for now.
              console.warn(`Could not inject into implicit return arrow function in ${filePath}`);
            }
            break;
          }
        }
      }
    }

    if (!injected) {
      console.warn(`Warning: Could not inject useTranslation into main component in ${filePath}. Check manually.`);
    }

    sourceFile.saveSync();
    console.log(`Migrated ${path.basename(filePath)}`);
    modifiedFiles++;
  }
}

console.log(`Successfully migrated ${modifiedFiles} files using AST.`);
