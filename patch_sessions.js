const fs = require('fs');
const path = require('path');

const files = [
  'src/screens/sessions/ActiveSessionScreen.tsx',
  'src/screens/sessions/CustomerRatingFeedbackScreen.tsx',
  'src/screens/sessions/DigitalSessionPassScreen.tsx',
  'src/screens/sessions/SessionDetailScreen.tsx',
  'src/screens/sessions/UpcomingSessionsScreen.tsx'
];

for (const f of files) {
  const fp = path.resolve(__dirname, f);
  let content = fs.readFileSync(fp, 'utf8');

  // Replace categoryLabel
  const regex = /function categoryLabel\s*\(\s*cat:\s*string\s*\):\s*string\s*\{\s*const map:\s*Record<string,\s*string>\s*=\s*\{[\s\S]*?\};\s*return map\[cat\] \?\? cat\.replace\(\/_.*?\);\s*\}/g;
  content = content.replace(regex, `function categoryLabel(cat: string): string {\n  return AdminConfig.categoryDetails[cat]?.label ?? cat;\n}`);

  // Insert import if missing
  if (!content.includes('AdminConfig')) {
    content = content.replace(/import.*?['"];?/, match => `${match}\nimport { AdminConfig } from '../../config/adminValues';`);
  }

  fs.writeFileSync(fp, content, 'utf8');
  console.log('Patched', f);
}
