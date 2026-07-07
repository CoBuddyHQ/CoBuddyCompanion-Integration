import i18next from "i18next";
import { useTranslation } from "react-i18next"; /**
 * CoBuddy Companion — Earnings Store
 * Holds available balance, pending clearance, lifetime stats, and transaction history.
 * DEV: Mock data seeded below — swap for real API calls before production.
 */
import { create } from 'zustand';

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number; // positive = credit, negative = debit
  type: 'credit' | 'debit' | 'pending';
}

interface EarningsState {
  availableBalance: number;
  pendingClearance: number;
  lifetimeEarnings: number;
  totalSessions: number;
  activeHours: number; // TODO: backend not wired yet
  tipsEarned: number; // TODO: backend not wired yet
  recentTransactions: Transaction[];
  // Actions
  setAvailableBalance: (v: number) => void;
  setPendingClearance: (v: number) => void;
  addTransaction: (tx: Transaction) => void;
}

export const useEarningsStore = create<EarningsState>((set) => ({
  // ─── MOCK DATA — remove before production ────────────────────────────────
  availableBalance: 4500,
  pendingClearance: 1250,
  lifetimeEarnings: 15750,
  totalSessions: 14,
  activeHours: 0, // TODO: backend not wired yet
  tipsEarned: 0, // TODO: backend not wired yet
  recentTransactions: [
  {
    id: 'TX-001',
    title: i18next.t("content.slices.earningsStore.session_caf_conversation"),
    date: 'Today, 2:00 PM',
    amount: 750,
    type: 'pending'
  },
  {
    id: 'TX-002',
    title: i18next.t("content.slices.earningsStore.withdrawal_to_bank_account"),
    date: 'Yesterday',
    amount: -2000,
    type: 'debit'
  },
  {
    id: 'TX-003',
    title: i18next.t("content.slices.earningsStore.session_city_walk"),
    date: '24 Jun 2026',
    amount: 1200,
    type: 'credit'
  },
  {
    id: 'TX-004',
    title: i18next.t("content.slices.earningsStore.safety_bonus"),
    date: '22 Jun 2026',
    amount: 50,
    type: 'credit'
  },
  {
    id: 'TX-005',
    title: i18next.t("content.slices.earningsStore.session_bookstore_visit"),
    date: '20 Jun 2026',
    amount: 550,
    type: 'credit'
  }],

  // ─────────────────────────────────────────────────────────────────────────

  setAvailableBalance: (v) => set({ availableBalance: v }),
  setPendingClearance: (v) => set({ pendingClearance: v }),
  addTransaction: (tx) =>
  set((state) => ({ recentTransactions: [tx, ...state.recentTransactions] }))
}));