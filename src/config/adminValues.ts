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
      { code: 'friendly', label: 'Friendly' },
      { code: 'respectful', label: 'Respectful' },
      { code: 'good_communicator', label: 'Good Communicator' },
      { code: 'fun', label: 'Fun' }
    ],
    concern: [
      { code: 'late_arrival', label: 'Late arrival' },
      { code: 'rude', label: 'Rude' },
      { code: 'made_uncomfortable', label: 'Made me uncomfortable' },
      { code: 'no_show_risk', label: 'No-show risk' }
    ]
  },
  sessionDurations: [60, 90, 120, 180, 240, 300, 360, 480, 720, 1440], // minutes
  sessionReasons: [
    { code: 'CUSTOMER_REQUEST', label: 'Customer request', appliesTo: ['EARLY_END'] },
    { code: 'EMERGENCY', label: 'Emergency', appliesTo: ['EARLY_END'] },
    { code: 'SAFETY_CONCERN', label: 'Safety concern', appliesTo: ['EARLY_END'] },
    { code: 'MUTUAL_AGREEMENT', label: 'Mutual agreement', appliesTo: ['EARLY_END'] },
    { code: 'PERSONAL_EMERGENCY', label: 'Personal emergency', appliesTo: ['CANCEL'] },
    { code: 'HEALTH_ISSUE', label: 'Health issue', appliesTo: ['CANCEL'] },
    { code: 'TRANSPORT_PROBLEM', label: 'Transport problem', appliesTo: ['CANCEL'] },
    { code: 'OTHER', label: 'Other', appliesTo: ['CANCEL', 'EARLY_END'] },
  ],
  blockReasons: [
    'Made me uncomfortable',
    'Inappropriate behavior',
    'Harassment',
    'Repeated cancellations',
    'Other'
  ],
  categoryPriceMultipliers: {
    cafe_conversation: 1.0,
    city_walk: 1.0,
    art_culture: 1.0,
    food_experience: 1.0,
    shopping_assistance: 1.0,
    events: 1.0,
    business_networking: 1.0,
    bookstore: 1.0,
    wellness_walk: 1.0,
    movies: 1.5,
  } as Record<string, number>,
};
