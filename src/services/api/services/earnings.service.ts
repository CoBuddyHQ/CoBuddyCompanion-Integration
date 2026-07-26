/**
 * CoBuddy Companion — Earnings API Service
 * Wraps all /companion/earnings/* endpoints.
 */

import { apiGet, apiPost } from '../client';
import { Endpoints, buildPath } from '../endpoints';
import type { EarningsSummary, Transaction, PayoutRecord } from '../../../store/types/store.types';

export interface PayoutRequestDto {
  amount: number;  // INR
}

export interface EarningsResponse {
  summary: EarningsSummary;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
}

export const EarningsService = {
  getSummary: (): Promise<EarningsSummary> =>
    apiGet<EarningsSummary>(Endpoints.EARNINGS.SUMMARY),

  getTransactions: (page = 1, limit = 20): Promise<TransactionListResponse> =>
    apiGet<TransactionListResponse>(`${Endpoints.EARNINGS.TRANSACTIONS}?page=${page}&limit=${limit}`),

  getTransactionDetail: (transactionId: string): Promise<Transaction> =>
    apiGet<Transaction>(buildPath(Endpoints.EARNINGS.TRANSACTION_DETAIL, { transactionId })),

  getPayoutHistory: (): Promise<PayoutRecord[]> =>
    apiGet<PayoutRecord[]>(Endpoints.EARNINGS.PAYOUT_HISTORY),

  getPayoutDetail: (payoutId: string): Promise<PayoutRecord> =>
    apiGet<PayoutRecord>(buildPath(Endpoints.EARNINGS.PAYOUT_DETAIL, { payoutId })),

  requestPayout: (dto: PayoutRequestDto) =>
    apiPost(Endpoints.EARNINGS.PAYOUT_REQUEST, dto),

  getWeeklyEarnings: () =>
    apiGet(Endpoints.EARNINGS.WEEKLY),

  getDailyEarnings: () =>
    apiGet(Endpoints.EARNINGS.DAILY),

  getPendingEarnings: () =>
    apiGet(Endpoints.EARNINGS.PENDING),

  getInvoices: () =>
    apiGet(Endpoints.EARNINGS.INVOICE_LIST),

  getInvoiceDetail: (invoiceId: string) =>
    apiGet(buildPath(Endpoints.EARNINGS.INVOICE_DETAIL, { invoiceId })),
};
