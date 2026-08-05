/**
 * CoBuddy Companion — Safety, Support, Notifications, Training, Availability
 * All remaining API services in one barrel.
 */

export * from './kyc.service';
export * from './profile.service';
export * from './sessions.service';
export * from './requests.service';
export * from './earnings.service';
export * from './uploads.service';
export * from './availability.service';

import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../client';
import { Endpoints, buildPath } from '../endpoints';
import type { TrustedContact, AppNotification } from '../../../store/types/store.types';

// NotificationsService is declared above (lines 21-39)

// ═══════════════════════════════════════════════════════════════// ═══════════════════════════════════════════════════════════════
// SAFETY SERVICE
// ═══════════════════════════════════════════════════════════════
export interface SosTriggerDto {
  sessionId?: string;
  location?: { latitude: number; longitude: number };
  message?: string;
}

export interface SafetyTimerStartDto {
  durationMinutes: number;
  sessionId?: string;
}

export interface AddTrustedContactDto {
  name: string;
  phone: string;
  relationship: string;
  isEmergencyContact?: boolean;
}

export interface IncidentReportDto {
  sessionId?: string;
  description: string;
  category: string;
}

export const SafetyService = {
  triggerSos: (dto: SosTriggerDto) =>
    apiPost(Endpoints.SAFETY.SOS_TRIGGER, dto),

  resolveSos: (dto?: { resolution?: string }) =>
    apiPost(Endpoints.SAFETY.SOS_RESOLVE, dto ?? {}),

  startTimer: (dto: SafetyTimerStartDto) =>
    apiPost(Endpoints.SAFETY.TIMER_START, dto),

  checkinTimer: () =>
    apiPost(Endpoints.SAFETY.TIMER_CHECKIN, {}),

  cancelTimer: () =>
    apiPost(Endpoints.SAFETY.TIMER_CANCEL, {}),

  getSettings: () =>
    apiGet(Endpoints.SAFETY.GET_SETTINGS),

  updateSettings: (dto: Record<string, unknown>) =>
    apiPut(Endpoints.SAFETY.UPDATE_SETTINGS, dto),

  getTrustedContacts: (): Promise<TrustedContact[]> =>
    apiGet<TrustedContact[]>(Endpoints.SAFETY.TRUSTED_CONTACTS),

  addTrustedContact: (dto: AddTrustedContactDto) =>
    apiPost(Endpoints.SAFETY.TRUSTED_ADD, dto),

  updateTrustedContact: (contactId: string, dto: Partial<AddTrustedContactDto>) =>
    apiPut(buildPath(Endpoints.SAFETY.TRUSTED_UPDATE, { contactId }), dto),

  deleteTrustedContact: (contactId: string) =>
    apiDelete(buildPath(Endpoints.SAFETY.TRUSTED_DELETE, { contactId })),

  blockCustomer: (customerId: string, dto: { reason: string }) =>
    apiPost(buildPath(Endpoints.SAFETY.BLOCK_CUSTOMER, { customerId }), dto),

  reportCustomer: (customerId: string, dto: { reason: string; details?: string }) =>
    apiPost(buildPath(Endpoints.SAFETY.REPORT_CUSTOMER, { customerId }), dto),

  fileIncident: (dto: IncidentReportDto) =>
    apiPost(Endpoints.SAFETY.INCIDENT_REPORT, dto),

  addIncidentEvidence: (reportId: string, formData: FormData) =>
    apiPost(buildPath(Endpoints.SAFETY.INCIDENT_EVIDENCE, { reportId }), formData),

  completeQuiz: (dto: { score: number; answers?: unknown[] }) =>
    apiPost(Endpoints.SAFETY.QUIZ_COMPLETE, dto),
};

// ═══════════════════════════════════════════════════════════════
// SUPPORT SERVICE
// ═══════════════════════════════════════════════════════════════
export interface CreateTicketDto {
  category: string;
  subject: string;
  description: string;
  sessionId?: string;
}

export interface FileDisputeDto {
  sessionId?: string;
  reason: string;
  description: string;
  requestedAmount?: number;
}

export const SupportService = {
  getTickets: () =>
    apiGet(Endpoints.SUPPORT.TICKETS),

  getTicketDetail: (ticketId: string) =>
    apiGet(buildPath(Endpoints.SUPPORT.TICKET_DETAIL, { ticketId })),

  createTicket: (dto: CreateTicketDto) =>
    apiPost(Endpoints.SUPPORT.CREATE_TICKET, dto),

  getChatHistory: (ticketId: string) =>
    apiGet(buildPath(Endpoints.SUPPORT.CHAT_HISTORY, { ticketId })),

  sendMessage: (ticketId: string, message: string) =>
    apiPost(buildPath(Endpoints.SUPPORT.SEND_MESSAGE, { ticketId }), { message }),

  getDisputes: () =>
    apiGet(Endpoints.SUPPORT.DISPUTES),

  getDisputeDetail: (disputeId: string) =>
    apiGet(buildPath(Endpoints.SUPPORT.DISPUTE_DETAIL, { disputeId })),

  fileDispute: (dto: FileDisputeDto) =>
    apiPost(Endpoints.SUPPORT.FILE_DISPUTE, dto),

  appealDispute: (disputeId: string, dto: { reason: string }) =>
    apiPost(buildPath(Endpoints.SUPPORT.APPEAL, { disputeId }), dto),

  uploadDisputeEvidence: (disputeId: string, formData: FormData) =>
    apiPost(buildPath(Endpoints.SUPPORT.DISPUTE_EVIDENCE, { disputeId }), formData),

  getHelpCategories: () =>
    apiGet(Endpoints.SUPPORT.HELP_CATEGORIES),

  getHelpArticle: (articleId: string) =>
    apiGet(buildPath(Endpoints.SUPPORT.HELP_ARTICLE, { articleId })),
};

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS SERVICE
// ═══════════════════════════════════════════════════════════════
export const NotificationsService = {
  getAll: (): Promise<AppNotification[]> =>
    apiGet<AppNotification[]>(Endpoints.NOTIFICATIONS.LIST),

  getUnreadCount: (): Promise<{ count: number }> =>
    apiGet<{ count: number }>(Endpoints.NOTIFICATIONS.UNREAD_COUNT),

  markRead: (notificationId: string) =>
    apiPut(buildPath(Endpoints.NOTIFICATIONS.MARK_READ, { notificationId }), {}),

  markAllRead: () =>
    apiPut(Endpoints.NOTIFICATIONS.MARK_ALL_READ, {}),

  getAnnouncements: () =>
    apiGet(Endpoints.NOTIFICATIONS.ANNOUNCEMENTS),

  registerPushToken: (token: string, platform: 'ios' | 'android') =>
    apiPost(Endpoints.NOTIFICATIONS.PUSH_TOKEN, { token, platform }),
};

// ═══════════════════════════════════════════════════════════════
// TRAINING SERVICE
// ═══════════════════════════════════════════════════════════════
export const TrainingService = {
  getModules: () =>
    apiGet(Endpoints.TRAINING.LIST),

  getModule: (moduleId: string) =>
    apiGet(buildPath(Endpoints.TRAINING.LESSON, { moduleId })),

  completeModule: (moduleId: string, dto?: { score?: number; timeTakenSeconds?: number }) =>
    apiPost(buildPath(Endpoints.TRAINING.COMPLETE_LESSON, { moduleId }), dto ?? {}),
};

// ═══════════════════════════════════════════════════════════════
// REVIEWS SERVICE
// ═══════════════════════════════════════════════════════════════
export const ReviewsService = {
  getReviews: () =>
    apiGet(Endpoints.REVIEWS.LIST),

  getReviewDetail: (reviewId: string) =>
    apiGet(buildPath(Endpoints.REVIEWS.DETAIL, { reviewId })),

  reportReview: (reviewId: string, dto: { reason: string }) =>
    apiPost(buildPath(Endpoints.REVIEWS.REPORT, { reviewId }), dto),

  replyToReview: (reviewId: string, dto: { reply: string }) =>
    apiPost(buildPath(Endpoints.REVIEWS.REPLY, { reviewId }), dto),

  getTrustScore: () =>
    apiGet(Endpoints.REVIEWS.TRUST_SCORE),

  getTrustTasks: () =>
    apiGet(Endpoints.REVIEWS.TRUST_TASKS),

  getBadges: () =>
    apiGet(Endpoints.REVIEWS.BADGES),
};

// UploadsService is exported from ./uploads.service.ts

// ═══════════════════════════════════════════════════════════════
// DASHBOARD SERVICE
// ═══════════════════════════════════════════════════════════════
export const DashboardService = {
  getDashboard: () => apiGet(Endpoints.DASHBOARD.GET),
};

// Re-export services
export * from './auth.service';
export * from './availability.service';
export * from './earnings.service';
export * from './sessions.service';
export * from './settings.service';