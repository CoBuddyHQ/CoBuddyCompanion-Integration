const fs = require('fs');
const { execSync } = require('child_process');

console.log('Running ESLint to find unused i18n imports...');
try {
  execSync('npx eslint src --ext .ts,.tsx --rule "@typescript-eslint/no-unused-vars: 2" --format json > eslint-report.json');
} catch (e) {
  // eslint exits with 1 if there are errors, which is expected
}

const report = JSON.parse(fs.readFileSync('eslint-report.json', 'utf8'));

let filesToProcess = [];

for (const result of report) {
  const filePath = result.filePath;
  const messages = result.messages;
  let linesToRemove = [];

  for (const msg of messages) {
    if (msg.ruleId === '@typescript-eslint/no-unused-vars') {
      if (msg.message.includes("'i18next' is defined but never used") || 
          msg.message.includes("'useTranslation' is defined but never used")) {
        linesToRemove.push(msg.line);
      }
    }
  }

  if (linesToRemove.length > 0) {
    filesToProcess.push({ filePath, linesToRemove: [...new Set(linesToRemove)].sort((a,b)=>b-a) });
  }
}

console.log(`Found ${filesToProcess.length} files with unused i18n imports.`);

let successCount = 0;

for (const item of filesToProcess) {
  const { filePath, linesToRemove } = item;
  console.log(`\nProcessing ${filePath}...`);
  const originalContent = fs.readFileSync(filePath, 'utf8');
  let lines = originalContent.split('\n');

  linesToRemove.forEach(lineNum => {
    let idx = lineNum - 1;
    let lineStr = lines[idx];
    if (lineStr.includes('i18next') || lineStr.includes('useTranslation')) {
      console.log(`- Modifying line ${lineNum}: ${lineStr.trim()}`);
      // Remove specific import patterns
      let newStr = lineStr
        .replace(/import i18next from ['"]i18next['"];?\s*/g, '')
        .replace(/import\s*\{\s*useTranslation\s*\}\s*from\s*['"]react-i18next['"];?\s*/g, '');
      lines[idx] = newStr;
    }
  });

  fs.writeFileSync(filePath, lines.join('\n'));
  
  // Run tsc
  console.log(`Running tsc for verification...`);
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log(`✅ tsc passed. Kept changes for ${filePath}`);
    successCount++;
  } catch (err) {
    console.error(`❌ tsc failed after modifying ${filePath}! Reverting.`);
    fs.writeFileSync(filePath, originalContent); // revert
  }
}

console.log(`\nCleanup complete. Successfully processed ${successCount} files.`);
