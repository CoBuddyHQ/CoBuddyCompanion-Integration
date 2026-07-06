/**
 * CoBuddy Companion App — API Endpoints
 * All API endpoint path constants.
 * NO business logic in this file — path strings only.
 * Base URL is injected by client.ts via environment config.
 */

export const Endpoints = {
  // ── Auth ────────────────────────────────────────────────────────────────────
  AUTH: {
    SEND_OTP:          '/auth/companion/otp/send',
    VERIFY_OTP:        '/auth/companion/otp/verify',
    REFRESH_TOKEN:     '/auth/companion/token/refresh',
    LOGOUT:            '/auth/companion/logout',
    SET_PIN:           '/auth/companion/pin/set',
    VERIFY_PIN:        '/auth/companion/pin/verify',
    BIOMETRIC_ENROLL:  '/auth/companion/biometric/enroll',
  },

  // ── Profile ──────────────────────────────────────────────────────────────────
  PROFILE: {
    GET:               '/companion/profile',
    UPDATE_BASIC:      '/companion/profile/basic',
    UPDATE_BIO:        '/companion/profile/bio',
    UPDATE_CATEGORIES: '/companion/profile/categories',
    UPDATE_LANGUAGES:  '/companion/profile/languages',
    UPDATE_AREAS:      '/companion/profile/service-areas',
    UPDATE_PRICING:    '/companion/profile/pricing',
    UPDATE_PHOTOS:     '/companion/profile/photos',
    REORDER_PHOTOS:    '/companion/profile/photos/reorder',
    UPDATE_AVAILABILITY_TOGGLE: '/companion/profile/availability',
    SUBMIT_FOR_REVIEW: '/companion/profile/submit',
    PREVIEW:           '/companion/profile/preview',
  },

  // ── KYC / Application ────────────────────────────────────────────────────────
  KYC: {
    SAVE_DRAFT:         '/companion/application/draft',
    UPLOAD_GOVERNMENT_ID: '/companion/kyc/government-id',
    UPLOAD_SELFIE:      '/companion/kyc/selfie',
    UPLOAD_ADDRESS:     '/companion/kyc/address',
    SAVE_PAN:           '/companion/kyc/pan',
    SAVE_BANK:          '/companion/kyc/bank',
    VERIFY_BANK:        '/companion/kyc/bank/verify',
    SAVE_UPI:           '/companion/kyc/upi',
    SAVE_EMERGENCY:     '/companion/kyc/emergency-contact',
    SAVE_DECLARATION:   '/companion/kyc/declaration',
    SUBMIT:             '/companion/kyc/submit',
    STATUS:             '/companion/kyc/status',
    RESUBMIT:           '/companion/kyc/resubmit',
  },

  // ── Availability ─────────────────────────────────────────────────────────────
  AVAILABILITY: {
    GET_SLOTS:         '/companion/availability/slots',
    ADD_SLOT:          '/companion/availability/slots/add',
    UPDATE_SLOT:       '/companion/availability/slots/:slotId',
    DELETE_SLOT:       '/companion/availability/slots/:slotId',
    ADD_RECURRING:     '/companion/availability/recurring/add',
    BLOCK_TIME:        '/companion/availability/block',
    VACATION_MODE:     '/companion/availability/vacation',
  },

  // ── Requests ─────────────────────────────────────────────────────────────────
  REQUESTS: {
    LIST:              '/companion/requests',
    DETAIL:            '/companion/requests/:requestId',
    CUSTOMER_TRUST:    '/companion/requests/:requestId/customer-trust',
    ACCEPT:            '/companion/requests/:requestId/accept',
    DECLINE:           '/companion/requests/:requestId/decline',
    COUNTER_PROPOSE:   '/companion/requests/:requestId/counter',
  },

  // ── Sessions ──────────────────────────────────────────────────────────────────
  SESSIONS: {
    LIST_UPCOMING:     '/companion/sessions/upcoming',
    LIST_HISTORY:      '/companion/sessions/history',
    DETAIL:            '/companion/sessions/:sessionId',
    SESSION_PASS:      '/companion/sessions/:sessionId/pass',
    CHECK_IN:          '/companion/sessions/:sessionId/checkin',
    VERIFY_CUSTOMER:   '/companion/sessions/:sessionId/verify-customer',
    EXTEND_REQUEST:    '/companion/sessions/:sessionId/extend/request',
    EXTEND_CONFIRM:    '/companion/sessions/:sessionId/extend/confirm',
    EARLY_END:         '/companion/sessions/:sessionId/end-early',
    CANCEL:            '/companion/sessions/:sessionId/cancel',
    NO_SHOW:           '/companion/sessions/:sessionId/no-show',
    COMPLETE:          '/companion/sessions/:sessionId/complete',
    POST_NOTES:        '/companion/sessions/:sessionId/notes',
    RATE_CUSTOMER:     '/companion/sessions/:sessionId/rate-customer',
  },

  // ── Safety ───────────────────────────────────────────────────────────────────
  SAFETY: {
    SOS_TRIGGER:       '/companion/safety/sos/trigger',
    SOS_RESOLVE:       '/companion/safety/sos/resolve',
    TIMER_START:       '/companion/safety/timer/start',
    TIMER_CHECKIN:     '/companion/safety/timer/checkin',
    TIMER_CANCEL:      '/companion/safety/timer/cancel',
    TRUSTED_CONTACTS:  '/companion/safety/trusted-contacts',
    TRUSTED_ADD:       '/companion/safety/trusted-contacts/add',
    TRUSTED_UPDATE:    '/companion/safety/trusted-contacts/:contactId',
    TRUSTED_DELETE:    '/companion/safety/trusted-contacts/:contactId',
    BLOCK_CUSTOMER:    '/companion/safety/block/:customerId',
    REPORT_CUSTOMER:   '/companion/safety/report/:customerId',
    INCIDENT_REPORT:   '/companion/safety/incident',
    INCIDENT_EVIDENCE: '/companion/safety/incident/:reportId/evidence',
  },

  // ── Earnings ─────────────────────────────────────────────────────────────────
  EARNINGS: {
    SUMMARY:           '/companion/earnings/summary',
    TRANSACTIONS:      '/companion/earnings/transactions',
    TRANSACTION_DETAIL:'/companion/earnings/transactions/:transactionId',
    PAYOUT_REQUEST:    '/companion/earnings/payout/request',
    PAYOUT_HISTORY:    '/companion/earnings/payout/history',
    PAYOUT_DETAIL:     '/companion/earnings/payout/:payoutId',
    INVOICE_LIST:      '/companion/earnings/invoices',
    INVOICE_DETAIL:    '/companion/earnings/invoices/:invoiceId',
  },

  // ── Reviews & Trust ──────────────────────────────────────────────────────────
  REVIEWS: {
    LIST:              '/companion/reviews',
    DETAIL:            '/companion/reviews/:reviewId',
    TRUST_SCORE:       '/companion/trust/score',
    TRUST_TASKS:       '/companion/trust/tasks',
    BADGES:            '/companion/trust/badges',
  },

  // ── Training ─────────────────────────────────────────────────────────────────
  TRAINING: {
    HUB:               '/companion/training',
    LESSON:            '/companion/training/:moduleId',
    COMPLETE_LESSON:   '/companion/training/:moduleId/complete',
  },

  // ── Support ───────────────────────────────────────────────────────────────────
  SUPPORT: {
    TICKETS:           '/companion/support/tickets',
    TICKET_DETAIL:     '/companion/support/tickets/:ticketId',
    CREATE_TICKET:     '/companion/support/tickets/create',
    CHAT_HISTORY:      '/companion/support/chat/:ticketId',
    HELP_ARTICLES:     '/companion/support/help',
    HELP_ARTICLE:      '/companion/support/help/:articleId',
    DISPUTES:          '/companion/support/disputes',
    DISPUTE_DETAIL:    '/companion/support/disputes/:disputeId',
    APPEAL:            '/companion/support/disputes/:disputeId/appeal',
  },

  // ── Account & Settings ────────────────────────────────────────────────────────
  ACCOUNT: {
    SETTINGS:          '/companion/account/settings',
    NOTIFICATION_PREFS:'/companion/account/notification-preferences',
    PRIVACY_CONTROLS:  '/companion/account/privacy',
    LANGUAGE:          '/companion/account/language',
    DEACTIVATE:        '/companion/account/deactivate',
    REACTIVATE:        '/companion/account/reactivate',
    DELETE:            '/companion/account/delete',
    DATA_EXPORT:       '/companion/account/data-export',
  },

  // ── Notifications ─────────────────────────────────────────────────────────────
  NOTIFICATIONS: {
    LIST:              '/companion/notifications',
    MARK_READ:         '/companion/notifications/:notificationId/read',
    MARK_ALL_READ:     '/companion/notifications/read-all',
    ANNOUNCEMENTS:     '/companion/notifications/announcements',
  },
} as const;

/**
 * Utility — interpolate a path template with params.
 * Usage: buildPath(Endpoints.SESSIONS.DETAIL, { sessionId: 'CB-SE-2048' })
 * → '/companion/sessions/CB-SE-2048'
 */
export function buildPath(
  template: string,
  params: Record<string, string>,
): string {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, encodeURIComponent(value)),
    template,
  );
}
