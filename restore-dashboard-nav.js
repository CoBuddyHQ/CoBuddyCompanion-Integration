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

  // Restore navigation to HOME_DASHBOARD to pop back to MainApp -> DashboardTab
  content = content.replace(/navigation\.navigate\(Routes\.HOME_DASHBOARD\)/g, () => {
    return `navigation.navigate('MainApp', { screen: 'DashboardTab', params: { screen: Routes.HOME_DASHBOARD } })`;
  });

  content = content.replace(/navigation\.getParent\(\)\?\.navigate\(Routes\.HOME_DASHBOARD\)/g, () => {
    return `navigation.navigate('MainApp', { screen: 'DashboardTab', params: { screen: Routes.HOME_DASHBOARD } })`;
  });
  
  content = content.replace(/navigation\.getParent\(\)\?\.navigate\('DashboardTab'\s*as\s*any,\s*\{\s*screen:\s*Routes\.HOME_DASHBOARD\s*\}\)/g, () => {
    return `navigation.navigate('MainApp', { screen: 'DashboardTab', params: { screen: Routes.HOME_DASHBOARD } })`;
  });

  // Specifically for those that used (navigation as any)
  content = content.replace(/\(navigation\s+as\s+any\)\.navigate\(Routes\.HOME_DASHBOARD\)/g, () => {
    return `(navigation as any).navigate('MainApp', { screen: 'DashboardTab', params: { screen: Routes.HOME_DASHBOARD } })`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Restored HOME_DASHBOARD to MainApp in ${fullPath}`);
    totalFixed++;
  }
});

console.log(`Total files modified: ${totalFixed}`);
