const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const TEXT_PROPS = ['label', 'sub', 'subtitle', 'description', 'title', 'text', 'reason', 'message', 'placeholder', 'phase', 'desc', 'consequence'];

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
    JSXExpressionContainer(path) {
      if (t.isMemberExpression(path.node.expression)) {
        const propName = path.node.expression.property.name;
        if (TEXT_PROPS.includes(propName)) {
          // Wrap in t()
          // Ensure it's not ALREADY wrapped in t()
          // Wait, path.node.expression is already the member expression `item.label`.
          path.node.expression = t.callExpression(t.identifier('t'), [path.node.expression]);
          modified = true;
        }
      }
    },
    JSXAttribute(path) {
      if (
        t.isJSXExpressionContainer(path.node.value) &&
        t.isMemberExpression(path.node.value.expression)
      ) {
        const propName = path.node.value.expression.property.name;
        const attrName = path.node.name.name;
        if (TEXT_PROPS.includes(propName) || TEXT_PROPS.includes(attrName)) {
          path.node.value.expression = t.callExpression(t.identifier('t'), [path.node.value.expression]);
          modified = true;
        }
      }
    }
  });

  if (modified) {
    const output = generate(ast, { retainLines: true }, code);
    fs.writeFileSync(filePath, output.code);
    console.log(`Updated JSX in ${filePath}`);
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

console.log('Starting JSX translation wrapper...');
walkDir(path.join(__dirname, 'src', 'screens'));
console.log('Done.');
