const fs = require('fs');
function search(dir) {
  const files = fs.readdirSync(dir);
  for (let file of files) {
    file = require('path').join(dir, file);
    if (fs.statSync(file).isDirectory()) {
      search(file);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes(".split('')") || content.includes('.split("")')) {
        console.log(file);
      }
    }
  }
}
search('src');
