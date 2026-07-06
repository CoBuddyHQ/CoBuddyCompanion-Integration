const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const TARGET_DIR = path.join(__dirname, 'src/screens/requests');
const EN_JSON_PATH = path.join(__dirname, 'src/i18n/locales/en.json');

function createKey(str) {
  let key = str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  if (key.length > 40) {
    key = key.substring(0, 40).replace(/_+$/, '');
  }
  return key || 'text_' + Math.random().toString(36).substring(2, 7);
}

const SKIP_PROPS = [
  'testID', 'accessibilityLabel', 'accessibilityHint', 'accessibilityRole', 
  'icon', 'name', 'color', 'size', 'variant', 'behavior', 'keyboardType', 
  'autoCapitalize', 'status', 'storeKey', 'keyboardShouldPersistTaps', 
  'returnKeyType', 'textAlignVertical', 'autoComplete', 'autoCorrect', 
  'textContentType', 'pointerEvents', 'clearButtonMode', 'keyboardAppearance',
  'barStyle', 'animationType', 'intensity', 'decelerationRate'
];

function processFile(filePath, enJson) {
  let code = fs.readFileSync(filePath, 'utf-8');
  if (!code.includes('import React')) return false;

  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
  } catch (e) {
    return false;
  }

  let modified = false;
  let useTranslationImported = false;
  
  // Set to keep track of functions we need to inject 'useTranslation' into
  const functionsToInject = new Set();

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === 'react-i18next') {
        useTranslationImported = true;
      }
    },
    JSXText(path) {
      const text = path.node.value.trim();
      if (text.length > 1 && /[a-zA-Z]/.test(text) && !text.includes('{') && !text.includes('}')) {
        const key = createKey(text);
        const fullKey = 'application.' + key;
        enJson.application[key] = text;
        path.replaceWith(t.jsxExpressionContainer(t.callExpression(t.identifier('t'), [t.stringLiteral(fullKey)])));
        modified = true;
        
        // Find enclosing function to inject useTranslation
        const funcPath = path.findParent((p) => p.isFunctionDeclaration() || p.isArrowFunctionExpression() || p.isFunctionExpression());
        if (funcPath) {
          functionsToInject.add(funcPath);
        }
      }
    },
    JSXAttribute(path) {
      if (SKIP_PROPS.includes(path.node.name.name)) return;
      
      const value = path.node.value;
      if (value && t.isStringLiteral(value)) {
        const text = value.value.trim();
        if (text.length > 1 && /[a-zA-Z]/.test(text)) {
          const key = createKey(text);
          const fullKey = 'application.' + key;
          enJson.application[key] = text;
          path.node.value = t.jsxExpressionContainer(t.callExpression(t.identifier('t'), [t.stringLiteral(fullKey)]));
          modified = true;
          
          // Find enclosing function to inject useTranslation
          const funcPath = path.findParent((p) => p.isFunctionDeclaration() || p.isArrowFunctionExpression() || p.isFunctionExpression());
          if (funcPath) {
            functionsToInject.add(funcPath);
          }
        }
      }
    }
  });

  if (modified) {
    // Inject `const { t } = useTranslation();` at the beginning of each collected function's body
    for (const funcPath of functionsToInject) {
      const body = funcPath.get('body');
      if (body.isBlockStatement()) {
        // Check if it already has useTranslation
        let hasUseTranslation = false;
        body.traverse({
          CallExpression(innerPath) {
            if (innerPath.node.callee.name === 'useTranslation') {
              hasUseTranslation = true;
            }
          }
        });
        if (!hasUseTranslation) {
          // const { t } = useTranslation();
          const hookCall = t.variableDeclaration('const', [
            t.variableDeclarator(
              t.objectPattern([t.objectProperty(t.identifier('t'), t.identifier('t'), false, true)]),
              t.callExpression(t.identifier('useTranslation'), [])
            )
          ]);
          body.unshiftContainer('body', hookCall);
        }
      } else {
        // Arrow function without block body e.g. () => <JSX />
        // Convert to () => { const { t } = useTranslation(); return <JSX />; }
        const hookCall = t.variableDeclaration('const', [
          t.variableDeclarator(
            t.objectPattern([t.objectProperty(t.identifier('t'), t.identifier('t'), false, true)]),
            t.callExpression(t.identifier('useTranslation'), [])
          )
        ]);
        const newBody = t.blockStatement([hookCall, t.returnStatement(body.node)]);
        body.replaceWith(newBody);
      }
    }

    let output = generate(ast, { retainLines: true, comments: true }, code).code;
    
    if (!useTranslationImported) {
      output = "import { useTranslation } from 'react-i18next';\n" + output;
    }
    
    fs.writeFileSync(filePath, output, 'utf-8');
    return true;
  }
  return false;
}

function run() {
  const enData = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf-8'));
  if (!enData.application) enData.application = {};
  
  let filesModified = 0;
  
  function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const p = path.join(dir, f);
      if (fs.statSync(p).isDirectory()) {
        walk(p);
      } else if (p.endsWith('.tsx')) {
        if (processFile(p, enData)) {
          filesModified++;
        }
      }
    }
  }
  
  walk(TARGET_DIR);
  if (filesModified > 0) {
    fs.writeFileSync(EN_JSON_PATH, JSON.stringify(enData, null, 2), 'utf-8');
  }
}

run();
