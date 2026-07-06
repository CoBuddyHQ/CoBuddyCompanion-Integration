const fs = require('fs');

function fixProfileCompletionChecklist() {
  const file = 'src/screens/application/ProfileCompletionChecklistScreen.tsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    'const SectionRow: React.FC<SectionRowProps> = ({ section, isCorrectionMode }) => {',
    'const SectionRow: React.FC<SectionRowProps> = ({ section, isCorrectionMode }) => {\n  const { t } = useTranslation();'
  );
  content = content.replace(
    'const SectionRow: React.FC<SectionRowProps> = ({ section, isCorrectionMode }) => (',
    'const SectionRow: React.FC<SectionRowProps> = ({ section, isCorrectionMode }) => {\n  const { t } = useTranslation();\n  return ('
  );
  if (content.includes('const { t } = useTranslation();\n  return (')) {
    content = content.replace('      </View>\n    </TouchableOpacity>\n  );', '      </View>\n    </TouchableOpacity>\n  );\n};');
  }
  fs.writeFileSync(file, content, 'utf8');
}

function fixBookingRequestsInbox() {
  const file = 'src/screens/requests/BookingRequestsInboxScreen.tsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    'const RequestCard: React.FC<RequestCardProps> = ({ request, onReview, onDecline }) => {',
    'const RequestCard: React.FC<RequestCardProps> = ({ request, onReview, onDecline }) => {\n  const { t } = useTranslation();'
  );
  
  content = content.replace(
    'const EmptyState: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => (',
    'const EmptyState: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => {\n  const { t } = useTranslation();\n  return ('
  );
  content = content.replace(
    "      <Text style={styles.emptyBtnPrimaryText}>{t('requests.go_live_for_instant_bookings')}</Text>\n    </TouchableOpacity>\n  </View>\n);",
    "      <Text style={styles.emptyBtnPrimaryText}>{t('requests.go_live_for_instant_bookings')}</Text>\n    </TouchableOpacity>\n  </View>\n  );\n};"
  );
  content = content.replace(
    'const LiveNotificationBanner: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => (',
    'const LiveNotificationBanner: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => {\n  const { t } = useTranslation();\n  return ('
  );
  content = content.replace(
    "        <Text style={styles.liveBannerBtnText}>{t('requests.go_live')}</Text>\n      </TouchableOpacity>\n    </View>\n  </View>\n);",
    "        <Text style={styles.liveBannerBtnText}>{t('requests.go_live')}</Text>\n      </TouchableOpacity>\n    </View>\n  </View>\n  );\n};"
  );
  fs.writeFileSync(file, content, 'utf8');
}

function fixUpcomingSessions() {
  const file = 'src/screens/sessions/UpcomingSessionsScreen.tsx';
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    'const SessionCard: React.FC<{ session: any; onDetails: (id: string) => void }> = ({ session, onDetails }) => {',
    'const SessionCard: React.FC<{ session: any; onDetails: (id: string) => void }> = ({ session, onDetails }) => {\n  const { t } = useTranslation();'
  );

  content = content.replace(
    'const EmptyState: React.FC<{ onExplore: () => void }> = ({ onExplore }) => (',
    'const EmptyState: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {\n  const { t } = useTranslation();\n  return ('
  );
  content = content.replace(
    "      <Text style={styles.emptyBtnPrimaryText}>{t('sessions.open_availability_calendar')}</Text>\n    </TouchableOpacity>\n  </View>\n);",
    "      <Text style={styles.emptyBtnPrimaryText}>{t('sessions.open_availability_calendar')}</Text>\n    </TouchableOpacity>\n  </View>\n  );\n};"
  );

  fs.writeFileSync(file, content, 'utf8');
}

try {
  fixProfileCompletionChecklist();
  fixBookingRequestsInbox();
  fixUpcomingSessions();
  console.log('Fixed all three files successfully.');
} catch (e) {
  console.error(e);
}
