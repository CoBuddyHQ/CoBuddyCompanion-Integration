const fs = require('fs');
const path = require('path');
const glob = require('glob');

const srcPath = path.join(__dirname, '../src/screens');
const allFiles = glob.sync(path.join(srcPath, '**/*.tsx'));

let modifiedCount = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('i18n.t(')) {
    content = content.replace(/i18n\.t\(/g, 't(');
    
    // Add simple retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        break; // Success
      } catch (err) {
        retries--;
        if (retries === 0) console.error('Failed to write', file, err);
        else {
            // sleep
            const start = Date.now();
            while(Date.now() - start < 100) {}
        }
      }
    }
  }
}
console.log(`Replaced i18n.t( in ${modifiedCount} files.`);
