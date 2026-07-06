/**
 * CoBuddy Companion App — Mock Reviews Data
 * Companion's received reviews from customers.
 * PRIVACY: Customer names as initials only.
 * CONTENT RULE: Reviews reflect platonic, professional session quality.
 */

import type {CompanionReview} from '../../store/types/store.types';

export const MOCK_REVIEWS: CompanionReview[] = [
  {
    reviewId: 'REV-CB-4401',
    sessionId: 'CB-SE-2046',
    customerInitials: 'P.R.',
    rating: 5,
    isPublic: true,
    highlights: ['Respectful', 'Great conversation', 'Punctual', 'Followed venue rules'],
    comment:
      'Excellent session at the gallery. Very knowledgeable about the exhibits and made the visit genuinely enjoyable. Professional and courteous throughout.',
    sessionCategory: 'art_culture',
    sessionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    reviewId: 'REV-CB-4381',
    sessionId: 'CB-SE-2040',
    customerInitials: 'A.R.',
    rating: 5,
    isPublic: true,
    highlights: ['Calm presence', 'Good listener', 'Safe experience', 'Stayed at approved venue'],
    comment:
      'Had a wonderful café conversation. Felt completely at ease. Will definitely book again through CoBuddy.',
    sessionCategory: 'cafe_conversation',
    sessionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    reviewId: 'REV-CB-4360',
    sessionId: 'CB-SE-2035',
    customerInitials: 'S.K.',
    rating: 4,
    isPublic: true,
    highlights: ['Friendly', 'Knowledgeable about local spots', 'Punctual'],
    comment:
      'Great city walk experience. Knew a lot about local history. Would have liked slightly more structured conversation topics but overall a very pleasant experience.',
    sessionCategory: 'city_walk',
    sessionDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    reviewId: 'REV-CB-4340',
    sessionId: 'CB-SE-2028',
    customerInitials: 'M.V.',
    rating: 5,
    isPublic: true,
    highlights: ['Professional', 'Made me feel comfortable', 'Followed all guidelines'],
    comment:
      'First time using CoBuddy and it was a great experience. Very professional and made the bookstore visit genuinely fun.',
    sessionCategory: 'bookstore',
    sessionDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
  },
  {
    reviewId: 'REV-CB-4301',
    sessionId: 'CB-SE-2020',
    customerInitials: 'R.N.',
    rating: 4,
    isPublic: false,  // Private review
    highlights: ['Good communicator', 'Reliable'],
    comment: null,    // No written comment
    sessionCategory: 'cafe_conversation',
    sessionDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
  },
];

/**
 * Computed review stats from mock data
 */
export const MOCK_REVIEW_STATS = {
  averageRating: 4.6,
  totalReviews: 34,             // Total across all time (not just this mock array)
  ratingBreakdown: {
    five:  28,
    four:   5,
    three:  1,
    two:    0,
    one:    0,
  },
  topHighlights: [
    'Respectful',
    'Punctual',
    'Safe experience',
    'Professional',
    'Good listener',
  ],
};
