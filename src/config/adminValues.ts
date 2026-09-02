/**
 * Centralized Admin Configuration Values.
 * 
 * TODO: These values should eventually be fetched from the backend via the CONFIG and MASTER_DATA endpoints.
 * For now, they are hardcoded here to unblock development.
 */

export const AdminConfig = {
  serviceHours: { start: '06:00', end: '23:00' },
  refundTiers: [
    { code: 'tier_48h', label: '48+ hrs notice', refundPercent: 100 },
    { code: 'tier_24_48h', label: '24-48 hrs notice', refundPercent: 50 },
    { code: 'tier_lt_24h', label: 'Less than 24 hrs notice', refundPercent: 0 },
  ],
  communicationStyles: [
    { code: 'chatty', label: 'Chatty', icon: 'chat' },
    { code: 'balanced', label: 'Balanced', icon: 'compare-arrows' },
    { code: 'comfortable_with_quiet', label: 'Comfortable with quiet', icon: 'volume-off' },
    { code: 'deep_conversations', label: 'Deep Conversations', icon: 'forum' },
    { code: 'listener', label: 'Good Listener', icon: 'hearing' },
  ],
  activityPaces: [
    { code: 'relaxed', label: 'Relaxed & unhurried', icon: 'wb-sunny' },
    { code: 'moderate', label: 'Moderate pace', icon: 'directions-walk' },
    { code: 'active', label: 'Active & on-the-go', icon: 'directions-run' },
    { code: 'very_active', label: 'Very Active', icon: 'directions-bike' },
    { code: 'slow_paced', label: 'Slow Paced', icon: 'self-improvement' },
  ],
  incidentTypes: [
    { code: 'harassment', label: 'Harassment' },
    { code: 'safety_concern', label: 'Safety Concern' },
    { code: 'no_show', label: 'No Show' },
    { code: 'payment_dispute', label: 'Payment Dispute' },
    { code: 'inappropriate_behavior', label: 'Inappropriate Behavior' },
    { code: 'emergency', label: 'Emergency' },
    { code: 'unauthorized_recording', label: 'Unauthorized Recording' },
    { code: 'privacy_violation', label: 'Privacy Violation' },
    { code: 'scam', label: 'Scam/Fraud' },
    { code: 'no_show_customer', label: 'Customer No-Show' },
    { code: 'other', label: 'Other' },
    { code: 'identity_mismatch', label: 'Identity Mismatch / Fake Profile' },
  ],
  ticketCategories: [
    { code: 'payment_payout', label: 'Payment & Payout', icon: 'payment' },
    { code: 'booking_session', label: 'Booking & Session Issue', icon: 'event-busy' },
    { code: 'safety_incident', label: 'Safety Concern', icon: 'security' },
    { code: 'verification', label: 'Verification', icon: 'verified-user' },
    { code: 'account_access', label: 'Account & Tech Support', icon: 'account-balance' },
    { code: 'dispute', label: 'Dispute', icon: 'gavel' },
    { code: 'general', label: 'General', icon: 'help-outline' },
    { code: 'age_minor_escalation', label: 'Age / Minor Escalation', icon: 'warning' },
    { code: 'marketing_promo', label: 'Promotions & Offers', icon: 'local-offer' },
    { code: 'feedback', label: 'Feedback & Suggestions', icon: 'feedback' },
  ],
  kycDocumentTypes: [
    { code: 'AADHAAR', label: 'Aadhaar Card', icon: 'badge', recommended: true },
    { code: 'DRIVING_LICENSE', label: 'Driving Licence', icon: 'directions-car', recommended: false },
    { code: 'VOTER_ID', label: 'Voter ID', icon: 'how-to-vote', recommended: false },
    { code: 'PASSPORT', label: 'Passport', icon: 'flight', recommended: false },
  ],
  companionCategorySelectionLimits: { min: 1, max: 3 },

  commission: {
    platformFeePercentage: 15, // %
  },
  pricing: {
    baseHourlyRateLimit: {
      min: 200,
      max: 2000,
    },
  },
  feedbackTags: {
    praise: [
      { code: 'punctual', label: 'Punctual' },
      { code: 'respectful', label: 'Respectful' },
      { code: 'good_communicator', label: 'Good Communicator' },
      { code: 'fun', label: 'Fun' }
    ],
    concern: [
      { code: 'late', label: 'Late' },
      { code: 'rude_unprofessional', label: 'Rude / Unprofessional' },
      { code: 'made_uncomfortable', label: 'Made me uncomfortable' },
      { code: 'no_show_risk', label: 'No-show risk' }
    ]
  },
  sessionDurations: [60, 90, 120, 180, 240, 300, 360, 480, 720, 1440], // minutes
  sessionReasons: [
      { code: 'other', label: 'Other', appliesTo: ['COMPANION_REJECT'] },
{ code: 'schedule_conflict', label: 'Schedule conflict / Unavailable', appliesTo: ['COMPANION_REJECT'] },
    { code: 'location_too_far', label: 'Location is too far', appliesTo: ['COMPANION_REJECT'] },
    { code: 'not_comfortable_activity', label: 'Not comfortable with activity type', appliesTo: ['COMPANION_REJECT'] },
    { code: 'incomplete_profile', label: 'Customer profile seems incomplete', appliesTo: ['COMPANION_REJECT'] },
    { code: 'health_issue', label: 'Health issue', appliesTo: ['COMPANION_CANCEL'] },
    { code: 'transport_problem', label: 'Transport problem', appliesTo: ['COMPANION_CANCEL'] },
    { code: 'personal_emergency', label: 'Personal emergency', appliesTo: ['ANY'] },
    { code: 'unresponsive', label: 'Unresponsive', appliesTo: ['ANY'] },
    { code: 'customer_request', label: 'Customer request', appliesTo: ['COMPANION_EARLY_END'] },
    { code: 'safety_concern', label: 'Safety concern', appliesTo: ['COMPANION_EARLY_END'] },
    { code: 'mutual_agreement', label: 'Mutual agreement', appliesTo: ['COMPANION_EARLY_END'] },
  ],
  blockReasons: [
    'Made me uncomfortable',
    'Inappropriate behavior',
    'Harassment',
    'Repeated cancellations',
    'Other'
  ],
  categoryPriceMultipliers: {
    'INT-1': 1.0,
    'INT-2': 1.2,
    'INT-3': 1.0,
    'INT-4': 1.0,
    'INT-5': 1.5,
    'INT-6': 1.0,
    'INT-7': 1.2,
    'INT-8': 1.5,
    'INT-9': 1.2,
    'INT-10': 1.5,
    'INT-11': 1.0,
    'INT-12': 1.2,
    'INT-13': 1.0,
  } as Record<string, number>,
  categoryDetails: {
    'INT-1': { label: 'Italian Cuisine', icon: 'restaurant' },
    'INT-2': { label: 'Museums', icon: 'bank' },
    'INT-3': { label: 'Cafe Hopping', icon: 'local-cafe' },
    'INT-4': { label: 'Movies', icon: 'movie' },
    'INT-5': { label: 'Concerts', icon: 'music-note' },
    'INT-6': { label: 'Parks', icon: 'park' },
    'INT-7': { label: 'Sightseeing', icon: 'photo-camera' },
    'INT-8': { label: 'Clubbing', icon: 'nightlife' },
    'INT-9': { label: 'Art Galleries', icon: 'palette' },
    'INT-10': { label: 'Hiking', icon: 'hiking' },
    'INT-11': { label: 'Board Games', icon: 'casino' },
    'INT-12': { label: 'Karaoke', icon: 'mic' },
    'INT-13': { label: 'Gaming', icon: 'sports-esports' },
  } as Record<string, { label: string; icon: string }>,
};
