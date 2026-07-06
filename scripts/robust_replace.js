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
    
    // Save to temp file
    const tempFile = file + '.tmp';
    fs.writeFileSync(tempFile, content, 'utf8');
    
    // Attempt to rename/replace
    try {
        fs.renameSync(tempFile, file);
        modifiedCount++;
        console.log('Replaced in:', path.basename(file));
    } catch (e) {
        // If rename fails, try unlinking first
        try {
            fs.unlinkSync(file);
            fs.renameSync(tempFile, file);
            modifiedCount++;
            console.log('Replaced in (force):', path.basename(file));
        } catch (e2) {
            console.error('Totally failed on', file, e2);
        }
    }
  }
}
console.log(`Replaced in ${modifiedCount} files.`);
