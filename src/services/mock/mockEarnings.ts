/**
 * CoBuddy Companion App — Mock Earnings Data
 * Covers earnings summary, transactions, and payout records.
 * PRIVACY: Bank account and UPI shown as masked strings only.
 * CONTENT RULE: Platform fee deducted transparently. No off-platform payments.
 */

import type {
  EarningsSummary,
  Transaction,
  PayoutRecord,
} from '../../store/types/store.types';

// ─── Earnings Summary ─────────────────────────────────────────────────────────

export const MOCK_EARNINGS_SUMMARY: EarningsSummary = {
  availableBalance:        24980,   // INR — ready to withdraw
  pendingBalance:           2140,   // INR — under review
  totalEarnedAllTime:     184920,   // INR
  totalEarnedThisMonth:    28450,   // INR
  totalSessionsThisMonth:     19,
  nextPayoutCycleDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7 || 7)); // Next Friday
    return d.toISOString().split('T')[0]!;
  })(),
  safetyHoldAmount:            0,   // No active holds
};

// ─── Transactions ─────────────────────────────────────────────────────────────

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    transactionId: 'TXN-CB-8842',
    type: 'session_earning',
    status: 'payout_eligible',
    amount: 1620,
    sessionId: 'CB-SE-2046',
    customerInitials: 'P.R.',
    description: 'Art & Culture session — City Art Gallery',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    payoutEligibleAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    transactionId: 'TXN-CB-8841',
    type: 'extension_earning',
    status: 'payout_eligible',
    amount: 220,
    sessionId: 'CB-SE-2046',
    customerInitials: 'P.R.',
    description: 'Session extension — 30 min approved',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
    payoutEligibleAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    transactionId: 'TXN-CB-8840',
    type: 'safety_bonus',
    status: 'payout_eligible',
    amount: 150,
    sessionId: 'CB-SE-2046',
    customerInitials: 'P.R.',
    description: 'Safety compliance bonus',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 92 * 60 * 1000).toISOString(),
    payoutEligibleAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    transactionId: 'TXN-CB-8839',
    type: 'platform_fee',
    status: 'deducted',
    amount: -10,
    sessionId: 'CB-SE-2046',
    customerInitials: null,
    description: 'CoBuddy platform fee',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    payoutEligibleAt: null,
  },
  {
    transactionId: 'TXN-CB-8810',
    type: 'payout_transfer',
    status: 'paid',
    amount: -18600,
    sessionId: null,
    customerInitials: null,
    description: 'Payout to HDFC •••• 4821',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    payoutEligibleAt: null,
  },
  {
    transactionId: 'TXN-CB-8780',
    type: 'session_earning',
    status: 'pending_review',
    amount: 1320,
    sessionId: 'CB-SE-2044',
    customerInitials: 'S.K.',
    description: 'City Walk session — Arera Hills Trail',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    payoutEligibleAt: null,
  },
];

// ─── Payout Records ───────────────────────────────────────────────────────────

export const MOCK_PAYOUTS: PayoutRecord[] = [
  {
    payoutId: 'PAYOUT-CB-9120',
    status: 'completed',
    amount: 18600,
    platformFee: 10,
    maskedBank: '•••• 4821',
    utrNumber: '•••• 9021',
    requestedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    failureReason: null,
  },
  {
    payoutId: 'PAYOUT-CB-9080',
    status: 'completed',
    amount: 15420,
    platformFee: 10,
    maskedBank: '•••• 4821',
    utrNumber: '•••• 7841',
    requestedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    failureReason: null,
  },
  {
    payoutId: 'PAYOUT-CB-9040',
    status: 'completed',
    amount: 14580,
    platformFee: 10,
    maskedBank: '•••• 4821',
    utrNumber: '•••• 6320',
    requestedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    failureReason: null,
  },
];
