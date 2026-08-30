const fs = require('fs');
let c = fs.readFileSync('src/screens/requests/BookingRequestsFilterScreen.tsx', 'utf8');

c = c.replace(/import React, \{ useState \} from 'react';/, 'import { AdminConfig } from \'../../config/adminValues\';\nimport React, { useState } from \'react\';');

c = c.replace(/const EXPERIENCE_CATEGORIES = \[.*?\] as any\[\];/s, `const EXPERIENCE_CATEGORIES = Object.entries(AdminConfig.categoryDetails).map(([id, details]) => ({
  id,
  label: details.label,
  icon: details.icon
}));`);

c = c.replace(/\{t\(cat\.label\)\}/g, '{cat.label}');

fs.writeFileSync('src/screens/requests/BookingRequestsFilterScreen.tsx', c, 'utf8');
console.log('Patched Filter Screen');
