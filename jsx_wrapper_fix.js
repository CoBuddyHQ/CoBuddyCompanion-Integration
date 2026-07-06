const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

function processFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });
  } catch (e) {
    return;
  }

  let modified = false;

  traverse(ast, {
    JSXExpressionContainer(path) {
      // Look for t(...)
      if (t.isCallExpression(path.node.expression) && t.isIdentifier(path.node.expression.callee, { name: 't' })) {
        const arg = path.node.expression.arguments[0];
        
        // Un-wrap if it's a style! We know it's a style if the JSXAttribute name is 'style' or 'contentContainerStyle'
        let isStyleAttr = false;
        if (path.parentPath.isJSXAttribute()) {
          const attrName = path.parentPath.node.name.name;
          if (attrName === 'style' || attrName === 'contentContainerStyle') {
            isStyleAttr = true;
          }
        }
        
        // Or if the argument is s.something or styles.something
        let isStyleObject = false;
        if (t.isMemberExpression(arg) && t.isIdentifier(arg.object)) {
          if (arg.object.name === 's' || arg.object.name === 'styles') {
            isStyleObject = true;
          }
        }
        
        if (isStyleAttr || isStyleObject) {
          path.node.expression = arg; // unwrap
          modified = true;
        }
      }
    }
  });

  if (modified) {
    const output = generate(ast, { retainLines: true }, code);
    fs.writeFileSync(filePath, output.code);
    console.log(`Unwrapped styles in ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src', 'screens'));
