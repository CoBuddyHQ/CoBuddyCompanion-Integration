const fs = require('fs');

const filesToFix = [
  'src/screens/availability/AvailabilityCalendarScreen.tsx',
  'src/screens/dashboard/NotificationCenterScreen.tsx',
  'src/screens/earnings/EarningsDashboardScreen.tsx',
  'src/screens/profile/BadgesAchievementsScreen.tsx',
  'src/screens/sessions/InSessionChatScreen.tsx',
  'src/screens/settings/NotificationPreferencesScreen.tsx',
  'src/screens/settings/PolicyCenterScreen.tsx'
];

filesToFix.forEach(file => {
  let code = fs.readFileSync(file, 'utf-8');
  
  // 1. Add import if missing
  if (!code.includes("useTranslation")) {
    code = `import { useTranslation } from 'react-i18next';\n` + code;
  }
  
  // 2. Add const { t } = useTranslation(); inside the component
  // We look for export function ScreenName() { or export const ScreenName = () => {
  if (!code.includes("const { t } = useTranslation();")) {
    // Find the export declaration
    code = code.replace(/(export (?:default )?function \w+\([^\)]*\)\s*(?::\s*[^\{]+)?\s*\{|export const \w+\s*=\s*\([^\)]*\)\s*(?::\s*[^=>]+)?\s*=>\s*\{)/, "$1\n  const { t } = useTranslation();");
  }
  
  fs.writeFileSync(file, code);
  console.log('Fixed ' + file);
});
