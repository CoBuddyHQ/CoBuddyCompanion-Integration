const fs = require('fs');
const path = require('path');

const rootNavPath = path.join(__dirname, 'src', 'navigation', 'RootNavigator.tsx');
let content = fs.readFileSync(rootNavPath, 'utf8');

const importStatement = "import {TodayOverviewScreen} from '../screens/dashboard/TodayOverviewScreen';\n";

if (!content.includes('TodayOverviewScreen')) {
  // It is in the file but not imported
}

if (!content.includes(importStatement)) {
  const lastImportIndex = content.lastIndexOf('import');
  const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
  content = content.slice(0, insertIndex) + importStatement + content.slice(insertIndex);
  fs.writeFileSync(rootNavPath, content, 'utf8');
  console.log('Added missing import for TodayOverviewScreen');
}
