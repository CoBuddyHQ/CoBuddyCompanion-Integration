const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, '../src/screens'), function(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix 1: Remove duplicate `const { t } = useTranslation();` lines completely except the first one in a block.
  // Actually, we can just replace all occurrences of `const { t } = useTranslation();` with empty string,
  // then inject exactly ONE occurrence right after `export function X() {` or `const X = () => {`.
  
  // A safer regex replacement:
  // Match `const { t } = useTranslation();` with optional whitespace/newlines
  const tRegex = /\s*const\s*\{\s*t\s*\}\s*=\s*useTranslation\(\)\s*;/g;
  
  const matches = content.match(tRegex);
  if (matches && matches.length > 1) {
    // There are multiple. 
    // We can just keep the first one and remove the rest?
    // Actually, finding the first occurrence is easy:
    let first = true;
    content = content.replace(tRegex, (match) => {
      if (first) {
        first = false;
        return match; // keep first
      }
      return ''; // remove rest
    });
  }

  // Fix 2: Check for `Cannot find name 't'` 
  // If ` t(` or ` t (` or `{t(` or `{t (` exists, but `const { t } = useTranslation();` does not exist in the file
  if (content.match(/\bt\s*\(/)) {
    if (!content.includes('const { t } = useTranslation();')) {
      // Need to inject it. We find the main component declaration
      content = content.replace(/((?:export\s+)?(?:default\s+)?(?:function|const)\s+[A-Z][a-zA-Z0-9_]*\s*(?:=\s*(?:async\s+)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>\s*\{|\([^)]*\)\s*(?::\s*[^\{]+)?\s*\{))/g, '$1\n  const { t } = useTranslation();\n');
    }
    
    // Also ensure import exists
    if (!content.includes('import { useTranslation }')) {
        content = `import { useTranslation } from 'react-i18next';\n` + content;
    }
  }
  
  // Replace `i18n.t(` if i18n is not imported?
  if (content.includes('i18n.t(') && !content.includes('import i18n')) {
      // Figure out depth for import
      const depth = filePath.split('src/screens/')[1].split('/').length;
      const relPath = depth === 1 ? '../../i18n' : '../../../i18n';
      content = `import i18n from '${relPath}';\n` + content;
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed regex:', path.basename(filePath));
  }
});
