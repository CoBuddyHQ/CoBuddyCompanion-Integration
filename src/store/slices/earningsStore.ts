/**
 * CoBuddy Companion — Earnings Store
 * ✅ INTEGRATED: Real API calls via EarningsService.
 * Holds available balance, pending clearance, lifetime stats, and transaction history.
 */
import { create } from 'zustand';
import type { Transaction } from '../types/store.types';
import { EarningsService } from '../../services/api/services/earnings.service';

interface EarningsState {
  availableBalance: number;
  pendingClearance: number;
  lifetimeEarnings: number;
  totalSessions: number;
  activeHours: number;
  tipsEarned: number;
  recentTransactions: Transaction[];
  
  isLoading: boolean;
  error: string | null;

  // ── API Actions ────────────────────────────────────────────────────────────
  fetchSummary: () => Promise<void>;
  fetchTransactions: (page?: number, limit?: number) => Promise<void>;
  
  // ── Local Actions ──────────────────────────────────────────────────────────
  setAvailableBalance: (v: number) => void;
  setPendingClearance: (v: number) => void;
  addTransaction: (tx: Transaction) => void;
  setLoading: (v: boolean) => void;
  setError: (err: string | null) => void;
}

export const useEarningsStore = create<EarningsState>((set, get) => ({
  availableBalance: 0,
  pendingClearance: 0,
  lifetimeEarnings: 0,
  totalSessions: 0,
  activeHours: 0,
  tipsEarned: 0,
  recentTransactions: [],
  
  isLoading: false,
  error: null,

  // ── fetchSummary ───────────────────────────────────────────────────────────
  fetchSummary: async () => {
    set({ isLoading: true, error: null });
    try {
      const summary = await EarningsService.getSummary();
      set({
        availableBalance: summary.availableBalance ?? 0,
        pendingClearance: summary.pendingBalance ?? 0,
        lifetimeEarnings: summary.totalEarnedAllTime ?? 0,
      });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch earnings summary' });
    } finally {
      set({ isLoading: false });
    }
  },

  // ── fetchTransactions ──────────────────────────────────────────────────────
  fetchTransactions: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const res = await EarningsService.getTransactions(page, limit);
      // Depending on backend response shape
      const txs = Array.isArray(res) ? res : (res as any).transactions ?? [];
      
      set(state => ({
        recentTransactions: page === 1 ? txs : [...state.recentTransactions, ...txs]
      }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch transactions' });
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Local Actions ──────────────────────────────────────────────────────────
  setAvailableBalance: (v) => set({ availableBalance: v }),
  setPendingClearance: (v) => set({ pendingClearance: v }),
  
  addTransaction: (tx) =>
    set((state) => ({ recentTransactions: [tx, ...state.recentTransactions] })),
    
  setLoading: (v) => set({ isLoading: v }),
  setError: (err) => set({ error: err })
}));