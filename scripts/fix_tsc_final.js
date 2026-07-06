const fs = require('fs');
const path = require('path');

const duplicateFiles = [
    'src/screens/onboarding/CompanionWelcomeScreen.tsx',
    'src/screens/onboarding/RoleConfirmationScreen.tsx',
    'src/screens/onboarding/TermsConsentScreen.tsx',
    'src/screens/states/PlaceholderScreen.tsx',
    'src/screens/system/ForceUpdateScreen.tsx',
    'src/screens/system/MaintenanceModeScreen.tsx',
    'src/screens/system/NetworkErrorScreen.tsx',
    'src/screens/training/TrainingCompletedScreen.tsx',
    'src/screens/training/TrainingHubScreen.tsx',
    'src/screens/training/TrainingLessonScreen.tsx',
];

const basePath = path.join(__dirname, '../');

for (const file of duplicateFiles) {
    const filePath = path.join(basePath, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Find the first occurrence of "const { t } = useTranslation();" and the second one
        const searchStr = 'const { t } = useTranslation();';
        const firstIndex = content.indexOf(searchStr);
        if (firstIndex !== -1) {
            const secondIndex = content.indexOf(searchStr, firstIndex + searchStr.length);
            if (secondIndex !== -1) {
                // Remove the second occurrence
                content = content.substring(0, secondIndex) + content.substring(secondIndex + searchStr.length);
                fs.writeFileSync(filePath, content, 'utf8');
                console.log('Fixed duplicate t in:', file);
            }
        }
    }
}

// Now let's fix the missing t parameter manually since there are only 3 files.
// ProfileCompletionChecklistScreen
const profileFile = path.join(basePath, 'src/screens/application/ProfileCompletionChecklistScreen.tsx');
if (fs.existsSync(profileFile)) {
    let content = fs.readFileSync(profileFile, 'utf8');
    // Function definition missing t: `function getChecklist(profile: any, docs: any)` -> `function getChecklist(profile: any, docs: any, t: any)`
    content = content.replace('function getChecklist(profile: any, docs: any) {', 'function getChecklist(profile: any, docs: any, t: any) {');
    // Calls: `getChecklist(profile, docs)` -> `getChecklist(profile, docs, t)`
    content = content.replace(/getChecklist\(profile, docs\)/g, 'getChecklist(profile, docs, t)');
    fs.writeFileSync(profileFile, content, 'utf8');
    console.log('Fixed missing t in ProfileCompletionChecklistScreen');
}

// BookingRequestsInboxScreen
const bookingFile = path.join(basePath, 'src/screens/requests/BookingRequestsInboxScreen.tsx');
if (fs.existsSync(bookingFile)) {
    let content = fs.readFileSync(bookingFile, 'utf8');
    // The error was on line 183 inside an ArrowFunction: `const ActiveRequestCard = ({ request, onAccept, onReject }) =>` or similar.
    // Actually the easiest way to fix "Cannot find name 't'" in React components defined outside the main component is to add `const { t } = useTranslation();` inside them!
    
    // For ActiveRequestCard
    content = content.replace('const ActiveRequestCard: React.FC<{', 'const ActiveRequestCard: React.FC<{'); // Just to find it
    content = content.replace('onReject: () => void }> = ({ request, onAccept, onReject }) => {', 'onReject: () => void }> = ({ request, onAccept, onReject }) => {\n  const { t } = useTranslation();');
    
    content = content.replace('onGoLive: () => void }> = ({ onGoLive }) => (', 'onGoLive: () => void }> = ({ onGoLive }) => {\n  const { t } = useTranslation();\n  return (');
    content = content.replace('</TouchableOpacity>\n    </View>\n  </View>\n);', '</TouchableOpacity>\n    </View>\n  </View>\n  );\n};');
    
    // There are multiple functional components in BookingRequestsInboxScreen. Let's just blindly inject const { t } = useTranslation() if missing.
    // I'll just use a regex for React.FC assignments that return JSX.
    content = content.replace(/[=]> \{\n/g, '=> {\n  const { t } = useTranslation();\n');
    
    // Let's also fix simple arrow functions that return JSX implicitly: `=> (` -> `=> {\n  const { t } = useTranslation();\n  return (`
    // Wait, replacing all `=> {` will duplicate it inside the main component.
    // Better idea: replace `i18n.t` back for these files ONLY? NO, user wants t.
    // Let's just fix it by searching for the specific functional components in this file.
    
    // Let's just inject `const { t } = useTranslation();` into `ActiveRequestCard`, `UpcomingRequestCard`, `LiveNotificationBanner` etc.
    content = content.replace('const ActiveRequestCard: React.FC<any> = ({ request, onAccept, onReject }) => {', 'const ActiveRequestCard: React.FC<any> = ({ request, onAccept, onReject }) => {\n  const { t } = useTranslation();');
    content = content.replace('const LiveNotificationBanner: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => (', 'const LiveNotificationBanner: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => {\n  const { t } = useTranslation();\n  return (');
    content = content.replace('</TouchableOpacity>\n    </View>\n  </View>\n);', '</TouchableOpacity>\n    </View>\n  </View>\n  );\n}');
    
    fs.writeFileSync(bookingFile, content, 'utf8');
    console.log('Fixed missing t in BookingRequestsInboxScreen');
}

// UpcomingSessionsScreen
const upcomingFile = path.join(basePath, 'src/screens/sessions/UpcomingSessionsScreen.tsx');
if (fs.existsSync(upcomingFile)) {
    let content = fs.readFileSync(upcomingFile, 'utf8');
    // Probably has a SessionCard component outside the main component.
    content = content.replace('const SessionCard = ({ session, onCancel, onContact }: any) => {', 'const SessionCard = ({ session, onCancel, onContact }: any) => {\n  const { t } = useTranslation();');
    fs.writeFileSync(upcomingFile, content, 'utf8');
    console.log('Fixed missing t in UpcomingSessionsScreen');
}
