const fs = require('fs');

function fixBookingRequestsInbox() {
  const file = 'src/screens/requests/BookingRequestsInboxScreen.tsx';
  let content = fs.readFileSync(file, 'utf8');

  // Fix RequestCard
  content = content.replace(
    'const RequestCard: React.FC<RequestCardProps> = ({ request, onReview, onDecline }) => {',
    'const RequestCard: React.FC<RequestCardProps> = ({ request, onReview, onDecline }) => {\n  const { t } = useTranslation();'
  );
  
  // Fix EmptyState
  content = content.replace(
    'const EmptyState: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => (',
    'const EmptyState: React.FC<{ onGoLive: () => void }> = ({ onGoLive }) => {\n  const { t } = useTranslation();\n  return ('
  );
  
  content = content.replace(
    "      <Text style={styles.emptyBtnPrimaryText}> {t('requests.go_live_for_instant_bookings')} </Text>\n    </TouchableOpacity>\n  </View>\n);",
    "      <Text style={styles.emptyBtnPrimaryText}> {t('requests.go_live_for_instant_bookings')} </Text>\n    </TouchableOpacity>\n  </View>\n  );\n};"
  );
  // Just in case it was missing spaces
  content = content.replace(
    "      <Text style={styles.emptyBtnPrimaryText}>{t('requests.go_live_for_instant_bookings')}</Text>\n    </TouchableOpacity>\n  </View>\n);",
    "      <Text style={styles.emptyBtnPrimaryText}>{t('requests.go_live_for_instant_bookings')}</Text>\n    </TouchableOpacity>\n  </View>\n  );\n};"
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed BookingRequestsInboxScreen via script.');
}

try {
  fixBookingRequestsInbox();
} catch (e) {
  console.error(e);
}
