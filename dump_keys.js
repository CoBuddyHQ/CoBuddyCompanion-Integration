const fs = require('fs');
const path = require('path');
let keys = [];
function search(dir) {
  const files = fs.readdirSync(dir);
  for (let file of files) {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) {
      search(file);
    } else if (file.endsWith('.tsx')) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        const match = line.match(/key=\{([^}]+)\}/);
        if (match) keys.push(file + ':' + (i+1) + ': ' + match[1]);
        const strMatch = line.match(/key=(['"][^'"]+['"])/);
        if (strMatch) keys.push(file + ':' + (i+1) + ': ' + strMatch[1]);
      });
    }
  }
}
search('src');
fs.writeFileSync('keys_dump.txt', keys.join('\n'));
console.log('Done');
