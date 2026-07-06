const fs = require('fs');
const path = require('path');

const stacksDir = path.join(__dirname, 'src', 'navigation', 'stacks');
const rootNavPath = path.join(__dirname, 'src', 'navigation', 'RootNavigator.tsx');

const stackFiles = fs.readdirSync(stacksDir).filter(f => f.endsWith('Stack.tsx'));

let rootContent = fs.readFileSync(rootNavPath, 'utf8');
let newImports = '';
let newScreens = '';

// Helper to check if a component is already imported in RootNavigator
function isImported(componentName) {
  return rootContent.includes(`{${componentName}}`) || rootContent.includes(`${componentName} from`);
}

// Helper to check if a route is already registered
function isRegistered(routeName) {
  return rootContent.includes(`name={Routes.${routeName}}`) || rootContent.includes(`name={Routes.${routeName} as any}`);
}

stackFiles.forEach(file => {
  const content = fs.readFileSync(path.join(stacksDir, file), 'utf8');
  
  // Extract imports from stack file
  const importRegex = /import\s+\{?([^}]+)\}?\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  const importsMap = {};
  while ((match = importRegex.exec(content)) !== null) {
    const components = match[1].split(',').map(s => s.trim());
    components.forEach(c => {
      // adjust path for RootNavigator (one level up from stacks, so mostly the same if they use ../../)
      // Actually, stacks are in src/navigation/stacks/ and Root is in src/navigation/
      // So ../../screens -> ../screens
      let importPath = match[2];
      if (importPath.startsWith('../../')) {
        importPath = '../' + importPath.slice(6);
      }
      importsMap[c] = importPath;
    });
  }

  // Extract Stack.Screen lines
  const screenRegex = /<Stack\.Screen\s+name=\{Routes\.([A-Z_0-9]+)\}\s+component=\{([^}]+)\}.*?\/>/g;
  while ((match = screenRegex.exec(content)) !== null) {
    const routeName = match[1];
    const componentName = match[2].trim();

    if (!isRegistered(routeName) && !newScreens.includes(`name={Routes.${routeName}`)) {
      newScreens += `      <Stack.Screen name={Routes.${routeName} as any} component={${componentName} as any} options={{headerShown: false}} />\n`;
      
      if (!isImported(componentName) && !newImports.includes(componentName)) {
        if (importsMap[componentName]) {
          newImports += `import {${componentName}} from '${importsMap[componentName]}';\n`;
        }
      }
    }
  }
});

if (newScreens) {
  // Insert imports
  const lastImportIndex = rootContent.lastIndexOf('import');
  const insertIndex = rootContent.indexOf('\n', lastImportIndex) + 1;
  rootContent = rootContent.slice(0, insertIndex) + newImports + rootContent.slice(insertIndex);

  // Insert screens
  rootContent = rootContent.replace('    </Stack.Navigator>', `\n      {/* ── Auto-injected all deep screens to support global back stack ── */}\n${newScreens}    </Stack.Navigator>`);
  
  fs.writeFileSync(rootNavPath, rootContent, 'utf8');
  console.log('Injected all missing screens into RootNavigator.tsx');
} else {
  console.log('No new screens to inject');
}
