const fs = require('fs');

function fixNav(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/navigation\.navigate\('ProfileTab'/g, `(navigation as any).navigate('ProfileTab'`);
  content = content.replace(/navigation\.navigate\('SessionsTab'/g, `(navigation as any).navigate('SessionsTab'`);
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}
fixNav('src/screens/profile/CompanionProfileScreen.tsx');
fixNav('src/screens/sessions/SessionDetailScreen.tsx');
