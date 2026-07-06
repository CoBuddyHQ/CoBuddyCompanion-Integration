const fs = require('fs');
const path = require('path');

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
        if (line.includes('key={n}')) {
           console.log(`Found key={n} in ${file}:${i+1}`);
        } else if (line.match(/key=\{['"]n['"]\}/)) {
           console.log(`Found key='n' in ${file}:${i+1}`);
        } else if (line.match(/key=\{[a-zA-Z]+\.n\}/)) {
           console.log(`Found key={obj.n} in ${file}:${i+1}`);
        }
      });
    }
  }
}
search('src');
