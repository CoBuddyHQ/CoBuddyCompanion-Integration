const fs = require('fs');
const lines = fs.readFileSync('keys_dump.txt', 'utf8').split('\n');
lines.forEach(l => {
  if (l.includes(': n') || l.includes(': \'n\'') || l.includes(': "n"') || l.includes('n}')) {
    console.log(l);
  }
});
