/**
 * CoBuddy Companion — Reviews Store (Zustand)
 * ✅ INTEGRATED: Real API calls via ReviewsService.
 * Holds the companion's ratings summary and individual customer reviews.
 * Includes actions to report reviews and save replies.
 */
import { create } from 'zustand';
import { ReviewsService } from '../../services/api/services/index';

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
  ratingBreakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  reviews: Review[];

  isLoading: boolean;
  error: string | null;

  // Actions
  fetchReviews: () => Promise<void>;
  reportReview: (reviewId: string, reason: string) => Promise<void>;
  addReplyToReview: (reviewId: string, reply: string) => Promise<void>;
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
  ratingBreakdown: {5: 0, 4: 0, 3: 0, 2: 0, 1: 0},
  reviews: [],
  isLoading: false,
  error: null,

  fetchReviews: async () => {
    set({ isLoading: true, error: null });
    try {
      const res: any = await ReviewsService.getReviews();
      set({ 
        reviews: res.reviews ?? [],
        ratingBreakdown: res.ratingBreakdown ?? {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
      });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch reviews' });
    } finally {
      set({ isLoading: false });
    }
  },

  reportReview: async (reviewId: string, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      await ReviewsService.reportReview(reviewId, { reason });
      set((state) => ({
        reviews: state.reviews.map(r =>
          r.id === reviewId ? { ...r, isReported: true } : r
        )
      }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to report review' });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  addReplyToReview: async (reviewId: string, reply: string) => {
    set({ isLoading: true, error: null });
    try {
      await ReviewsService.replyToReview(reviewId, { reply });
      set((state) => ({
        reviews: state.reviews.map(r =>
          r.id === reviewId ? { ...r, replyText: reply } : r
        )
      }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to reply to review' });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },
}));
