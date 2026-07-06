const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});

project.addSourceFilesAtPaths(__dirname.replace(/\\/g, '/') + '/../src/screens/earnings/*.tsx');

const enJsonPath = path.join(__dirname, '../src/i18n/locales/en.json');
let enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

if (!enJson.earnings) {
  enJson.earnings = {};
}

let modifiedFiles = 0;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// Common dictionary for quick matching
const commonDict = {
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

for (const sourceFile of project.getSourceFiles()) {
  const filePath = sourceFile.getFilePath();
  let modified = false;

  // Function to process a string text and return the translation key
  function getTranslationKey(text) {
    if (commonDict[text]) return `common.${commonDict[text]}`;
    let slug = slugify(text);
    if (!slug) return null;
    
    // Check if it already exists to avoid overwriting with different values
    let key = slug;
    let counter = 1;
    while (enJson.earnings[key] && enJson.earnings[key] !== text) {
      key = `${slug}_${counter}`;
      counter++;
    }
    enJson.earnings[key] = text;
    return `earnings.${key}`;
  }

  // 1. Process JSXText
  const jsxTexts = sourceFile.getDescendantsOfKind(SyntaxKind.JsxText);
  for (const jsxText of jsxTexts) {
    const rawText = jsxText.getLiteralText();
    // Skip if it's just whitespace or purely variables like {value} 
    const text = rawText.trim().replace(/\s+/g, ' '); // Normalize spaces
    
    // Ignore pure symbols, empty strings, and pure numbers
    if (text.length > 1 && /[a-zA-Z]/.test(text) && !text.includes('{') && !text.includes('}')) {
      const transKey = getTranslationKey(text);
      if (transKey) {
        jsxText.replaceWithText(` {t('${transKey}')} `);
        modified = true;
      }
    }
  }

  // 2. Process specific JSX Attributes (label, title, subtitle)
  const jsxAttributes = sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute);
  for (const attr of jsxAttributes) {
    const name = attr.getNameNode().getText();
    if (['label', 'title', 'subtitle', 'text', 'placeholder'].includes(name)) {
      const init = attr.getInitializer();
      if (init && init.getKind() === SyntaxKind.StringLiteral) {
        const text = init.getLiteralText().trim();
        if (text.length > 0 && /[a-zA-Z]/.test(text)) {
          const transKey = getTranslationKey(text);
          if (transKey) {
            attr.setInitializer(`{t('${transKey}')}`);
            modified = true;
          }
        }
      }
    }
  }

  if (modified) {
    // Add useTranslation import
    const hasImport = sourceFile.getImportDeclaration(dec => dec.getModuleSpecifierValue() === 'react-i18next');
    if (!hasImport) {
      sourceFile.addImportDeclaration({
        namedImports: ['useTranslation'],
        moduleSpecifier: 'react-i18next',
      });
    }

    // Add i18n import as a fallback
    const hasI18nImport = sourceFile.getImportDeclaration(dec => dec.getModuleSpecifierValue() === '../../i18n');
    if (!hasI18nImport) {
      sourceFile.addImportDeclaration({
        defaultImport: 'i18n',
        moduleSpecifier: '../../i18n',
      });
    }

    // Inject const { t } = useTranslation();
    let injected = false;
    const functionDecs = sourceFile.getFunctions();
    for (const func of functionDecs) {
      if (func.isExported() && func.getName() && func.getName().endsWith('Screen')) {
        func.insertStatements(0, 'const { t } = useTranslation();');
        injected = true;
        break;
      }
    }

    if (!injected) {
      const variableDecls = sourceFile.getVariableDeclarations();
      for (const vd of variableDecls) {
        if (vd.getName() && vd.getName().endsWith('Screen')) {
          const init = vd.getInitializerIfKind(SyntaxKind.ArrowFunction);
          if (init) {
            const body = init.getBody();
            if (body.getKind() === SyntaxKind.Block) {
              init.insertStatements(0, 'const { t } = useTranslation();');
              injected = true;
            }
            break;
          }
        }
      }
    }

    if (!injected) {
      console.warn(`Could not inject useTranslation into main component in ${filePath}.`);
    }

    sourceFile.saveSync();
    console.log(`Migrated ${path.basename(filePath)}`);
    modifiedFiles++;
  }
}

// Write back en.json
// Sort earnings keys alphabetically for neatness
const sortedEarnings = Object.keys(enJson.earnings)
  .sort()
  .reduce((obj, key) => {
    obj[key] = enJson.earnings[key];
    return obj;
  }, {});
enJson.earnings = sortedEarnings;

fs.writeFileSync(enJsonPath, JSON.stringify(enJson, null, 2), 'utf8');

console.log(`\nSuccessfully migrated ${modifiedFiles} screens.`);
console.log(`Updated en.json with new earnings keys.`);
