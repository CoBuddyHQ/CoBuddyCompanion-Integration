const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx')) {
      let code = fs.readFileSync(p, 'utf8');
      if (code.includes("t('content")) {
        try {
          const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
          let modified = false;
          let needsI18next = false;
          
          traverse(ast, {
            CallExpression(path) {
              if (path.node.callee.name === 't') {
                const func = path.findParent(p => p.isFunction());
                if (!func) {
                  path.node.callee.name = 'i18next.t';
                  modified = true;
                  needsI18next = true;
                }
              }
            }
          });
          
          if (modified) {
            let hasImport = false;
            traverse(ast, {
              ImportDeclaration(path) {
                if (path.node.source.value === 'i18next') hasImport = true;
              }
            });
            
            let output = generate(ast, { retainLines: true }, code).code;
            if (needsI18next && !hasImport) {
              output = "import i18next from 'i18next';\n" + output;
            }
            fs.writeFileSync(p, output, 'utf8');
            console.log('Fixed top-level t in', p);
          }
        } catch(e) {}
      }
    }
  });
}

walk('src/screens');
