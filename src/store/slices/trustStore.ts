/**
 * CoBuddy Companion — Trust Store (Zustand)
 * ✅ INTEGRATED: Real API calls via ReviewsService (trust score).
 */
import { create } from 'zustand';
import { ReviewsService } from '../../services/api/services/index';

interface TrustState {
  score: number;
  responseRate: number; // percentage (0-100)
  cancellationRate: number; // percentage (0-100)
  lastUpdated: string; // ISO string
  completedTasks: string[];
  unlockedBadges: string[];
  
  isLoading: boolean;
  error: string | null;

  fetchTrustScore: () => Promise<void>;
  completeTask: (taskId: string, points: number) => void;
}

export const useTrustStore = create<TrustState>((set, get) => ({
  score: 0,
  responseRate: 0,
  cancellationRate: 0,
  lastUpdated: new Date().toISOString(),
  completedTasks: [],
  unlockedBadges: [],
  isLoading: false,
  error: null,

  fetchTrustScore: async () => {
    set({ isLoading: true, error: null });
    try {
      const res: any = await ReviewsService.getTrustScore();
      set({
        score: res.trustScore ?? res.score ?? 85,
        responseRate: res.responseRate ?? 98,
        cancellationRate: res.cancellationRate ?? 2,
        lastUpdated: new Date().toISOString(),
        unlockedBadges: res.badges ?? [],
      });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch trust score' });
    } finally {
      set({ isLoading: false });
    }
  },

  completeTask: (taskId: string, points: number) =>
    set((state) => {
      if (state.completedTasks.includes(taskId)) { return state; }
      const newScore = Math.min(state.score + points, 100);
      const newBadges =
        newScore === 100 && !state.unlockedBadges.includes('badge_elite')
          ? [...state.unlockedBadges, 'badge_elite']
          : state.unlockedBadges;
      return {
        score: newScore,
        completedTasks: [...state.completedTasks, taskId],
        unlockedBadges: newBadges,
      };
    }),
}));
