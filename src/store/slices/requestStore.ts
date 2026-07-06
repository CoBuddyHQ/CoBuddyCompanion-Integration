/**
 * CoBuddy Companion App — Request Store (Zustand)
 * Manages incoming booking requests — pending, reviewed, expired.
 * PRIVACY: Customer data stored with masked/initials only.
 */

import {create} from 'zustand';
import type {BookingRequest, RequestStatus} from '../types/store.types';

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
  reviewedRequests: BookingRequest[];  // Accepted / Declined / Expired today
  selectedRequest: BookingRequest | null;
  unreadCount: number;

  // Filter
  activeFilter: FilterState;
  setFilter: (filter: FilterState) => void;
  resetFilter: () => void;

  isLoading: boolean;
  error: string | null;

  // List management
  setPendingRequests: (requests: BookingRequest[]) => void;
  setReviewedRequests: (requests: BookingRequest[]) => void;
  addRequest: (request: BookingRequest) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  removeExpiredRequests: () => void;

  // Selection
  selectRequest: (request: BookingRequest | null) => void;

  // Unread
  setUnreadCount: (count: number) => void;
  decrementUnread: () => void;

  // Loading
  setLoading: (v: boolean) => void;
  setError: (error: string | null) => void;
}

// ─── MOCK DATA — remove before production / replace with real API call ────────
const now = Date.now();
const MOCK_PENDING_REQUESTS: BookingRequest[] = [
  {
    requestId: 'REQ-001',
    status: 'pending',
    category: 'cafe_conversation',
    customer: {
      customerId: 'CUST-001',
      displayInitials: 'P.M.',
      trustScore: 98,
      isVerified: true,
      totalSessionsWithCompanion: 0,
      sessionCountOverall: 12,
      safetyConsent: true,
      identityVerified: true,
    },
    venue: {
      venueId: 'VEN-001',
      name: 'Café Coffee Day – MP Nagar',
      area: 'MP Nagar',
      city: 'Bhopal',
      isApproved: true,
      venueType: 'Public Café',
      meetingPoint: 'Main entrance seating',
      landmark: 'Near Zone-1 Square',
    },
    proposedStart: new Date(now + 86_400_000).toISOString(),       // Tomorrow
    proposedEnd:   new Date(now + 86_400_000 + 7_200_000).toISOString(), // +2h
    durationMinutes: 120,
    language: 'Hindi',
    estimatedEarning: 749,
    matchScore: 92,
    expiresAt: new Date(now + 48 * 3_600_000).toISOString(),           // 48h from now
    customerNote: 'Looking for a relaxed café chat about travel and books.',
    receivedAt: new Date(now - 300_000).toISOString(),              // 5 mins ago
  },
  {
    requestId: 'REQ-002',
    status: 'pending',
    category: 'city_walk',
    customer: {
      customerId: 'CUST-002',
      displayInitials: 'R.K.',
      trustScore: 84,
      isVerified: true,
      totalSessionsWithCompanion: 0,
      sessionCountOverall: 5,
      safetyConsent: false,
      identityVerified: true,
    },
    venue: {
      venueId: 'VEN-002',
      name: 'DB Mall – City Walk Route',
      area: 'DB Mall',
      city: 'Bhopal',
      isApproved: true,
      venueType: 'Public Area',
      meetingPoint: 'Main gate — ground floor fountain',
      landmark: 'Opposite Habibganj Station',
    },
    proposedStart: new Date(now + 172_800_000).toISOString(),      // Day after tomorrow
    proposedEnd:   new Date(now + 172_800_000 + 10_800_000).toISOString(), // +3h
    durationMinutes: 180,
    language: 'English',
    estimatedEarning: 1200,
    matchScore: 78,
    expiresAt: new Date(now + 72 * 3_600_000).toISOString(),            // 72h from now
    customerNote: null,
    receivedAt: new Date(now - 900_000).toISOString(),              // 15 mins ago
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export const useRequestStore = create<RequestState>(set => ({
  pendingRequests: MOCK_PENDING_REQUESTS,
  reviewedRequests: [],
  selectedRequest: null,
  unreadCount: MOCK_PENDING_REQUESTS.length,
  
  activeFilter: DEFAULT_FILTER,
  setFilter: filter => set({activeFilter: filter}),
  resetFilter: () => set({activeFilter: DEFAULT_FILTER}),

  isLoading: false,
  error: null,

  setPendingRequests: requests =>
    set({pendingRequests: requests, unreadCount: requests.length}),

  setReviewedRequests: requests => set({reviewedRequests: requests}),

  addRequest: request =>
    set(state => ({
      pendingRequests: [request, ...state.pendingRequests],
      unreadCount: state.unreadCount + 1,
    })),

  updateRequestStatus: (requestId, status) =>
    set(state => {
      const request = state.pendingRequests.find(
        r => r.requestId === requestId,
      );
      if (!request) { return state; }

      const updatedRequest = {...request, status};
      return {
        pendingRequests: state.pendingRequests.filter(
          r => r.requestId !== requestId,
        ),
        reviewedRequests: [updatedRequest, ...state.reviewedRequests],
      };
    }),

  removeExpiredRequests: () =>
    set(state => {
      const now = new Date();
      const valid = state.pendingRequests.filter(
        r => new Date(r.expiresAt) > now,
      );
      const expired = state.pendingRequests
        .filter(r => new Date(r.expiresAt) <= now)
        .map(r => ({...r, status: 'expired' as RequestStatus}));
      return {
        pendingRequests: valid,
        reviewedRequests: [...expired, ...state.reviewedRequests],
      };
    }),

  selectRequest: request => set({selectedRequest: request}),

  setUnreadCount: count => set({unreadCount: count}),
  decrementUnread: () =>
    set(state => ({unreadCount: Math.max(0, state.unreadCount - 1)})),

  setLoading: v => set({isLoading: v}),
  setError: error => set({error}),
}));
