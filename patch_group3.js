const fs = require('fs');
const path = require('path');

const files = [
  'src/screens/dashboard/HomeDashboardScreen.tsx',
  'src/screens/dashboard/TodayOverviewScreen.tsx',
  'src/screens/profile/CompanionProfileScreen.tsx',
  'src/screens/profile/ReviewDetailScreen.tsx'
];

for (const f of files) {
  const fp = path.resolve(__dirname, f);
  let content = fs.readFileSync(fp, 'utf8');

  // Replace categoryLabel
  const regex = /function categoryLabel\s*\(\s*cat:\s*string\s*\):\s*string\s*\{\s*const map:\s*Record<string,\s*string>\s*=\s*\{[\s\S]*?\};\s*return map\[cat\] \?\? cat\.replace\(\/_.*?\);\s*\}/g;
  content = content.replace(regex, 'function categoryLabel(cat: string): string {\n  return AdminConfig.categoryDetails[cat]?.label ?? cat;\n}');

  // Insert import if missing
  if (!content.includes('import { AdminConfig }')) {
    content = content.replace(/import React/, 'import { AdminConfig } from \'../../config/adminValues\';\nimport React');
  }

  fs.writeFileSync(fp, content, 'utf8');
  console.log('Patched', f);
}
