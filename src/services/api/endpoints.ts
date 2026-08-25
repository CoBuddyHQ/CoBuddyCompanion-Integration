/**
 * CoBuddy Companion App — API Endpoints
 * ✅ 100% verified against NestJS backend controllers.
 * ✅ Every path matches exact @Controller prefix + @Get/@Post/@Put/@Patch/@Delete route.
 *
 * Backend: http://localhost:4001
 * Global prefix (main.ts line 30): app.setGlobalPrefix('api/v1')
 * → Actual URLs: http://localhost:4001/api/v1/companion/...
 *
 * ⚠️ Android Device: replace localhost with PC IP (same Wi-Fi)
 *    e.g. BASE_URL = 'http://192.168.1.10:4001/api/v1'
 *
 * NO business logic in this file — path strings only.
 * Base URL is injected by client.ts via environment config.
 */

export const Endpoints = {

  // ═══════════════════════════════════════════════════════════════════
  // AUTH — @Controller('auth/companion')
  // ═══════════════════════════════════════════════════════════════════
  AUTH: {
    SEND_OTP:         '/auth/companion/otp/send',        // POST
    VERIFY_OTP:       '/auth/companion/otp/verify',      // POST → {accessToken, refreshToken, companionId, authStatus}
    REFRESH_TOKEN:    '/auth/companion/token/refresh',   // POST → {accessToken}
    LOGOUT:           '/auth/companion/logout',          // POST
    SET_PIN:          '/auth/companion/pin/set',         // POST
    VERIFY_PIN:       '/auth/companion/pin/verify',      // POST
    BIOMETRIC_ENROLL: '/auth/companion/biometric/enroll',// POST
  },

  // ═══════════════════════════════════════════════════════════════════
  // PROFILE — @Controller('companion/profile')
  // ═══════════════════════════════════════════════════════════════════
  PROFILE: {
    GET:                       '/companion/profile',                 // GET
    UPDATE_PHOTO:              '/companion/profile/photo',           // PUT (single photo)
    UPDATE_PHOTOS:             '/companion/profile/photos',          // PUT (gallery)
    UPDATE_WORK_PREF:          '/companion/profile/work-preference', // PUT
    UPDATE_COMM_ACTIVITY:      '/companion/profile/comm-activity',   // PUT
    UPDATE_INTERESTS:          '/companion/profile/interests',       // PUT
    UPDATE_VENUES:             '/companion/profile/venues',          // PUT
    UPDATE_BOUNDARIES:         '/companion/profile/boundaries',      // PUT
    SETUP_BULK:                '/companion/profile/setup-bulk',      // POST (onboarding bulk save)
    UPDATE_BASIC:              '/companion/profile/basic',           // PUT
    UPDATE_BIO:                '/companion/profile/bio',             // PUT
    UPDATE_CATEGORIES:         '/companion/profile/categories',      // PUT
    UPDATE_LANGUAGES:          '/companion/profile/languages',       // PUT
    UPDATE_AREAS:              '/companion/profile/service-areas',   // PUT
    UPDATE_PRICING:            '/companion/profile/pricing',         // PUT
    REORDER_PHOTOS:            '/companion/profile/photos/reorder',  // PUT
    UPDATE_AVAILABILITY_TOGGLE:'/companion/profile/availability',    // PUT {isAvailable: bool}
    SUBMIT_FOR_REVIEW:         '/companion/profile/submit',          // POST
    PREVIEW:                   '/companion/profile/preview',         // GET
    GET_TRUST:                 '/companion/profile/trust',           // GET
    COMPLETE_TRUST_TASK:       '/companion/profile/trust/task',      // POST
  },

  // ═══════════════════════════════════════════════════════════════════
  // KYC — @Controller() with absolute paths (global prefix still applies)
  // Actual URLs: /api/v1/companion/kyc/...
  // ═══════════════════════════════════════════════════════════════════
  KYC: {
    BASIC_DETAILS:          '/companion/kyc/basic-details',       // POST
    STATUS:                 '/companion/kyc/status',              // GET
    SAVE_DRAFT:             '/companion/application/draft',       // POST
    SET_GOVERNMENT_ID_TYPE: '/companion/kyc/government-id-type',  // POST
    UPLOAD_GOVERNMENT_ID:   '/companion/kyc/government-id',       // POST
    UPLOAD_SELFIE:          '/companion/kyc/selfie',              // POST
    SAVE_ADDRESS:           '/companion/kyc/address',             // POST
    SAVE_PAN:               '/companion/kyc/pan',                 // POST
    SAVE_BANK:              '/companion/kyc/bank',                // POST
    VERIFY_BANK:            '/companion/kyc/bank/verify',         // POST
    SAVE_UPI:               '/companion/kyc/upi',                 // POST
    SAVE_EMERGENCY:         '/companion/kyc/emergency-contact',   // POST
    SAVE_DECLARATION:       '/companion/kyc/declaration',         // POST
    SUBMIT:                 '/companion/kyc/submit',              // POST
    RESUBMIT:               '/companion/kyc/resubmit',            // POST
    ACCEPT_TERMS:           '/companion/onboarding/terms/accept', // POST
  },

  // ═══════════════════════════════════════════════════════════════════
  // AVAILABILITY — @Controller('companion/availability')
  // ═══════════════════════════════════════════════════════════════════
  AVAILABILITY: {
    GET:               '/companion/availability',                      // GET (returns full schedule)
    SET_LIVE:          '/companion/availability/live',                 // PUT {isAvailable: boolean}
    VACATION:          '/companion/availability/vacation',             // PUT {enabled, awayFrom, returnOn}
    WEEKLY_DAY_TOGGLE: '/companion/availability/weekly/:day/toggle',   // PUT — toggle day on/off
    WEEKLY_DAY_TIMES:  '/companion/availability/weekly/:day/times',    // PUT {startTime, endTime}
    OVERRIDE_ADD:      '/companion/availability/overrides',            // POST
    OVERRIDE_DELETE:   '/companion/availability/overrides/:id',        // DELETE
    SLOT_ADD:          '/companion/availability/slots',                // POST
    SLOT_UPDATE:       '/companion/availability/slots/:id',            // PUT
    SLOT_DELETE:       '/companion/availability/slots/:id',            // DELETE
  },

  // ═══════════════════════════════════════════════════════════════════
  // REQUESTS — @Controller('companion/requests')
  // ═══════════════════════════════════════════════════════════════════
  REQUESTS: {
    LIST:            '/companion/requests',                             // GET
    DETAIL:          '/companion/requests/:requestId',                  // GET
    CUSTOMER_TRUST:  '/companion/requests/:requestId/customer-trust',   // GET
    ACCEPT:          '/companion/requests/:requestId/accept',           // POST
    DECLINE:         '/companion/requests/:requestId/decline',          // POST
    COUNTER_PROPOSE: '/companion/requests/:requestId/counter',          // POST
  },

  // ═══════════════════════════════════════════════════════════════════
  // SESSIONS — @Controller('companion/sessions')
  // ═══════════════════════════════════════════════════════════════════
  SESSIONS: {
    LIST_UPCOMING:        '/companion/sessions/upcoming',                     // GET
    LIST_HISTORY:         '/companion/sessions/history',                      // GET
    DETAIL:               '/companion/sessions/:sessionId',                   // GET
    SESSION_PASS:         '/companion/sessions/:sessionId/pass',              // GET
    CHECK_IN:             '/companion/sessions/:sessionId/checkin',           // POST
    VERIFY_CUSTOMER:      '/companion/sessions/:sessionId/verify-customer',   // POST
    VERIFY_SELFIE:        '/companion/sessions/:sessionId/verify-selfie',     // POST
    EXTEND_REQUEST:       '/companion/sessions/:sessionId/extend/request',    // POST
    EXTEND_CONFIRM:       '/companion/sessions/:sessionId/extend/confirm',    // POST
    EARLY_END:            '/companion/sessions/:sessionId/end-early',         // POST
    CANCEL:               '/companion/sessions/:sessionId/cancel',            // POST
    CANCELLATION_STATUS:  '/companion/sessions/:sessionId/cancellation-status',// GET
    NO_SHOW:              '/companion/sessions/:sessionId/no-show',           // POST
    COMPLETE:             '/companion/sessions/:sessionId/complete',          // POST
    POST_NOTES:           '/companion/sessions/:sessionId/notes',             // POST
    RATE_CUSTOMER:        '/companion/sessions/:sessionId/rate-customer',     // POST
    CHAT_GET:             '/companion/sessions/:sessionId/chat',              // GET
    CHAT_SEND:            '/companion/sessions/:sessionId/chat',              // POST
    CALL_TOKEN:           '/companion/sessions/:sessionId/call/token',        // POST
    UPDATE_LOCATION:      '/companion/sessions/:sessionId/location',          // POST
    STOP_LOCATION:        '/companion/sessions/:sessionId/location/stop',     // POST
  },

  // ═══════════════════════════════════════════════════════════════════
  // SAFETY — @Controller('companion/safety')
  // ═══════════════════════════════════════════════════════════════════
  SAFETY: {
    SOS_TRIGGER:       '/companion/safety/sos/trigger',                        // POST
    SOS_RESOLVE:       '/companion/safety/sos/resolve',                        // POST
    TIMER_START:       '/companion/safety/timer/start',                        // POST
    TIMER_CHECKIN:     '/companion/safety/timer/checkin',                      // POST
    TIMER_CANCEL:      '/companion/safety/timer/cancel',                       // POST
    GET_SETTINGS:      '/companion/safety/settings',                           // GET
    UPDATE_SETTINGS:   '/companion/safety/settings',                           // PUT
    TRUSTED_CONTACTS:  '/companion/safety/trusted-contacts',                   // GET
    TRUSTED_ADD:       '/companion/safety/trusted-contacts/add',               // POST
    TRUSTED_UPDATE:    '/companion/safety/trusted-contacts/:contactId',        // PUT
    TRUSTED_DELETE:    '/companion/safety/trusted-contacts/:contactId',        // DELETE
    BLOCK_CUSTOMER:    '/companion/safety/block/:customerId',                  // POST
    REPORT_CUSTOMER:   '/companion/safety/report/:customerId',                 // POST
    INCIDENT_REPORT:   '/companion/safety/incident',                           // POST
    INCIDENT_EVIDENCE: '/companion/safety/incident/:reportId/evidence',        // POST
    QUIZ_COMPLETE:     '/companion/safety/quiz/complete',                      // POST
  },

  // ═══════════════════════════════════════════════════════════════════
  // EARNINGS — @Controller('companion/earnings')
  // ═══════════════════════════════════════════════════════════════════
  EARNINGS: {
    SUMMARY:            '/companion/earnings/summary',                        // GET
    TRANSACTIONS:       '/companion/earnings/transactions',                   // GET
    TRANSACTION_DETAIL: '/companion/earnings/transactions/:transactionId',    // GET
    PAYOUT_HISTORY:     '/companion/earnings/payout/history',                 // GET
    PAYOUT_REQUEST:     '/companion/earnings/payout/request',                 // POST
    PAYOUT_DETAIL:      '/companion/earnings/payout/:payoutId',               // GET
    INVOICE_LIST:       '/companion/earnings/invoices',                       // GET
    INVOICE_DETAIL:     '/companion/earnings/invoices/:invoiceId',            // GET
    WEEKLY:             '/companion/earnings/weekly',                         // GET
    DAILY:              '/companion/earnings/daily',                          // GET
    PENDING:            '/companion/earnings/pending',                        // GET
  },

  // ═══════════════════════════════════════════════════════════════════
  // REVIEWS & TRUST — @Controller('companion')
  // ═══════════════════════════════════════════════════════════════════
  REVIEWS: {
    LIST:        '/companion/reviews',                     // GET
    DETAIL:      '/companion/reviews/:reviewId',           // GET
    REPORT:      '/companion/reviews/:reviewId/report',    // POST
    REPLY:       '/companion/reviews/:reviewId/reply',     // POST
    TRUST_SCORE: '/companion/trust/score',                 // GET
    TRUST_TASKS: '/companion/trust/tasks',                 // GET
    BADGES:      '/companion/trust/badges',               // GET
  },

  // ═══════════════════════════════════════════════════════════════════
  // TRAINING — @Controller('companion/training')
  // ═══════════════════════════════════════════════════════════════════
  TRAINING: {
    LIST:            '/companion/training/modules',                    // GET
    LESSON:          '/companion/training/modules/:moduleId',          // GET
    COMPLETE_LESSON: '/companion/training/modules/:moduleId/complete', // POST
  },

  // ═══════════════════════════════════════════════════════════════════
  // SUPPORT — @Controller('companion/support')
  // ═══════════════════════════════════════════════════════════════════
  SUPPORT: {
    TICKETS:          '/companion/support/tickets',                          // GET
    TICKET_DETAIL:    '/companion/support/tickets/:ticketId',                // GET
    CREATE_TICKET:    '/companion/support/tickets/create',                   // POST
    CHAT_HISTORY:     '/companion/support/chat/:ticketId',                   // GET
    SEND_MESSAGE:     '/companion/support/tickets/:ticketId/messages',       // POST
    DISPUTES:         '/companion/support/disputes',                         // GET
    DISPUTE_DETAIL:   '/companion/support/disputes/:disputeId',              // GET
    FILE_DISPUTE:     '/companion/support/disputes',                         // POST (same path, different method)
    APPEAL:           '/companion/support/disputes/:disputeId/appeal',       // POST
    DISPUTE_EVIDENCE: '/companion/support/disputes/:disputeId/evidence',     // POST
    HELP_CATEGORIES:  '/companion/support/help/categories',                  // GET
    HELP_ARTICLE:     '/companion/support/help/:articleId',                  // GET
  },

  // ═══════════════════════════════════════════════════════════════════
  // ACCOUNT — @Controller('companion/account')
  // ═══════════════════════════════════════════════════════════════════
  ACCOUNT: {
    SETTINGS:           '/companion/account/settings',                      // GET
    NOTIFICATION_PREFS: '/companion/account/notification-preferences',      // PUT
    PRIVACY_CONTROLS:   '/companion/account/privacy',                       // PUT
    LANGUAGE:           '/companion/account/language',                      // PUT
    DEACTIVATE:         '/companion/account/deactivate',                    // POST
    REACTIVATE:         '/companion/account/reactivate',                    // POST
    DELETE:             '/companion/account/delete',                        // DELETE
    DATA_EXPORT:        '/companion/account/data-export',                   // GET
  },

  // ═══════════════════════════════════════════════════════════════════
  // SETTINGS — @Controller('companion/settings')  ← separate from ACCOUNT!
  // ═══════════════════════════════════════════════════════════════════
  SETTINGS: {
    GET_BANK:           '/companion/settings/bank',           // GET
    SAVE_BANK:          '/companion/settings/bank',           // POST
    CHANGE_PIN:         '/companion/settings/pin/change',     // POST
    ONBOARDING_SYNC:    '/companion/settings/onboarding-sync',// POST
    GET_PRIVACY:        '/companion/settings/privacy',        // GET
    SAVE_PRIVACY:       '/companion/settings/privacy',        // POST
    GET_NOTIFICATIONS:  '/companion/settings/notifications',  // GET
    SAVE_NOTIFICATIONS: '/companion/settings/notifications',  // POST
    DATA_EXPORT:        '/companion/settings/data-export',    // POST
    ACCOUNT_DELETE:     '/companion/settings/account/delete', // POST
  },

  // ═══════════════════════════════════════════════════════════════════
  // NOTIFICATIONS — @Controller('companion/notifications')
  // ═══════════════════════════════════════════════════════════════════
  NOTIFICATIONS: {
    LIST:          '/companion/notifications',                            // GET
    UNREAD_COUNT:  '/companion/notifications/unread-count',               // GET
    MARK_ALL_READ: '/companion/notifications/read-all',                   // PATCH
    ANNOUNCEMENTS: '/companion/notifications/announcements',              // GET
    MARK_READ:     '/companion/notifications/:notificationId/read',       // PATCH
    PUSH_TOKEN:    '/companion/notifications/push-token',                 // POST
    PREFERENCES:   '/companion/notifications/preferences',               // POST
  },

  // ═══════════════════════════════════════════════════════════════════
  // UPLOADS — @Controller('companion/uploads')
  // ═══════════════════════════════════════════════════════════════════
  UPLOADS: {
    PROFILE_PHOTO: '/companion/uploads/profile-photo',    // POST multipart/form-data
    GALLERY_PHOTO: '/companion/uploads/gallery',          // POST multipart/form-data
    DELETE_PHOTO:  '/companion/uploads/gallery/:photoId', // DELETE
    KYC_IDENTITY:  '/companion/uploads/kyc/identity',     // POST multipart/form-data
    KYC_SELFIE:    '/companion/uploads/kyc/selfie',       // POST multipart/form-data
    KYC_ADDRESS:   '/companion/uploads/kyc/address',      // POST multipart/form-data
    KYC_POLICE:    '/companion/uploads/kyc/police',       // POST multipart/form-data
    EVIDENCE:      '/companion/uploads/evidence',         // POST multipart/form-data
  },

  // ═══════════════════════════════════════════════════════════════════
  // PAYMENTS — @Controller('payments')
  // ═══════════════════════════════════════════════════════════════════
  PAYMENTS: {
    CREATE_ORDER: '/payments/order',           // POST
    VERIFY:       '/payments/verify',          // POST
    STATUS:       '/payments/status/:orderId', // GET
    REFUND:       '/payments/refund',          // POST
    WEBHOOK:      '/payments/webhook',         // POST (Razorpay → backend, not called from app)
  },

  // ═══════════════════════════════════════════════════════════════════
  // DASHBOARD — @Controller('companion/dashboard')
  // ═══════════════════════════════════════════════════════════════════
  DASHBOARD: {
    GET: '/companion/dashboard', // GET — returns summary stats for home screen
  },

} as const;

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Interpolate a path template with params.
 *
 * @example
 * buildPath(Endpoints.SESSIONS.DETAIL, { sessionId: 'CB-SE-2048' })
 * // → '/companion/sessions/CB-SE-2048'
 *
 * buildPath(Endpoints.AVAILABILITY.WEEKLY_DAY_TOGGLE, { day: 'Mon' })
 * // → '/companion/availability/weekly/Mon/toggle'
 */
export function buildPath(
  template: string,
  params: Record<string, any>,
): string {
  return Object.entries(params).reduce((path, [key, value]) => {
    let valStr: string;
    if (typeof value === 'object' && value !== null) {
      valStr = value[key] || value.id || value.ticketId || value.disputeId || value.sessionId || String(value);
    } else {
      valStr = String(value);
    }
    return path.replace(`:${key}`, encodeURIComponent(valStr));
  }, template);
}
