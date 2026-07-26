/**
 * CoBuddy Companion — Sessions API Service
 * Wraps all /companion/sessions/* endpoints.
 * DTOs verified against sessions.controller.ts
 */

import { apiGet, apiPost } from '../client';
import { Endpoints, buildPath } from '../endpoints';
import type { Session } from '../../../store/types/store.types';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface VerifyCustomerDto {
  passCode: string;           // e.g. "AR-642"
}

export interface ExtendSessionDto {
  extraMinutes: number;       // 30–180
}

export interface EndEarlyDto {
  reason?: string;
}

export interface CancelSessionDto {
  reason: string;             // 'Personal emergency' | 'Health issue' | 'Transport problem' | 'Other'
  details?: string;           // free-text max 500 chars
}

export interface SessionNotesDto {
  notes: string;
  isPrivate?: boolean;
}

export interface RateCustomerDto {
  rating: number;             // 1–5
  highlights?: string[];      // e.g. ['Respectful', 'Punctual']
  comment?: string;
  isPublic?: boolean;
}

export interface LocationUpdateDto {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface ChatMessageDto {
  message: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const SessionsService = {
  /** GET /companion/sessions/upcoming */
  getUpcoming: (): Promise<Session[]> =>
    apiGet<Session[]>(Endpoints.SESSIONS.LIST_UPCOMING),

  /** GET /companion/sessions/history */
  getHistory: (page = 1, limit = 20): Promise<Session[]> =>
    apiGet<Session[]>(`${Endpoints.SESSIONS.LIST_HISTORY}?page=${page}&limit=${limit}`),

  /** GET /companion/sessions/:sessionId */
  getDetail: (sessionId: string): Promise<Session> =>
    apiGet<Session>(buildPath(Endpoints.SESSIONS.DETAIL, { sessionId })),

  /** GET /companion/sessions/:sessionId/pass */
  getSessionPass: (sessionId: string) =>
    apiGet(buildPath(Endpoints.SESSIONS.SESSION_PASS, { sessionId })),

  /** POST /companion/sessions/:sessionId/checkin */
  checkIn: (sessionId: string) =>
    apiPost(buildPath(Endpoints.SESSIONS.CHECK_IN, { sessionId }), {}),

  /** POST /companion/sessions/:sessionId/verify-customer */
  verifyCustomer: (sessionId: string, dto: VerifyCustomerDto) =>
    apiPost(buildPath(Endpoints.SESSIONS.VERIFY_CUSTOMER, { sessionId }), dto),

  /** POST /companion/sessions/:sessionId/verify-selfie */
  verifySelfie: (sessionId: string, formData: FormData) =>
    apiPost(buildPath(Endpoints.SESSIONS.VERIFY_SELFIE, { sessionId }), formData),

  /** POST /companion/sessions/:sessionId/extend/request */
  requestExtension: (sessionId: string, dto: ExtendSessionDto) =>
    apiPost(buildPath(Endpoints.SESSIONS.EXTEND_REQUEST, { sessionId }), dto),

  /** POST /companion/sessions/:sessionId/extend/confirm */
  confirmExtension: (sessionId: string, dto: ExtendSessionDto) =>
    apiPost(buildPath(Endpoints.SESSIONS.EXTEND_CONFIRM, { sessionId }), dto),

  /** POST /companion/sessions/:sessionId/end-early */
  endEarly: (sessionId: string, dto?: EndEarlyDto) =>
    apiPost(buildPath(Endpoints.SESSIONS.EARLY_END, { sessionId }), dto ?? {}),

  /** POST /companion/sessions/:sessionId/cancel */
  cancelSession: (sessionId: string, dto: CancelSessionDto) =>
    apiPost(buildPath(Endpoints.SESSIONS.CANCEL, { sessionId }), dto),

  /** GET /companion/sessions/:sessionId/cancellation-status */
  getCancellationStatus: (sessionId: string) =>
    apiGet(buildPath(Endpoints.SESSIONS.CANCELLATION_STATUS, { sessionId })),

  /** POST /companion/sessions/:sessionId/no-show */
  markNoShow: (sessionId: string) =>
    apiPost(buildPath(Endpoints.SESSIONS.NO_SHOW, { sessionId }), {}),

  /** POST /companion/sessions/:sessionId/complete */
  completeSession: (sessionId: string) =>
    apiPost(buildPath(Endpoints.SESSIONS.COMPLETE, { sessionId }), {}),

  /** POST /companion/sessions/:sessionId/notes */
  saveNotes: (sessionId: string, dto: SessionNotesDto) =>
    apiPost(buildPath(Endpoints.SESSIONS.POST_NOTES, { sessionId }), dto),

  /** POST /companion/sessions/:sessionId/rate-customer */
  rateCustomer: (sessionId: string, dto: RateCustomerDto) =>
    apiPost(buildPath(Endpoints.SESSIONS.RATE_CUSTOMER, { sessionId }), dto),

  /** GET /companion/sessions/:sessionId/chat */
  getChatHistory: (sessionId: string) =>
    apiGet(buildPath(Endpoints.SESSIONS.CHAT_GET, { sessionId })),

  /** POST /companion/sessions/:sessionId/chat */
  sendChatMessage: (sessionId: string, dto: ChatMessageDto) =>
    apiPost(buildPath(Endpoints.SESSIONS.CHAT_SEND, { sessionId }), dto),

  /** POST /companion/sessions/:sessionId/call/token */
  getCallToken: (sessionId: string) =>
    apiPost(buildPath(Endpoints.SESSIONS.CALL_TOKEN, { sessionId }), {}),

  /** POST /companion/sessions/:sessionId/location */
  updateLocation: (sessionId: string, dto: LocationUpdateDto) =>
    apiPost(buildPath(Endpoints.SESSIONS.UPDATE_LOCATION, { sessionId }), dto),

  /** POST /companion/sessions/:sessionId/location/stop */
  stopLocationSharing: (sessionId: string) =>
    apiPost(buildPath(Endpoints.SESSIONS.STOP_LOCATION, { sessionId }), {}),
};
