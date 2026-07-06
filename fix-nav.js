const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/screens/profile/CompanionProfileScreen.tsx',
  'src/screens/requests/BookingAcceptedSuccessScreen.tsx',
  'src/screens/safety/SOSConfirmationScreen.tsx',
  'src/screens/sessions/CancellationReviewPendingScreen.tsx',
  'src/screens/sessions/CustomerRatingFeedbackScreen.tsx',
  'src/screens/sessions/SessionCompleteScreen.tsx',
  'src/screens/sessions/SessionDetailScreen.tsx',
  'src/screens/sessions/UpcomingSessionsScreen.tsx',
];

filesToFix.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // Fix: (navigation as any).navigate('XxxTab', { screen: ... })
  // To: navigation.navigate('MainApp', { screen: 'XxxTab', params: { screen: ... } })
  content = content.replace(/\(navigation\s+as\s+any\)\.navigate\('([a-zA-Z]+Tab)',\s*\{\s*screen:\s*([^,}]+)(,\s*params:\s*\{[^}]+\})?\s*\}\)/g, (match, tab, screen, params) => {
    return `(navigation as any).navigate('MainApp', { screen: '${tab}', params: { screen: ${screen}${params || ''} } })`;
  });

  // Fix: navigation.getParent()?.navigate('XxxTab' as any, { screen: ... })
  // To: navigation.navigate('MainApp', { screen: 'XxxTab', params: { screen: ... } })
  content = content.replace(/navigation\.getParent\(\)\?\.navigate\('([a-zA-Z]+Tab)'\s*as\s*any,\s*\{\s*screen:\s*([^,}]+)(,\s*params:\s*\{[^}]+\})?\s*\}\)/g, (match, tab, screen, params) => {
    return `(navigation as any).navigate('MainApp', { screen: '${tab}', params: { screen: ${screen}${params || ''} } })`;
  });

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Fixed ${file}`);
});
