const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../src/screens/auth');

function processImports() {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.tsx'));
  let totalModifications = 0;

  files.forEach(file => {
    const filePath = path.join(DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check which objects are used
    const objects = ['BiometricContent', 'ConfirmPINContent', 'CreatePINContent', 'LanguageContent', 'LocationPermContent', 'NotificationPermContent', 'OTPContent', 'PhoneLoginContent', 'SplashContent'];
    
    let neededObjects = [];
    objects.forEach(obj => {
      if (content.includes(`{${obj}.`) || content.includes(`${obj}.`)) {
        neededObjects.push(obj);
      }
    });

    if (neededObjects.length > 0) {
      const importRegex = /import\s+\{([^}]*)\}\s+from\s+['"]\.\.\/\.\.\/content\/authOnboardingContent['"];/;
      const match = content.match(importRegex);
      
      if (match) {
        let importedItems = match[1];
        let newlyAdded = false;
        
        neededObjects.forEach(obj => {
          if (!importedItems.includes(obj)) {
            importedItems += `, ${obj}`;
            newlyAdded = true;
          }
        });
        
        if (newlyAdded) {
          const newImport = `import {${importedItems}} from '../../content/authOnboardingContent';`;
          content = content.replace(importRegex, newImport);
          modified = true;
        }
      } else {
        // Find last import
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
          const endOfLine = content.indexOf('\n', lastImportIndex);
          content = content.slice(0, endOfLine + 1) + `import {${neededObjects.join(', ')}} from '../../content/authOnboardingContent';\n` + content.slice(endOfLine + 1);
          modified = true;
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated imports in ${file}`);
      totalModifications++;
    }
  });

  console.log(`\nSuccessfully modified ${totalModifications} files.`);
}

processImports();
