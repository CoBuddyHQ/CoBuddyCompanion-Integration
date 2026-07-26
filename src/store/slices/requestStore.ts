/**
 * CoBuddy Companion App — Request Store (Zustand)
 * ✅ INTEGRATED: Real API calls via RequestsService.
 * Manages incoming booking requests — pending, reviewed, expired.
 * PRIVACY: Customer data stored with masked/initials only.
 */

import { create } from 'zustand';
import type { BookingRequest, RequestStatus } from '../types/store.types';
import { RequestsService } from '../../services/api/services/requests.service';

export interface FilterState {
  status: 'all' | 'pending' | 'expired' | 'counter_proposed';
  categories: string[];
  minEarning: number;
  sortBy: 'newest' | 'expiring_soon' | 'highest_earning';
}

export const DEFAULT_FILTER: FilterState = {
  status: 'all',
  categories: [],
  minEarning: 0,
  sortBy: 'newest',
};

interface RequestState {
  pendingRequests: BookingRequest[];
  reviewedRequests: BookingRequest[];
  selectedRequest: BookingRequest | null;
  unreadCount: number;

  activeFilter: FilterState;
  setFilter: (filter: FilterState) => void;
  resetFilter: () => void;

  isLoading: boolean;
  error: string | null;

  // ── API Actions ────────────────────────────────────────────────────────────
  /** Fetch requests from backend — replaces mock data */
  fetchRequests: () => Promise<void>;
  /** Accept a booking request */
  acceptRequest: (requestId: string) => Promise<void>;
  /** Decline a booking request with reason */
  declineRequest: (requestId: string, reason: string) => Promise<void>;
  /** Counter-propose a new time slot */
  counterPropose: (requestId: string, newStart: string, newEnd: string) => Promise<void>;

  // ── List management ────────────────────────────────────────────────────────
  setPendingRequests: (requests: BookingRequest[]) => void;
  setReviewedRequests: (requests: BookingRequest[]) => void;
  addRequest: (request: BookingRequest) => void;    // Used by Socket.IO
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  removeExpiredRequests: () => void;

  // ── Selection ─────────────────────────────────────────────────────────────
  selectRequest: (request: BookingRequest | null) => void;

  // ── Unread ────────────────────────────────────────────────────────────────
  setUnreadCount: (count: number) => void;
  decrementUnread: () => void;

  // ── Loading ───────────────────────────────────────────────────────────────
  setLoading: (v: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRequestStore = create<RequestState>((set, get) => ({
  // ── Initial state — empty (data comes from API) ─────────────────────────
  pendingRequests: [],
  reviewedRequests: [],
  selectedRequest: null,
  unreadCount: 0,

  activeFilter: DEFAULT_FILTER,
  setFilter: filter => set({ activeFilter: filter }),
  resetFilter: () => set({ activeFilter: DEFAULT_FILTER }),

  isLoading: false,
  error: null,

  // ── fetchRequests ────────────────────────────────────────────────────────
  fetchRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const filter = get().activeFilter;
      const res = await RequestsService.listRequests({
        status: filter.status,
        categories: filter.categories.length > 0 ? filter.categories.join(',') : undefined,
        minEarning: filter.minEarning > 0 ? filter.minEarning : undefined,
        sortBy: filter.sortBy,
      });
      const requests = Array.isArray(res)
        ? res
        : (res as { requests: BookingRequest[] }).requests ?? [];
      set({
        pendingRequests: requests.filter(r => r.status === 'pending' || r.status === 'counter_proposed'),
        reviewedRequests: requests.filter(r => r.status !== 'pending' && r.status !== 'counter_proposed'),
        unreadCount: requests.filter(r => r.status === 'pending').length,
      });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to load requests' });
    } finally {
      set({ isLoading: false });
    }
  },

  // ── acceptRequest ─────────────────────────────────────────────────────────
  acceptRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      await RequestsService.acceptRequest(requestId);
      get().updateRequestStatus(requestId, 'accepted');
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to accept request' });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  // ── declineRequest ────────────────────────────────────────────────────────
  declineRequest: async (requestId, reason) => {
    set({ isLoading: true, error: null });
    try {
      await RequestsService.declineRequest(requestId, { reason });
      get().updateRequestStatus(requestId, 'declined');
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to decline request' });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  // ── counterPropose ────────────────────────────────────────────────────────
  counterPropose: async (requestId, newStart, newEnd) => {
    set({ isLoading: true, error: null });
    try {
      await RequestsService.counterPropose(requestId, { newStart, newEnd });
      get().updateRequestStatus(requestId, 'counter_proposed');
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to counter propose' });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  // ── List management ───────────────────────────────────────────────────────
  setPendingRequests: requests =>
    set({ pendingRequests: requests, unreadCount: requests.length }),

  setReviewedRequests: requests => set({ reviewedRequests: requests }),

  addRequest: request =>
    set(state => ({
      pendingRequests: [request, ...state.pendingRequests],
      unreadCount: state.unreadCount + 1,
    })),

  updateRequestStatus: (requestId, status) =>
    set(state => {
      const request = state.pendingRequests.find(r => r.requestId === requestId);
      if (!request) { return state; }
      const updatedRequest = { ...request, status };
      return {
        pendingRequests: state.pendingRequests.filter(r => r.requestId !== requestId),
        reviewedRequests: [updatedRequest, ...state.reviewedRequests],
      };
    }),

  removeExpiredRequests: () =>
    set(state => {
      const now = new Date();
      const valid = state.pendingRequests.filter(r => new Date(r.expiresAt) > now);
      const expired = state.pendingRequests
        .filter(r => new Date(r.expiresAt) <= now)
        .map(r => ({ ...r, status: 'expired' as RequestStatus }));
      return {
        pendingRequests: valid,
        reviewedRequests: [...expired, ...state.reviewedRequests],
      };
    }),

  selectRequest: request => set({ selectedRequest: request }),

  setUnreadCount: count => set({ unreadCount: count }),
  decrementUnread: () =>
    set(state => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),

  setLoading: v => set({ isLoading: v }),
  setError: error => set({ error }),
}));
