/**
 * Centralized Admin Configuration Values.
 * 
 * TODO: These values should eventually be fetched from the backend via the CONFIG and MASTER_DATA endpoints.
 * For now, they are hardcoded here to unblock development.
 */

export const AdminConfig = {
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
