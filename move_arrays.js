const fs = require('fs');

const filesToMove = [
  'src/screens/application/InterestsPersonalityScreen.tsx',
  'src/screens/auth/BiometricSetupScreen.tsx',
  'src/screens/auth/LocationPermissionScreen.tsx',
  'src/screens/auth/NotificationPermissionScreen.tsx',
  'src/screens/auth/OTPVerificationScreen.tsx',
  'src/screens/onboarding/CompanionWelcomeScreen.tsx',
  'src/screens/onboarding/RoleConfirmationScreen.tsx',
  'src/screens/onboarding/TermsConsentScreen.tsx'
];

filesToMove.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  
  // Find "const MAX_SELECT = ..." or "const FEATURES = [...]" etc. defined top level before the component
  // Basically anything starting with "const " and having "Content." before "const [A-Z]" of the component.
  // Instead of regex, I can just use AST to do this safely.
  
  const parser = require('@babel/parser');
  const traverse = require('@babel/traverse').default;
  const generate = require('@babel/generator').default;
  const t = require('@babel/types');

  const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
  
  let varsToMove = [];
  let componentBodyPath = null;
  
  traverse(ast, {
    VariableDeclaration(path) {
      if (path.parent.type === 'Program') {
        let hasContent = false;
        path.traverse({
          Identifier(p) {
            if (p.node.name.endsWith('Content')) hasContent = true;
          }
        });
        if (hasContent) {
          varsToMove.push(path.node);
          path.remove();
        }
      }
    },
    FunctionDeclaration(path) {
      if (!componentBodyPath && path.parent.type === 'Program' || path.parent.type === 'ExportDefaultDeclaration' || path.parent.type === 'ExportNamedDeclaration') {
         if (path.node.id && path.node.id.name.endsWith('Screen')) {
             componentBodyPath = path.get('body');
         }
      }
    },
    ArrowFunctionExpression(path) {
      if (!componentBodyPath && path.parent.type === 'VariableDeclarator') {
         if (path.parent.id.name.endsWith('Screen')) {
             componentBodyPath = path.get('body');
         }
      }
    }
  });

  if (componentBodyPath && varsToMove.length > 0) {
    varsToMove.reverse().forEach(v => {
      componentBodyPath.unshiftContainer('body', v);
    });
    const output = generate(ast, { retainLines: true }, code).code;
    fs.writeFileSync(file, output, 'utf8');
    console.log('Moved in', file);
  }
});
