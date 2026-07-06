const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const SCREENS_DIR = path.join(__dirname, 'src/screens');

const CONTENT_MAP = {
  'applicationKycContent': 'application_kyc',
  'authOnboardingContent': 'auth_onboarding'
};

const EN_JSON_PATH = path.join(__dirname, 'src/i18n/locales/en.json');
const enData = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf-8'));

function processFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf-8');
  if (!code.includes('import')) return false;

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
  let contentImports = {}; // e.g. { BasicDetailsContent: 'application_kyc', AuthContent: 'auth_onboarding' }
  const functionsToInject = new Set();
  
  // Pass 1: Identify imports
  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source && path.node.source.value === 'react-i18next') {
        useTranslationImported = true;
      }
      
      for (const [fileKey, namespace] of Object.entries(CONTENT_MAP)) {
        if (path.node.source && path.node.source.value && path.node.source.value.includes(`content/${fileKey}`)) {
          for (const specifier of path.node.specifiers) {
            if (t.isImportSpecifier(specifier)) {
              contentImports[specifier.local.name] = namespace;
            }
          }
          path.remove();
          modified = true;
          break;
        }
      }
    }
  });

  if (Object.keys(contentImports).length === 0) {
    return false; // Nothing to refactor
  }

  // Pass 2: Replace MemberExpressions
  traverse(ast, {
    MemberExpression(path) {
      if (t.isIdentifier(path.node.object) && t.isIdentifier(path.node.property)) {
        const objName = path.node.object.name;
        const propName = path.node.property.name;
        
        if (contentImports[objName]) {
          const namespace = contentImports[objName];
          const fullKey = `content.${namespace}.${objName}.${propName}`;
          
          let val = enData?.content?.[namespace]?.[objName]?.[propName];
          let isObject = val !== null && typeof val === 'object';
          
          let replacementNode;
          if (isObject) {
            // (t('...', { returnObjects: true }) as any[])
            replacementNode = t.tsAsExpression(
              t.callExpression(t.identifier('t'), [
                t.stringLiteral(fullKey),
                t.objectExpression([
                  t.objectProperty(t.identifier('returnObjects'), t.booleanLiteral(true))
                ])
              ]),
              t.tsArrayType(t.tsAnyKeyword())
            );
          } else {
            replacementNode = t.callExpression(t.identifier('t'), [t.stringLiteral(fullKey)]);
          }
          
          // Are we inside JSXAttribute?
          if (path.parentPath.isJSXExpressionContainer() && path.parentPath.parentPath.isJSXAttribute()) {
            path.replaceWith(replacementNode);
          } 
          // Are we inside JSXText?
          else if (path.parentPath.isJSXExpressionContainer() && path.parentPath.parentPath.isJSXElement()) {
            path.replaceWith(replacementNode);
          }
          else {
            path.replaceWith(replacementNode);
          }
          
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
    // Inject `const { t } = useTranslation();`
    for (const funcPath of functionsToInject) {
      const body = funcPath.get('body');
      if (body.isBlockStatement()) {
        let hasUseTranslation = false;
        body.traverse({
          CallExpression(innerPath) {
            if (innerPath.node.callee.name === 'useTranslation') {
              hasUseTranslation = true;
            }
          }
        });
        if (!hasUseTranslation) {
          const hookCall = t.variableDeclaration('const', [
            t.variableDeclarator(
              t.objectPattern([t.objectProperty(t.identifier('t'), t.identifier('t'), false, true)]),
              t.callExpression(t.identifier('useTranslation'), [])
            )
          ]);
          body.unshiftContainer('body', hookCall);
        }
      } else {
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

let modifiedCount = 0;
function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx')) {
      if (processFile(p)) {
        modifiedCount++;
      }
    }
  }
}

walk(SCREENS_DIR);
console.log(`Refactoring complete. Modified ${modifiedCount} files.`);
