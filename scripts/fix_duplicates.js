const fs = require('fs');
const path = require('path');
const glob = require('glob');

const targetDirs = ['profile', 'settings', 'availability', 'account', 'reviews'];
const srcPath = path.join(__dirname, '../src/screens');

let fixed = 0;
for (const dir of targetDirs) {
  const files = glob.sync(path.join(srcPath, dir, '**/*.tsx'));
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace consecutive duplicates of const { t } = useTranslation();
    // E.g.
    //     const { t } = useTranslation();
    //     const { t } = useTranslation();
    const regex = /(?:[ \t]*const\s+\{\s*t\s*\}\s*=\s*useTranslation\(\);\s*[\r\n]+){2,}/g;
    
    if (regex.test(content)) {
      content = content.replace(regex, (match) => {
        // Find the leading spaces of the first line
        const matchIndentation = match.match(/^[ \t]*/)[0];
        return `${matchIndentation}const { t } = useTranslation();\n`;
      });
      fs.writeFileSync(file, content, 'utf8');
      fixed++;
    }
  }
}
console.log('Fixed duplicates in', fixed, 'files.');
