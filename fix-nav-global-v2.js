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

  // We want to match:
  // (navigation as any).navigate('MainApp', { screen: 'SessionsTab', params: { screen: Routes.IN_SESSION_CHAT, params: { sessionId } } })
  // and replace with:
  // (navigation as any).navigate(Routes.IN_SESSION_CHAT, { sessionId })
  
  // We can use a simpler approach. We know the exact string pattern.
  // match[1] = "navigation" or "(navigation as any)"
  // match[2] = Routes.XXX
  // match[3] = the params object (e.g. { sessionId }) if it exists, otherwise undefined.
  
  // Regex to match the outer navigate call and capture the inner screen and params.
  const regex = /(\(navigation\s+as\s+any\)|navigation)\.navigate\('MainApp',\s*\{\s*screen:\s*'[^']+',\s*params:\s*\{\s*screen:\s*(Routes\.[A-Z_0-9]+)(?:,\s*params:\s*(\{.*?\}))?\s*\}\s*\}\)/g;
  
  content = content.replace(regex, (match, navObj, routeName, paramsObj) => {
    if (paramsObj) {
      return `${navObj}.navigate(${routeName}, ${paramsObj})`;
    } else {
      return `${navObj}.navigate(${routeName})`;
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Reverted cross-tab to global in ${fullPath}`);
    totalFixed++;
  }
});

console.log(`Total files modified: ${totalFixed}`);
