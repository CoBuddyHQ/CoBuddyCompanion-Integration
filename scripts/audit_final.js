const fs = require('fs');
const path = require('path');
const glob = require('glob');

const srcPath = path.join(__dirname, '../src/screens');
const allFiles = glob.sync(path.join(srcPath, '**/*.tsx'));

let untouchedFiles = []; // Missing useTranslation entirely
let vulnerableFiles = []; // Contains i18n.t( inside

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(srcPath, file);
  
  const hasUseTranslation = content.includes('useTranslation');
  const hasI18nT = content.includes('i18n.t(');

  if (!hasUseTranslation) {
    untouchedFiles.push(relPath);
  } else if (hasI18nT) {
    vulnerableFiles.push(relPath);
  }
}

console.log(JSON.stringify({
  totalScanned: allFiles.length,
  untouchedCount: untouchedFiles.length,
  vulnerableCount: vulnerableFiles.length,
  untouched: untouchedFiles,
  vulnerable: vulnerableFiles
}, null, 2));
