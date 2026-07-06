const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/screens/requests/BookingRequestsInboxScreen.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Replace i18n.t( with t(
content = content.replace(/i18n\.t\(/g, 't(');

// 2. Inject const { t } = useTranslation(); safely into Functional Components

// ActiveRequestCard
content = content.replace(
  'const ActiveRequestCard: React.FC<any> = ({ request, onAccept, onReject }) => {',
  'const ActiveRequestCard: React.FC<any> = ({ request, onAccept, onReject }) => {\n  const { t } = useTranslation();'
);

// EmptyState
content = content.replace(
  'const EmptyState: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => (',
  'const EmptyState: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => {\n  const { t } = useTranslation();\n  return ('
);
// Fix the closing bracket for EmptyState (it was a `);`, change it to `  );\n};`)
// Let's do it by finding the exact block.
content = content.replace(
  '      <Text style={styles.emptyBtnPrimaryText}> {t(\'requests.go_live_for_instant_bookings\')} </Text>\n    </TouchableOpacity>\n  </View>\n);',
  '      <Text style={styles.emptyBtnPrimaryText}> {t(\'requests.go_live_for_instant_bookings\')} </Text>\n    </TouchableOpacity>\n  </View>\n  );\n};'
);

// LiveNotificationBanner
content = content.replace(
  'const LiveNotificationBanner: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => (',
  'const LiveNotificationBanner: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => {\n  const { t } = useTranslation();\n  return ('
);
content = content.replace(
  '        <Text style={styles.liveBannerBtnText}> {t(\'requests.go_live\')} </Text>\n      </TouchableOpacity>\n    </View>\n  </View>\n);',
  '        <Text style={styles.liveBannerBtnText}> {t(\'requests.go_live\')} </Text>\n      </TouchableOpacity>\n    </View>\n  </View>\n  );\n};'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed BookingRequestsInboxScreen');
