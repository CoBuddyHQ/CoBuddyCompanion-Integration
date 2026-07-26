/**
 * CoBuddy Companion — Requests API Service
 * Wraps all /companion/requests/* endpoints.
 * DTOs verified against requests.controller.ts
 */

import { apiGet, apiPost } from '../client';
import { Endpoints, buildPath } from '../endpoints';
import type { BookingRequest } from '../../../store/types/store.types';

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface ListRequestsParams {
  status?: 'all' | 'pending' | 'expired' | 'counter_proposed';
  categories?: string;        // comma-separated
  minEarning?: number;
  sortBy?: 'newest' | 'expiring_soon' | 'highest_earning';
  page?: number;
  limit?: number;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface DeclineRequestDto {
  reason: string;
}

export interface CounterProposeDto {
  newStart: string;           // ISO datetime
  newEnd: string;             // ISO datetime
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface ListRequestsResponse {
  requests: BookingRequest[];
  total: number;
  page: number;
  hasMore: boolean;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const RequestsService = {
  /** GET /companion/requests */
  listRequests: (params?: ListRequestsParams): Promise<ListRequestsResponse> => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.categories) query.set('categories', params.categories);
    if (params?.minEarning !== undefined) query.set('minEarning', String(params.minEarning));
    if (params?.sortBy) query.set('sortBy', params.sortBy);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return apiGet<ListRequestsResponse>(`${Endpoints.REQUESTS.LIST}${qs ? `?${qs}` : ''}`);
  },

  /** GET /companion/requests/:requestId */
  getDetail: (requestId: string): Promise<BookingRequest> =>
    apiGet<BookingRequest>(buildPath(Endpoints.REQUESTS.DETAIL, { requestId })),

  /** GET /companion/requests/:requestId/customer-trust */
  getCustomerTrust: (requestId: string) =>
    apiGet(buildPath(Endpoints.REQUESTS.CUSTOMER_TRUST, { requestId })),

  /** POST /companion/requests/:requestId/accept */
  acceptRequest: (requestId: string) =>
    apiPost(buildPath(Endpoints.REQUESTS.ACCEPT, { requestId }), {}),

  /** POST /companion/requests/:requestId/decline */
  declineRequest: (requestId: string, dto: DeclineRequestDto) =>
    apiPost(buildPath(Endpoints.REQUESTS.DECLINE, { requestId }), dto),

  /** POST /companion/requests/:requestId/counter */
  counterPropose: (requestId: string, dto: CounterProposeDto) =>
    apiPost(buildPath(Endpoints.REQUESTS.COUNTER_PROPOSE, { requestId }), dto),
};
