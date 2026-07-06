const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/screens/requests/BookingRequestsInboxScreen.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Replace all i18n.t( with t(
content = content.split('i18n.t(').join('t(');

// 2. ActiveRequestCard
content = content.split('const ActiveRequestCard: React.FC<any> = ({ request, onAccept, onReject }) => {')
                 .join('const ActiveRequestCard: React.FC<any> = ({ request, onAccept, onReject }) => {\\n  const { t } = useTranslation();');

// 3. EmptyState
content = content.split('const EmptyState: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => (')
                 .join('const EmptyState: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => {\\n  const { t } = useTranslation();\\n  return (');

content = content.split('      <Text style={styles.emptyBtnPrimaryText}>Go Live for Instant Bookings</Text>\\n    </TouchableOpacity>\\n  </View>\\n);')
                 .join('      <Text style={styles.emptyBtnPrimaryText}>Go Live for Instant Bookings</Text>\\n    </TouchableOpacity>\\n  </View>\\n  );\\n};');

// 4. LiveNotificationBanner
content = content.split('const LiveNotificationBanner: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => (')
                 .join('const LiveNotificationBanner: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => {\\n  const { t } = useTranslation();\\n  return (');

content = content.split('        <Text style={styles.liveBannerBtnText}>Go Live</Text>\\n      </TouchableOpacity>\\n    </View>\\n  </View>\\n);')
                 .join('        <Text style={styles.liveBannerBtnText}>Go Live</Text>\\n      </TouchableOpacity>\\n    </View>\\n  </View>\\n  );\\n};');

fs.writeFileSync(file, content.replace(/\\\\n/g, '\\n'), 'utf8');
console.log('Fixed BookingRequestsInboxScreen perfectly.');
