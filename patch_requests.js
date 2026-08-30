const fs = require('fs');
const path = require('path');

const files = [
  'src/screens/requests/BookingAcceptConfirmationScreen.tsx',
  'src/screens/requests/BookingRequestsInboxScreen.tsx',
  'src/screens/requests/ExpiredBookingRequestScreen.tsx',
  'src/screens/requests/NewBookingRequestDetailScreen.tsx'
];

for (const f of files) {
  const fp = path.resolve(__dirname, f);
  let content = fs.readFileSync(fp, 'utf8');

  // Replace categoryLabel
  const regex = /function categoryLabel\s*\(\s*cat:\s*string\s*\):\s*string\s*\{\s*const map:\s*Record<string,\s*string>\s*=\s*\{[\s\S]*?\};\s*return map\[cat\] \?\? cat\.replace\(\/_.*?\);\s*\}/g;
  content = content.replace(regex, `function categoryLabel(cat: string): string {\n  return AdminConfig.categoryDetails[cat]?.label ?? cat;\n}`);

  // Insert import if missing
  if (!content.includes('import { AdminConfig }')) {
    content = content.replace(/import \{ colors \} from '..\/..\/theme\/colors';/, 'import { AdminConfig } from \'../../config/adminValues\';\nimport { colors } from \'../../theme/colors\';');
  }

  fs.writeFileSync(fp, content, 'utf8');
  console.log('Patched', f);
}
