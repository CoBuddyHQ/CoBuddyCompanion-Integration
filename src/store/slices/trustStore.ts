import {create} from 'zustand';

interface TrustState {
  score: number;
  responseRate: number; // percentage (0-100)
  cancellationRate: number; // percentage (0-100)
  lastUpdated: string; // ISO string
  completedTasks: string[];
  unlockedBadges: string[];
  completeTask: (taskId: string, points: number) => void;
}

export const useTrustStore = create<TrustState>((set) => ({
  score: 85,
  responseRate: 98,
  cancellationRate: 2,
  lastUpdated: new Date().toISOString(),
  completedTasks: [],
  unlockedBadges: ['badge_safety', 'badge_top_rated', 'badge_100_sessions'],
  completeTask: (taskId: string, points: number) =>
    set((state) => {
      if (state.completedTasks.includes(taskId)) {return state;}
      const newScore = Math.min(state.score + points, 100);
      const newBadges =
        newScore === 100
          ? [...state.unlockedBadges, 'badge_elite']
          : state.unlockedBadges;
      return {
        score: newScore,
        completedTasks: [...state.completedTasks, taskId],
        unlockedBadges: newBadges,
      };
    }),
}));
