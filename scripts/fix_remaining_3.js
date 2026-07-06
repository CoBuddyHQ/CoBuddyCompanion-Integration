const fs = require('fs');

function processFile(filePath, componentNames) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace i18n.t( with t(
  content = content.replace(/i18n\.t\(/g, 't(');

  for (const name of componentNames) {
    // 1. If it's an arrow function with implicit return `=> (`
    const regexImplicit = new RegExp(`const\\s+${name}\\s*(:\\s*React\\.FC<[^>]+>)?\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\(`, 'g');
    if (regexImplicit.test(content)) {
      content = content.replace(regexImplicit, (match) => {
        return match.replace('=> (', '=> {\\n  const { t } = useTranslation();\\n  return (');
      });
      // Now we have to fix the closing `);` of this implicit return to be `);\\n};`.
      // We will look for the end of this component block. Since it's hard with regex, we can just look for `\\n);` if we know it's at the end.
      // Or we can just find where it ends and replace it. Let's do string replacement for the exact end of these known components.
      if (name === 'EmptyState' && filePath.includes('BookingRequestsInboxScreen')) {
        content = content.replace(
          /<\/TouchableOpacity>\s*<\/View>\s*\);/g,
          '</TouchableOpacity>\\n  </View>\\n  );\\n};'
        );
      }
      if (name === 'EmptyState' && filePath.includes('UpcomingSessionsScreen')) {
        content = content.replace(
          /<\/TouchableOpacity>\s*<\/View>\s*\);/g,
          '</TouchableOpacity>\\n  </View>\\n  );\\n};'
        );
      }
      if (name === 'SectionRow' && filePath.includes('ProfileCompletionChecklistScreen')) {
        content = content.replace(
          /<\/TouchableOpacity>\s*\);/g,
          '</TouchableOpacity>\\n  );\\n};'
        );
      }
    }

    // 2. If it's an arrow function with explicit return `=> {`
    const regexExplicit = new RegExp(`const\\s+${name}\\s*(:\\s*React\\.FC<[^>]+>)?\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\{`, 'g');
    if (regexExplicit.test(content)) {
      content = content.replace(regexExplicit, (match) => {
        return match + '\\n  const { t } = useTranslation();';
      });
    }
  }

  fs.writeFileSync(filePath, content.replace(/\\\\n/g, '\\n'), 'utf8');
}

try {
  processFile('src/screens/requests/BookingRequestsInboxScreen.tsx', ['RequestCard', 'EmptyState', 'LiveNotificationBanner']);
  processFile('src/screens/sessions/UpcomingSessionsScreen.tsx', ['SessionCard', 'EmptyState']);
  processFile('src/screens/application/ProfileCompletionChecklistScreen.tsx', ['SectionRow']);
  console.log('Fixed exactly using Regex');
} catch (e) {
  console.error(e);
}
