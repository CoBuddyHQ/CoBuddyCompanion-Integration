/**
 * CoBuddy Companion — Reviews Store (Zustand)
 * Holds the companion's ratings summary and individual customer reviews.
 * Includes actions to report reviews and save replies.
 */
import {create} from 'zustand';

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  tags: string[];
  sessionCategory: string;
  durationMinutes: number;
  replyText?: string;
  isReported?: boolean;
}

interface ReviewsState {
  // averageRating and totalReviews live in profileStore — single source of truth
  ratingBreakdown: Record<1 | 2 | 3 | 4 | 5, number>; // count per star (for bar chart only)
  reviews: Review[];

  // Actions
  reportReview: (reviewId: string) => void;
  addReplyToReview: (reviewId: string, reply: string) => void;
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
const MOCK_REVIEWS: Review[] = [
  {
    id: 'REV-01',
    customerName: 'Neha S.',
    rating: 5,
    date: '25 Jun 2026',
    comment: 'An amazing CoBuddy experience! We had a great time exploring the cafés. Super knowledgeable and very easy to talk to.',
    tags: ['Great Conversationalist', 'Punctual'],
    sessionCategory: 'cafe_conversation',
    durationMinutes: 120,
  },
  {
    id: 'REV-02',
    customerName: 'Aman K.',
    rating: 5,
    date: '20 Jun 2026',
    comment: 'Very polite and knowledgeable about the city. Made me feel safe and comfortable throughout.',
    tags: ['Friendly', 'Knows the City'],
    sessionCategory: 'city_walk',
    durationMinutes: 180,
  },
  {
    id: 'REV-03',
    customerName: 'Riya M.',
    rating: 4,
    date: '15 Jun 2026',
    comment: 'Good session, but started 5 mins late. Otherwise great! Would definitely book again.',
    tags: ['Good Listener'],
    sessionCategory: 'cafe_conversation',
    durationMinutes: 60,
  },
  {
    id: 'REV-04',
    customerName: 'Karan T.',
    rating: 5,
    date: '10 Jun 2026',
    comment: 'One of the best experiences I have had. Took me to places I never would have found on my own.',
    tags: ['Adventurous', 'Great Conversationalist'],
    sessionCategory: 'city_walk',
    durationMinutes: 240,
  },
  {
    id: 'REV-05',
    customerName: 'Pooja R.',
    rating: 5,
    date: '5 Jun 2026',
    comment: 'Absolutely loved every moment! Very attentive and made sure I was comfortable at all times.',
    tags: ['Attentive', 'Punctual', 'Friendly'],
    sessionCategory: 'events',
    durationMinutes: 120,
  },
  {
    id: 'REV-06',
    customerName: 'Dev P.',
    rating: 3,
    date: '1 Jun 2026',
    comment: 'Decent session overall. The venue choice was not ideal but the conversation was nice.',
    tags: ['Good Listener'],
    sessionCategory: 'cafe_conversation',
    durationMinutes: 90,
  },
];
// ───────────────────────────────────────────────────────────────────────────

export const useReviewsStore = create<ReviewsState>((set) => ({
  ratingBreakdown: {5: 20, 4: 3, 3: 1, 2: 0, 1: 0},
  reviews: MOCK_REVIEWS,

  reportReview: (reviewId: string) =>
    set((state) => ({
      reviews: state.reviews.map(r =>
        r.id === reviewId ? {...r, isReported: true} : r
      )
    })),

  addReplyToReview: (reviewId: string, reply: string) =>
    set((state) => ({
      reviews: state.reviews.map(r =>
        r.id === reviewId ? {...r, replyText: reply} : r
      )
    })),
}));
