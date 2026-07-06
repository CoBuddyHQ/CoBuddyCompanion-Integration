const fs = require('fs');
const path = require('path');
const glob = require('glob');

const srcPath = path.join(__dirname, '../src/screens');
const allFiles = glob.sync(path.join(srcPath, '**/*.tsx'));

let unhardenedFiles = [];

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const basename = path.basename(file);
  const relPath = path.relative(srcPath, file);
  
  // A file is hardened if it has "const { t } = useTranslation();" inside
  // Note: we can also check for "i18n.t" if we want to be strict, but the presence of useTranslation means we processed it.
  // Actually, let's say a file is unhardened if it LACKS `useTranslation` or STILL HAS `i18n.t` fallback (outside of useTranslation setup)
  // Let's check for useTranslation
  const hasUseTranslation = content.includes('useTranslation()');
  const hasI18nT = content.includes('i18n.t(');
  
  // Also check if it has hardcoded text heuristically just to know if it's completely untouched
  const hardcodedMatch = content.match(/>[ \n\t]*([A-Za-z0-9][^<]*?)[ \n\t]*<\//g);
  const hasHardcodedText = hardcodedMatch && hardcodedMatch.some(m => !m.includes('{t(') && !m.includes('{i18n.t('));

  if (!hasUseTranslation || hasI18nT || hasHardcodedText) {
     unhardenedFiles.push({
       path: relPath,
       hasUseTranslation,
       hasI18nT,
       hasHardcodedText: !!hasHardcodedText
     });
  }
}

console.log(JSON.stringify({
  totalScanned: allFiles.length,
  unhardenedCount: unhardenedFiles.length,
  files: unhardenedFiles
}, null, 2));
