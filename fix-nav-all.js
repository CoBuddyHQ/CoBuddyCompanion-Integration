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

  // Fix: (navigation as any).navigate('XxxTab', { screen: ... })
  content = content.replace(/\(navigation\s+as\s+any\)\.navigate\('([a-zA-Z]+Tab)',\s*\{\s*screen:\s*([^,}]+)(,\s*params:\s*\{[^}]+\})?\s*\}\)/g, (match, tab, screen, params) => {
    return `(navigation as any).navigate('MainApp', { screen: '${tab}', params: { screen: ${screen}${params || ''} } })`;
  });

  // Fix: navigation.getParent()?.navigate('XxxTab' as any, { screen: ... })
  content = content.replace(/navigation\.getParent\(\)\?\.navigate\('([a-zA-Z]+Tab)'\s*as\s*any,\s*\{\s*screen:\s*([^,}]+)(,\s*params:\s*\{[^}]+\})?\s*\}\)/g, (match, tab, screen, params) => {
    return `(navigation as any).navigate('MainApp', { screen: '${tab}', params: { screen: ${screen}${params || ''} } })`;
  });

  // Fix: navigation.navigate('XxxTab', { screen: ... })
  content = content.replace(/navigation\.navigate\('([a-zA-Z]+Tab)',\s*\{\s*screen:\s*([^,}]+)(,\s*params:\s*\{[^}]+\})?\s*\}\)/g, (match, tab, screen, params) => {
    return `navigation.navigate('MainApp', { screen: '${tab}', params: { screen: ${screen}${params || ''} } })`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Fixed ${fullPath}`);
    totalFixed++;
  }
});

console.log(`Total files fixed: ${totalFixed}`);
