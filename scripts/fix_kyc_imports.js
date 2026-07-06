const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../src/screens/application');

function processImports() {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.tsx'));
  let totalModifications = 0;

  files.forEach(file => {
    const filePath = path.join(DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check if CommonKycContent is used but not imported
    if (content.includes('CommonKycContent.') && !content.includes('CommonKycContent,')) {
      const importRegex = /import\s+\{([^}]*)\}\s+from\s+['"]\.\.\/\.\.\/content\/applicationKycContent['"];/;
      const match = content.match(importRegex);
      
      if (match) {
        let importedItems = match[1];
        if (!importedItems.includes('CommonKycContent')) {
          const newImport = `import {CommonKycContent, ${importedItems}} from '../../content/applicationKycContent';`;
          content = content.replace(importRegex, newImport);
          modified = true;
        }
      } else {
        // Find last import
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
          const endOfLine = content.indexOf('\n', lastImportIndex);
          content = content.slice(0, endOfLine + 1) + `import {CommonKycContent} from '../../content/applicationKycContent';\n` + content.slice(endOfLine + 1);
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
