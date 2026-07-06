const fs = require('fs');

function fixNav(file, tabName) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/navigation\.navigate\((Routes\.[A-Z_]+)\)/g, `navigation.navigate('${tabName}', { screen: $1 })`);
  content = content.replace(/navigation\.navigate\((Routes\.[A-Z_]+),\s*(\{.*?\})\)/gs, `navigation.navigate('${tabName}', { screen: $1, params: $2 })`);
  
  // also handle dynamic routes in maps like item.route
  content = content.replace(/navigation\.navigate\((item\.route)\)/g, `navigation.navigate('${tabName}', { screen: $1 })`);
  
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}
fixNav('src/screens/profile/CompanionProfileScreen.tsx', 'ProfileTab');
fixNav('src/screens/sessions/SessionDetailScreen.tsx', 'SessionsTab');
