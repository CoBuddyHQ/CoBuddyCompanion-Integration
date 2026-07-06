const fs = require('fs');
const path = require('path');

const files = [
  'src/screens/availability/WeeklyRecurringAvailabilityScreen.tsx',
  'src/screens/earnings/PayoutHistoryScreen.tsx',
  'src/screens/profile/GalleryPhotoManagerScreen.tsx',
  'src/screens/requests/BookingRequestsInboxScreen.tsx',
  'src/screens/reviews/ReviewsDashboardScreen.tsx',
  'src/screens/safety/CompanionSafetyHubScreen.tsx',
  'src/screens/sessions/UpcomingSessionsScreen.tsx',
  'src/screens/settings/NotificationPreferencesScreen.tsx'
];

files.forEach(f => {
  const filePath = path.join(__dirname, '../', f);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the main component signature: export function ScreenName() { ... }
  // or const ScreenName = () => { ... }
  
  // Replace export function XXX() {
  content = content.replace(/(export\s+function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*(?::\s*[^\{]+)?\s*\{)/g, '$1\n  const { t } = useTranslation();\n');
  
  // Replace const XXX = () => {
  content = content.replace(/(const\s+[A-Za-z0-9_]+\s*=\s*(?:async\s+)?\([^)]*\)\s*(?::\s*[^\{]+)?\s*=>\s*\{)/g, '$1\n  const { t } = useTranslation();\n');

  // Some components might have `const renderItem = () => {` which also need it?
  // Let's inject into `renderItem` as well.
  content = content.replace(/(const\s+renderItem\s*=\s*\([^)]*\)\s*=>\s*(?:\(\s*)?<)/g, 'const renderItem = (props: any) => {\n  const { t } = useTranslation();\n  return <');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed manually:', f);
});
