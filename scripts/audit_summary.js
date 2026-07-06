const fs = require('fs');
const path = require('path');
const glob = require('glob');

const srcPath = path.join(__dirname, '../src/screens');
const allFiles = glob.sync(path.join(srcPath, '**/*.tsx'));

let folderStats = {};
let untouchedTotal = 0;

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(srcPath, file);
  const folder = relPath.split(path.sep)[0];
  
  // Untouched if it does NOT contain 'useTranslation'
  const hasUseTranslation = content.includes('useTranslation');

  if (!hasUseTranslation) {
     untouchedTotal++;
     if (!folderStats[folder]) {
         folderStats[folder] = { count: 0, files: [] };
     }
     folderStats[folder].count++;
     folderStats[folder].files.push(path.basename(file));
  }
}

console.log(JSON.stringify({
  totalScanned: allFiles.length,
  untouchedCount: untouchedTotal,
  folders: folderStats
}, null, 2));
