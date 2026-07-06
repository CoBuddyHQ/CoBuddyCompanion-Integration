const fs = require('fs');
const path = require('path');

const rootNavPath = path.join(__dirname, 'src', 'navigation', 'RootNavigator.tsx');
let content = fs.readFileSync(rootNavPath, 'utf8');

// The block we added
const addedBlockStart = '{/* ── Screens added to fix global stack back behavior ── */}';
if (content.includes(addedBlockStart)) {
  const parts = content.split(addedBlockStart);
  let injectedScreens = parts[1];
  
  // Replace name={Routes.XXX} with name={Routes.XXX as any}
  // Replace component={XxxScreen} with component={XxxScreen as any}
  injectedScreens = injectedScreens.replace(/name=\{Routes\.([A-Z0-9_]+)\}/g, 'name={Routes.$1 as any}');
  injectedScreens = injectedScreens.replace(/component=\{([A-Za-z0-9_]+)\}/g, 'component={$1 as any}');
  
  content = parts[0] + addedBlockStart + injectedScreens;
  fs.writeFileSync(rootNavPath, content, 'utf8');
  console.log('Fixed TS errors in RootNavigator.tsx');
}
