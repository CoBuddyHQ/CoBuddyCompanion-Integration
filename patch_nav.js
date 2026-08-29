const fs = require('fs');
let txt = fs.readFileSync('src/types/navigation.types.ts', 'utf8');
txt = txt.replace(/\[Routes\.AVAILABILITY_CONFLICT\]:\s*\{[^\}]*\}/g, '[Routes.AVAILABILITY_CONFLICT]: { sessionId?: string; sessionTitle?: string; sessionTime?: string; sessionVenue?: string }');
fs.writeFileSync('src/types/navigation.types.ts', txt, { encoding: 'utf8' });
