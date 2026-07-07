const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedFiles = 0;

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    if (content.match(/\.toLocale(Date|Time)String\(\s*['"]en-(IN|GB)['"]/)) {
      
      content = content.replace(/\.toLocale(Date|Time)String\(\s*['"]en-(IN|GB)['"]/g, '.toLocale$1String(i18next.language || \'en-$2\'');
      
      if (!content.includes('import i18next')) {
        const importRegex = /^import .* from .*;/gm;
        let match;
        let lastMatchIndex = 0;
        while ((match = importRegex.exec(content)) !== null) {
          lastMatchIndex = match.index + match[0].length;
        }
        
        if (lastMatchIndex > 0) {
          content = content.slice(0, lastMatchIndex) + "\nimport i18next from 'i18next';" + content.slice(lastMatchIndex);
        } else {
          content = "import i18next from 'i18next';\n" + content;
        }
      }
      
      fs.writeFileSync(filePath, content);
      modifiedFiles++;
      console.log(`Updated ${filePath}`);
    }
  }
});

console.log(`\nTotal files modified: ${modifiedFiles}`);
