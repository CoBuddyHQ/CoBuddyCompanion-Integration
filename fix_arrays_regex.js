const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/screens/auth/BiometricSetupScreen.tsx',
  'src/screens/auth/CreatePINScreen.tsx',
  'src/screens/auth/LocationPermissionScreen.tsx',
  'src/screens/auth/NotificationPermissionScreen.tsx',
  'src/screens/auth/OTPVerificationScreen.tsx',
  'src/screens/onboarding/CompanionWelcomeScreen.tsx',
  'src/screens/onboarding/RoleConfirmationScreen.tsx',
  'src/screens/onboarding/TermsConsentScreen.tsx'
];

targetFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find top level arrays: const [A-Z_]+ = [ ... ];
  // Since it can be multi-line, we match from "const [A-Z_]+ = [" until the matching "];"
  const arrayRegex = /(const\s+[A-Z_]+\s*=\s*\[[\s\S]*?\];)/g;
  
  let arraysToMove = [];
  content = content.replace(arrayRegex, (match, p1, offset) => {
    // Check if it's before the component
    // A simple heuristic: if it's before the word "const [A-Za-z]+Screen"
    if (offset < content.indexOf('Screen: React.FC') || offset < content.indexOf('Screen = ()')) {
      if (match.includes('t("content') || match.includes("t('content")) {
        arraysToMove.push(match);
        return ''; // Remove from top level
      }
    }
    return match;
  });

  if (arraysToMove.length > 0) {
    // Insert them at the top of the component
    const componentRegex = /(const\s+[A-Za-z]+Screen\s*(?::\s*React\.FC(?:<[^>]+>)?\s*)?=\s*(?:\([^)]*\)\s*)?=>\s*\{)/;
    content = content.replace(componentRegex, (match) => {
      return match + '\n  ' + arraysToMove.join('\n  ') + '\n';
    });
    fs.writeFileSync(file, content, 'utf8');
    console.log('Moved arrays in', file);
  }
});
