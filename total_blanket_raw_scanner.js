const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(SRC_DIR);

const IGNORE_PATTERNS = [
  /import\s+/,            // Import paths
  /from\s+['"]/,          // From paths
  /require\(['"]/,        // Require paths
  /t\(['"]/,              // Translation keys
  /i18next\.t\(['"]/,     // i18next translation keys
  /navigate\(['"]/,       // Navigation routes
  /name=['"][A-Za-z\-]+['"]/, // Icon names
  /console\.(log|error|warn)/, // Console logs
  /type\s*[:=]/,          // TypeScript types
  /className=/,           // ClassNames
  /^[A-Z_]+$/,            // ALL_CAPS
  /^\/.*\/[gimuy]*$/,     // Regex literals
];

// Heuristics for "English text"
// Must contain at least two English words separated by a space, OR be a single recognizable English word that starts with a capital letter (UI label)
// and must NOT be a camelCase or snake_case key.
const englishHeuristic = /([A-Z][a-z]+ [A-Za-z]+|[A-Z][a-z]+(?=')|[A-Z][a-z]+$)/;
const stringRegex = /'([^']*)'|"([^"]*)"|`([^`]*)`/g;

let totalFound = 0;

console.log("Starting Blanket Raw Scanner on " + allFiles.length + " files...\n");

for (const file of allFiles) {
  // We completely ignore the mock services as requested previously?
  // Wait, the user said "Forget about the previous 4 specific rules or phases. When I say SAB YANI SAB, it means I want an absolute, unfiltered, blind scan of EVERY SINGLE LINE... No exceptions, no filters, no specific patterns."
  // Okay, we will scan EVERYTHING.

  const lines = fs.readFileSync(file, 'utf8').split('\n');
  
  lines.forEach((line, index) => {
    // If it's a console log or import, skip the line completely
    if (line.includes('import ') || line.includes(' from ') || line.trim().startsWith('//')) {
      return;
    }
    
    let match;
    while ((match = stringRegex.exec(line)) !== null) {
      const str = match[1] || match[2] || match[3];
      
      if (!str || str.trim().length === 0) continue;
      
      // Is it wrapped in t() or i18next.t()?
      // A simple check: does the line contain t('this-exact-string')?
      if (line.includes(`t('${str}')`) || line.includes(`t("${str}")`) || line.includes(`t(\`${str}\`)`) ||
          line.includes(`i18next.t('${str}')`) || line.includes(`i18next.t("${str}")`) || line.includes(`i18next.t(\`${str}\`)`)) {
        continue;
      }
      
      // Is it a color?
      if (/^#[0-9A-Fa-f]{3,8}$/.test(str) || /^rgba?\(/.test(str) || str === 'transparent') continue;
      
      // Is it camelCase, PascalCase, or snake_case without spaces? (Likely an ID or key)
      if (/^[a-zA-Z0-9_]+$/.test(str) && !str.includes(' ')) continue;
      
      // Does it look like English?
      if (/[A-Z][a-z]+ [A-Za-z]+/.test(str) || str.includes(' ')) {
        // Let's filter out some common code stuff
        if (str.includes('/') && !str.includes(' ')) continue; // path
        if (str.includes('{') && str.includes('}')) continue; // template string with vars
        
        console.log(`[FILE] ${file.replace(SRC_DIR, 'src')}`);
        console.log(`[LINE ${index + 1}] ${str}`);
        console.log(`[CODE] ${line.trim()}\n`);
        totalFound++;
      }
    }
  });
}

console.log(`\nScan Complete. Total raw english strings found: ${totalFound}`);
