const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});

// We want to process exactly the folders that are untouched/vulnerable.
// For full localization extraction and injection:
const targetDirs = ['application', 'auth', 'onboarding', 'states', 'system', 'training', 'verification', 'profile', 'dashboard', 'requests', 'sessions']; 
// Note: 'profile' is here just to catch 'EditPhotosScreen.tsx'

for (const dir of targetDirs) {
  project.addSourceFilesAtPaths(path.join(__dirname, `../src/screens/${dir}/**/*.tsx`));
}

const enJsonPath = path.join(__dirname, '../src/i18n/locales/en.json');
let enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

let modifiedFilesCount = 0;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

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
  'Error': 'error',
  'Success': 'success'
};

for (const sourceFile of project.getSourceFiles()) {
  const filePath = sourceFile.getFilePath();
  const dirName = path.basename(path.dirname(filePath));
  
  if (!enJson[dirName]) {
    enJson[dirName] = {};
  }

  let modified = false;

  function getTranslationKey(text) {
    if (commonDict[text]) return `common.${commonDict[text]}`;
    let slug = slugify(text);
    if (!slug) return null;
    
    let key = slug;
    let counter = 1;
    while (enJson[dirName][key] && enJson[dirName][key] !== text) {
      key = `${slug}_${counter}`;
      counter++;
    }
    enJson[dirName][key] = text;
    return `${dirName}.${key}`;
  }

  // Process JSXText
  const jsxTexts = sourceFile.getDescendantsOfKind(SyntaxKind.JsxText);
  for (const jsxText of jsxTexts) {
    const rawText = jsxText.getLiteralText();
    const text = rawText.trim().replace(/\s+/g, ' '); 
    
    if (text.length > 1 && /[a-zA-Z]/.test(text) && !text.includes('{') && !text.includes('}')) {
      const transKey = getTranslationKey(text);
      if (transKey) {
        jsxText.replaceWithText(` {t('${transKey}')} `);
        modified = true;
      }
    }
  }

  // Process specific JSX Attributes
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
    modifiedFilesCount++;
    console.log('Hardened:', path.basename(filePath));
  }
}

fs.writeFileSync(enJsonPath, JSON.stringify(enJson, null, 2), 'utf8');
console.log(`Hardened ${modifiedFilesCount} files.`);
