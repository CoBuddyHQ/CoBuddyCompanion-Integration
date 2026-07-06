const fs = require('fs');
const path = require('path');
const { parse } = require('@typescript-eslint/typescript-estree');

const SRC_DIR = path.join(__dirname, 'src');

const BANNED_ENGLISH_REGEX = /[a-zA-Z]{2,}/; // rudimentary english check

function checkCode(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = parse(code, {
      loc: true,
      jsx: true
    });
  } catch (e) {
    // console.log(`Parse error ${filePath}`);
    return;
  }

  const violations = [];

  function isEnglish(text) {
    if (typeof text !== 'string') return false;
    const t = text.trim();
    if (!t) return false;
    // skip common single words like icon names, keys, colors
    if (/^#?[A-Za-z0-9]+$/.test(t) && t.length <= 10 && t.toLowerCase() === t) return false; // lowercase keys
    if (t.includes('http') || t.startsWith('/')) return false; // urls/paths
    return BANNED_ENGLISH_REGEX.test(t);
  }

  function walk(node, parent) {
    if (!node) return;

    // 1. JSX Text that is plain English
    if (node.type === 'JSXText') {
      if (isEnglish(node.value) && parent && parent.type === 'JSXElement') {
        const tag = parent.openingElement.name.name;
        // if not inside a <Text> component, usually it's fine, but still let's flag
        // actually we only care about <Text> components having raw english
        if (tag === 'Text' || tag === 'Button' || tag === 'AppText') {
            violations.push(`Line ${node.loc.start.line}: Raw English JSXText -> "${node.value.trim()}"`);
        }
      }
    }

    // 2. JSX Props like label, title, placeholder
    if (node.type === 'JSXAttribute') {
      const name = node.name.name;
      if (['label', 'title', 'placeholder', 'subtitle', 'description', 'errorMessage'].includes(name)) {
        if (node.value && node.value.type === 'Literal' && isEnglish(node.value.value)) {
          violations.push(`Line ${node.loc.start.line}: Raw English in prop ${name} -> "${node.value.value}"`);
        }
      }
    }

    // 3. Ternary strings (ConditionalExpression)
    if (node.type === 'ConditionalExpression') {
      if (node.consequent.type === 'Literal' && typeof node.consequent.value === 'string' && isEnglish(node.consequent.value)) {
          // It might be an icon name, check if it's UI text
          if (node.consequent.value.includes(' ')) {
              violations.push(`Line ${node.loc.start.line}: Unlocalized ternary -> "${node.consequent.value}"`);
          }
      }
      if (node.alternate.type === 'Literal' && typeof node.alternate.value === 'string' && isEnglish(node.alternate.value)) {
          if (node.alternate.value.includes(' ')) {
              violations.push(`Line ${node.loc.start.line}: Unlocalized ternary -> "${node.alternate.value}"`);
          }
      }
    }

    for (const key in node) {
      if (node[key] && typeof node[key] === 'object') {
        walk(node[key], node);
      }
    }
  }

  walk(ast, null);

  if (violations.length > 0) {
    console.log(`\n🚨 ${filePath}`);
    violations.forEach(v => console.log(`   ${v}`));
  }
}

function scan(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scan(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      checkCode(fullPath);
    }
  }
}

console.log("=== RUNNING ABSOLUTE FINAL GATEKEEPER AST SCAN ===");
scan(SRC_DIR);
console.log("=== SCAN COMPLETE ===");
