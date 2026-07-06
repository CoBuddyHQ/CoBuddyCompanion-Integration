const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const EN_JSON_PATH = path.join(__dirname, 'src', 'i18n', 'locales', 'en.json');
const enJson = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf-8'));

// Keys considered "structural" that should remain raw strings
const STRUCTURAL_KEYS = ['id', 'icon', 'color', 'type', 'key', 'name', 'emoji', 'url', 'route', 'screen', 'eta'];

function getNestedValue(obj, keyPath) {
  return keyPath.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function valueToAst(val, keyPathContext) {
  if (val === null) return t.nullLiteral();
  if (typeof val === 'number') return t.numericLiteral(val);
  if (typeof val === 'boolean') return t.booleanLiteral(val);
  if (typeof val === 'string') {
    // If it's a simple string array (like ALL_AREAS), we treat it as structural ID/Hex
    return t.stringLiteral(val);
  }
  if (Array.isArray(val)) {
    return t.arrayExpression(val.map((item, index) => valueToAst(item, `${keyPathContext}.${index}`)));
  }
  if (typeof val === 'object') {
    const properties = [];
    for (const [k, v] of Object.entries(val)) {
      if (STRUCTURAL_KEYS.includes(k)) {
        // Raw structural string
        properties.push(t.objectProperty(t.identifier(k), valueToAst(v, `${keyPathContext}.${k}`)));
      } else {
        // It's a display string, output the translation key instead of the English text
        const transKey = `${keyPathContext}.${k}`;
        properties.push(t.objectProperty(t.identifier(k), t.stringLiteral(transKey)));
      }
    }
    return t.objectExpression(properties);
  }
  return t.stringLiteral(String(val));
}

function processFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });
  } catch (e) {
    console.error(`Failed to parse ${filePath}`);
    return;
  }

  let modified = false;

  traverse(ast, {
    VariableDeclarator(path) {
      if (!path.node.init) return;

      // Look for i18next.t(...) or t(...) or (i18next.t(...) as any[])
      let callExpr = path.node.init;
      
      // Handle TSAsExpression e.g. i18next.t(...) as any[]
      if (t.isTSAsExpression(callExpr)) {
        callExpr = callExpr.expression;
      }

      if (t.isCallExpression(callExpr)) {
        const callee = callExpr.callee;
        let isT = false;
        if (t.isIdentifier(callee, { name: 't' })) {
          isT = true;
        } else if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.object, { name: 'i18next' }) &&
          t.isIdentifier(callee.property, { name: 't' })
        ) {
          isT = true;
        }

        if (isT && callExpr.arguments.length >= 1) {
          const firstArg = callExpr.arguments[0];
          const secondArg = callExpr.arguments[1];

          if (t.isStringLiteral(firstArg)) {
            // Check if returnObjects: true
            let hasReturnObjects = false;
            if (secondArg && t.isObjectExpression(secondArg)) {
              for (const prop of secondArg.properties) {
                if (t.isIdentifier(prop.key, { name: 'returnObjects' }) && t.isBooleanLiteral(prop.value, { value: true })) {
                  hasReturnObjects = true;
                }
              }
            }

            if (hasReturnObjects) {
              const transKey = firstArg.value;
              const jsonVal = getNestedValue(enJson, transKey);
              if (jsonVal) {
                console.log(`[${path.node.id.name}] Restoring static AST from key: ${transKey}`);
                const restoredAst = valueToAst(jsonVal, transKey);
                
                // If it was wrapped in a TSAsExpression (e.g. `as any[]`), we can preserve it or just replace the init entirely
                // Let's wrap the new AST in the original TSAsExpression if it existed
                if (t.isTSAsExpression(path.node.init)) {
                  path.node.init.expression = restoredAst;
                } else {
                  path.node.init = restoredAst;
                }
                
                modified = true;
              } else {
                console.warn(`[WARNING] Key not found in en.json: ${transKey}`);
              }
            }
          }
        }
      }
    }
  });

  if (modified) {
    const output = generate(ast, { retainLines: true }, code);
    fs.writeFileSync(filePath, output.code);
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

console.log('Starting structural logic restoration...');
walkDir(path.join(__dirname, 'src', 'screens'));
console.log('Done.');
