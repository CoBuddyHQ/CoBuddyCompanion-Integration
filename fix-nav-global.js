const fs = require('fs');
const path = require('path');

function findFiles(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, filter, fileList);
    } else if (filter(filePath)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const screensDir = path.join(__dirname, 'src', 'screens');
const filesToFix = findFiles(screensDir, (file) => file.endsWith('.tsx'));

let totalFixed = 0;

filesToFix.forEach(fullPath => {
  let content = fs.readFileSync(fullPath, 'utf8');
  let originalContent = content;

  // Replace: (navigation as any).navigate('MainApp', { screen: 'XxxTab', params: { screen: Routes.XXX, params: ... } })
  // With: navigation.navigate(Routes.XXX, params)
  content = content.replace(/\(navigation\s+as\s+any\)\.navigate\('MainApp',\s*\{\s*screen:\s*'[^']+',\s*params:\s*\{\s*screen:\s*([^,}]+)(?:,\s*params:\s*([^}]+))?\s*\}\s*\}\)/g, (match, screenRoute, params) => {
    if (params) {
      return `(navigation as any).navigate(${screenRoute}, ${params.trim()})`;
    }
    return `(navigation as any).navigate(${screenRoute})`;
  });

  // Replace: navigation.navigate('MainApp', { screen: 'XxxTab', params: { screen: Routes.XXX, params: ... } })
  content = content.replace(/navigation\.navigate\('MainApp',\s*\{\s*screen:\s*'[^']+',\s*params:\s*\{\s*screen:\s*([^,}]+)(?:,\s*params:\s*([^}]+))?\s*\}\s*\}\)/g, (match, screenRoute, params) => {
    if (params) {
      return `navigation.navigate(${screenRoute}, ${params.trim()})`;
    }
    return `navigation.navigate(${screenRoute})`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Reverted cross-tab to global in ${fullPath}`);
    totalFixed++;
  }
});

console.log(`Total files modified: ${totalFixed}`);
