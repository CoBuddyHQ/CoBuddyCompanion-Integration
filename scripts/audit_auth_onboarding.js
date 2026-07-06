const fs = require('fs');
const path = require('path');
const glob = require('glob');

const dirs = ['auth', 'onboarding'];
const srcPath = path.join(__dirname, '../src/screens');

let report = {
  totalFiles: 0,
  filesWithI18nT: [],
  filesWithUseTranslation: [],
  filesWithAuthStore: [],
  filesWithOnboardingStore: [],
  filesWithHardcodedText: []
};

for (const dir of dirs) {
  const files = glob.sync(path.join(srcPath, dir, '**/*.tsx'));
  for (const file of files) {
    report.totalFiles++;
    const content = fs.readFileSync(file, 'utf8');
    const basename = path.basename(file);
    
    if (content.includes('i18n.t(')) {
      report.filesWithI18nT.push(basename);
    }
    if (content.includes('useTranslation')) {
      report.filesWithUseTranslation.push(basename);
    }
    if (content.includes('useAuthStore')) {
      report.filesWithAuthStore.push(basename);
    }
    if (content.includes('useOnboardingStore')) {
      report.filesWithOnboardingStore.push(basename);
    }
    
    // Simple heuristic for hardcoded text in JSX: > Text <
    // Real check might be more complex, but let's see if there are any Text nodes without t()
    // E.g. <Text>Some hardcoded text</Text>
    const hardcodedMatch = content.match(/>[ \n\t]*([A-Za-z0-9][^<]*?)[ \n\t]*<\//g);
    if (hardcodedMatch && hardcodedMatch.some(m => !m.includes('{t(') && !m.includes('{i18n.t('))) {
      report.filesWithHardcodedText.push(basename);
    }
  }
}

console.log(JSON.stringify(report, null, 2));
