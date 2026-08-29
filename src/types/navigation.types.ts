/**
 * CoBuddy Companion App — Navigation Type Definitions
 * Strongly typed param lists for all navigators.
 */

import {NavigatorScreenParams} from '@react-navigation/native';
import {Routes} from '../navigation/routes';

// ─── Auth Navigator ──────────────────────────────────────────────────────────
export type AuthStackParamList = {
  [Routes.SPLASH]: undefined;
  [Routes.PHONE_LOGIN]: undefined;
  [Routes.OTP_VERIFICATION]: {phoneNumber: string};
  [Routes.LANGUAGE_SELECTION]: undefined;
  [Routes.NOTIFICATION_PERMISSION]: undefined;
  [Routes.LOCATION_PERMISSION]: undefined;
  [Routes.CREATE_PIN]: undefined;
  [Routes.CONFIRM_PIN]: {pin: string};
  [Routes.BIOMETRIC_SETUP]: undefined;
};

// ─── Onboarding Navigator ────────────────────────────────────────────────────
export type OnboardingStackParamList = {
  [Routes.COMPANION_WELCOME]: undefined;
  [Routes.ROLE_CONFIRMATION]: undefined;
  [Routes.TERMS_CONSENT]: undefined;
};

// ─── Application Navigator ───────────────────────────────────────────────────
export type ApplicationStackParamList = {
  [Routes.JOURNEY_INTRO]: undefined;
  [Routes.ELIGIBILITY_CONFIRMATION]: undefined;
  [Routes.BASIC_DETAILS]: undefined;
  [Routes.BIO_INTRODUCTION]: undefined;
  [Routes.BACKGROUND_DECLARATION]: undefined;
  [Routes.EXPERIENCE_CATEGORIES]: undefined;
  [Routes.INTERESTS_PERSONALITY]: undefined;
  [Routes.WORK_PREFERENCE]: undefined;
  [Routes.CITY_SERVICE_AREA]: undefined;
  [Routes.SERVICE_STYLE_PREFERENCES]: undefined;
  [Routes.PUBLIC_VENUE_PREFERENCE]: undefined;
  [Routes.BOUNDARIES_SAFETY]: undefined;
  [Routes.COMPANION_PRICING]: undefined;
  [Routes.LANGUAGES_SELECTION]: undefined;
  [Routes.PROFILE_PHOTO_UPLOAD]: undefined;
  [Routes.GOVERNMENT_ID_TYPE]: undefined;
  [Routes.GOVERNMENT_ID_UPLOAD]: {idType: string};
  [Routes.SELFIE_CAPTURE]: undefined;
  [Routes.LIVENESS_DETECTION]: undefined;
  [Routes.ADDRESS_VERIFICATION]: undefined;
  [Routes.PAN_TAX_DETAILS]: undefined;
  [Routes.ADD_BANK_ACCOUNT]: undefined;
  [Routes.BANK_ACCOUNT_VERIFICATION]: undefined;
  [Routes.UPI_DETAILS]: undefined;
  [Routes.PROFILE_SETUP_INTRO]: undefined;
  // mode: 'profile_setup' — normal journey (CPN-035 → CPN-046 → CPN-025)
  // mode: 'correction'   — post-rejection (CPN-059 → CPN-046 → CPN-048 → CPN-049)
  [Routes.PROFILE_COMPLETION_CHECKLIST]: { mode: 'profile_setup' | 'correction' };
  [Routes.APPLICATION_PROGRESS]: undefined;
  [Routes.APPLICATION_REVIEW_INFO]: undefined;
  [Routes.SUBMIT_PROFILE_FOR_APPROVAL]: undefined;
  [Routes.APPLICATION_SAVED_DRAFT]: undefined;
};

// ─── Verification Navigator ──────────────────────────────────────────────────
// Includes Phase 4C hub/status screens + Phase 4B fix-target screens.
// Phase 4B screens are reachable from VerificationHubScreen as missing-requirement fix flows.
export type VerificationStackParamList = {
  [Routes.VERIFICATION_HUB]: undefined;
  [Routes.VERIFICATION_PENDING]: undefined;
  [Routes.VERIFICATION_PROCESSING]: undefined;
  [Routes.VERIFICATION_APPROVED]: undefined;
  [Routes.VERIFICATION_REJECTED]: undefined;
  [Routes.RESUBMIT_VERIFICATION]: undefined;
  [Routes.PROFILE_REVIEW_PENDING]: undefined;
  [Routes.PROFILE_APPROVED_PUBLISHED]: undefined;
  [Routes.PROFILE_EDIT_REJECTED]: undefined;

  // ── Phase 4B fix-target screens (launched from VerificationHub missing-req flow) ──
  [Routes.BACKGROUND_DECLARATION]: undefined;
  [Routes.GOVERNMENT_ID_TYPE]: undefined;
  [Routes.GOVERNMENT_ID_UPLOAD]: {idType: string};
  [Routes.SELFIE_CAPTURE]: undefined;
  [Routes.LIVENESS_DETECTION]: undefined;
  [Routes.ADDRESS_VERIFICATION]: undefined;
  [Routes.PAN_TAX_DETAILS]: undefined;
  [Routes.ADD_BANK_ACCOUNT]: undefined;
  [Routes.BANK_ACCOUNT_VERIFICATION]: undefined;
  [Routes.SERVICE_STYLE_PREFERENCES]: undefined;

  // ── Phase 4A fix-target screens (profile section) ──
  [Routes.BASIC_DETAILS]: undefined;
  [Routes.BIO_INTRODUCTION]: undefined;
  [Routes.INTERESTS_PERSONALITY]: undefined;
  [Routes.EXPERIENCE_CATEGORIES]: undefined;
  [Routes.LANGUAGES_SELECTION]: undefined;
  [Routes.PROFILE_PHOTO_UPLOAD]: undefined;
  [Routes.WORK_PREFERENCE]: undefined;
  [Routes.CITY_SERVICE_AREA]: undefined;
  [Routes.PUBLIC_VENUE_PREFERENCE]: undefined;
  [Routes.BOUNDARIES_SAFETY]: undefined;
  [Routes.COMPANION_PRICING]: undefined;
  [Routes.UPI_DETAILS]: undefined;
};

// ─── Stack Param Lists ────────────────────────────────────────────────────────
export type DashboardStackParamList = {
  // ── Core Dashboard (CPN-061–066) ──
  [Routes.HOME_DASHBOARD]: undefined;
  [Routes.TODAY_OVERVIEW]: undefined;
  [Routes.QUICK_ACTIONS]: undefined;
  [Routes.PERFORMANCE_INSIGHTS]: undefined;
  [Routes.NOTIFICATION_CENTER]: undefined;
  [Routes.IMPORTANT_ANNOUNCEMENTS]: undefined;
  // ── Availability (CPN-071–078) — reachable from Dashboard quick actions ──
  [Routes.AVAILABILITY_CALENDAR]: undefined;
  [Routes.ADD_AVAILABILITY_SLOT]: undefined;
  [Routes.EDIT_AVAILABILITY_SLOT]: {slotId: string};
  [Routes.WEEKLY_RECURRING_AVAILABILITY]: undefined;
  [Routes.BLOCK_TIME_DAY_OFF]: undefined;
  [Routes.AVAILABILITY_CONFLICT]: { sessionId?: string; sessionTitle?: string; sessionTime?: string; sessionVenue?: string };
  [Routes.LIVE_AVAILABILITY_TOGGLE]: undefined;
  [Routes.VACATION_MODE]: undefined;
};

export type AvailabilityStackParamList = {
  [Routes.AVAILABILITY_CALENDAR]: undefined;
  [Routes.ADD_AVAILABILITY_SLOT]: undefined;
  [Routes.EDIT_AVAILABILITY_SLOT]: {slotId: string};
  [Routes.WEEKLY_RECURRING_AVAILABILITY]: undefined;
  [Routes.BLOCK_TIME_DAY_OFF]: undefined;
  [Routes.AVAILABILITY_CONFLICT]: { sessionId?: string; sessionTitle?: string; sessionTime?: string; sessionVenue?: string };
  [Routes.LIVE_AVAILABILITY_TOGGLE]: undefined;
  [Routes.VACATION_MODE]: undefined;
};

export type RequestsStackParamList = {
  [Routes.BOOKING_REQUESTS_INBOX]: undefined;
  [Routes.NEW_BOOKING_REQUEST_DETAIL]: {requestId: string};
  [Routes.CUSTOMER_TRUST_SNAPSHOT]: {customerId: string};
  [Routes.BOOKING_ACCEPT_CONFIRMATION]: {requestId: string};
  [Routes.BOOKING_ACCEPTED_SUCCESS]: {requestId: string};
  [Routes.BOOKING_REJECT_REASON]: {requestId: string};
  [Routes.BOOKING_DECLINED_SUCCESS]: {requestId: string};
  [Routes.SUGGEST_DIFFERENT_TIME]: {requestId: string};
  [Routes.EXPIRED_BOOKING_REQUEST]: {requestId: string};
  [Routes.BOOKING_REQUEST_EMPTY_STATE]: undefined;
};

export type SessionsStackParamList = {
  // ── Sessions (CPN-096–120) ──
  [Routes.UPCOMING_SESSIONS]: undefined;
  [Routes.SESSION_DETAIL]: {sessionId: string};
  [Routes.DIGITAL_SESSION_PASS]: {sessionId: string};
  [Routes.SESSION_REMINDER]: {sessionId: string};
  [Routes.SESSION_PREP_CHECKLIST]: {sessionId: string};
  [Routes.CUSTOMER_PROFILE_SAFETY_SUMMARY]: {customerId: string};
  [Routes.VENUE_MEETING_POINT_DETAIL]: {sessionId: string};
  [Routes.NAVIGATION_TO_VENUE]: {sessionId: string};
  [Routes.PRE_ARRIVAL]: {sessionId: string};
  [Routes.ARRIVAL_CHECK_IN]: {sessionId: string};
  [Routes.CUSTOMER_ARRIVAL_VERIFICATION]: {sessionId: string};
  [Routes.ACTIVE_SESSION]: {sessionId: string};
  [Routes.IN_SESSION_CHAT]: {sessionId: string; customerName?: string};
  [Routes.IN_SESSION_CALL]: {sessionId: string; customerName?: string};
  [Routes.LIVE_LOCATION_SHARING]: {sessionId: string};
  [Routes.EXTEND_SESSION_REQUEST]: {sessionId: string};
  [Routes.EXTEND_SESSION_CONFIRMATION]: {sessionId: string; extendedMinutes: number};
  [Routes.EARLY_END_SESSION]: {sessionId: string};
  [Routes.CANCEL_SESSION_REQUEST]: {sessionId: string};
  [Routes.CANCELLATION_REASON]: {sessionId: string; reason: string};
  [Routes.CANCELLATION_REVIEW_PENDING]: {sessionId: string};
  [Routes.CUSTOMER_NO_SHOW]: {sessionId: string};
  [Routes.POST_SESSION_NOTES]: {sessionId: string};
  [Routes.SESSION_COMPLETE]: {sessionId: string};
  [Routes.CUSTOMER_RATING_FEEDBACK]: {sessionId: string};
  // ── Safety (CPN-121–136) — reachable from active session screens ──
  [Routes.COMPANION_SAFETY_HUB]: undefined;
  [Routes.SAFETY_TIMER]: {sessionId?: string};
  [Routes.SOS]: undefined;
  [Routes.SOS_CONFIRMATION]: undefined;
  [Routes.SAFETY_GUIDELINES]: undefined;
  [Routes.PUBLIC_VENUE_RULES]: undefined;
  [Routes.SAFETY_QUIZ]: undefined;
  [Routes.EMERGENCY_CONTACT_SETUP]: undefined;
  [Routes.TRUSTED_CONTACTS]: undefined;
  [Routes.ADD_TRUSTED_CONTACT]: undefined;
  [Routes.EDIT_TRUSTED_CONTACT]: {name: string; phone: string; relation: string; isPrimary: boolean};
  [Routes.BLOCK_CUSTOMER]: {customerName: string; customerId?: string};
  [Routes.REPORT_CUSTOMER]: {customerName: string; customerId?: string; sessionId?: string};
  [Routes.INCIDENT_REPORT]: {sessionId?: string};
  [Routes.INCIDENT_EVIDENCE_UPLOAD]: {incidentId?: string};
  [Routes.INCIDENT_SUBMITTED]: {type: 'report' | 'incident'};
  // ── Support (reachable from session context via IncidentSubmitted/HomeDashboard) ──
  [Routes.SUPPORT_CENTER]: undefined;
};

export type EarningsStackParamList = {
  [Routes.EARNINGS_DASHBOARD]: undefined;
  [Routes.DAILY_EARNINGS_BREAKDOWN]: {date?: string};
  [Routes.WEEKLY_MONTHLY_EARNINGS]: undefined;
  [Routes.PENDING_EARNINGS]: undefined;
  [Routes.COMPLETED_PAYOUTS]: undefined;
  [Routes.PAYOUT_REQUEST]: undefined;
  [Routes.PAYOUT_REVIEW]: undefined;
  [Routes.PAYOUT_SUCCESS]: {payoutId?: string};
  [Routes.PAYOUT_PENDING]: {payoutId?: string};
  [Routes.PAYOUT_FAILED]: {payoutId?: string};
  [Routes.REFUND_PENALTY_EXPLANATION]: {transactionId?: string};
  [Routes.TRANSACTION_HISTORY]: undefined;
  [Routes.TRANSACTION_DETAIL]: {transactionId: string};
  [Routes.TAX_INVOICE_DETAILS]: {invoiceId?: string};
  [Routes.SUPPORT_CENTER]: undefined;
  [Routes.BANK_DETAILS]: undefined;
  [Routes.POLICY_CENTER]: undefined;
  [Routes.CREATE_SUPPORT_TICKET]: undefined;
};

export type SafetyStackParamList = {
  [Routes.COMPANION_SAFETY_HUB]: undefined;
  [Routes.SAFETY_TIMER]: {sessionId?: string};
  [Routes.SOS]: undefined;
  [Routes.SOS_CONFIRMATION]: undefined;
  [Routes.SAFETY_GUIDELINES]: undefined;
  [Routes.PUBLIC_VENUE_RULES]: undefined;
  [Routes.SAFETY_QUIZ]: undefined;
  [Routes.EMERGENCY_CONTACT_SETUP]: undefined;
  [Routes.TRUSTED_CONTACTS]: undefined;
  [Routes.ADD_TRUSTED_CONTACT]: undefined;
  [Routes.EDIT_TRUSTED_CONTACT]: {name: string; phone: string; relation: string; isPrimary: boolean};
  [Routes.BLOCK_CUSTOMER]: {customerName: string; customerId?: string};
  [Routes.REPORT_CUSTOMER]: {customerName: string; customerId?: string};
  [Routes.INCIDENT_REPORT]: {sessionId?: string};
  [Routes.INCIDENT_EVIDENCE_UPLOAD]: {incidentId?: string};
  [Routes.INCIDENT_SUBMITTED]: {type: 'report' | 'incident'};
};

export type ReviewsStackParamList = {
  [Routes.REVIEWS_DASHBOARD]: undefined;
  [Routes.REVIEW_DETAIL]: {reviewId: string};
  [Routes.TRUST_SCORE_DASHBOARD]: undefined;
  [Routes.TRUST_SCORE_SUMMARY]: undefined;
  [Routes.TRUST_SCORE_IMPROVEMENT_TASKS]: undefined;
  [Routes.BADGES_ACHIEVEMENTS]: undefined;
};

export type TrainingStackParamList = {
  [Routes.TRAINING_HUB]: undefined;
  [Routes.TRAINING_LESSON]: {lessonId: string};
  [Routes.TRAINING_COMPLETED]: {lessonId: string};
};

export type SupportStackParamList = {
  [Routes.SUPPORT_CENTER]: undefined;
  [Routes.CREATE_SUPPORT_TICKET]: {category?: string};
  [Routes.SUPPORT_TICKET_DETAIL]: {ticketId: string};
  [Routes.LIVE_SUPPORT_CHAT]: {ticketId?: string};
  [Routes.HELP_ARTICLE]: {articleId: string};
  [Routes.DISPUTE_CENTER]: undefined;
  [Routes.DISPUTE_DETAIL]: {disputeId: string};
  [Routes.APPEAL_DECISION]: {disputeId: string};
};

export type ProfileStackParamList = {
  // ── Profile (CPN-175–186) ──
  [Routes.COMPANION_PROFILE]: undefined;
  [Routes.PROFILE_PREVIEW]: undefined;
  // ── Reviews & Trust (CPN-156–161) ──
  [Routes.REVIEWS_DASHBOARD]: undefined;
  [Routes.REVIEW_DETAIL]: {reviewId: string};
  [Routes.TRUST_SCORE_DASHBOARD]: undefined;
  [Routes.TRUST_SCORE_SUMMARY]: undefined;
  [Routes.TRUST_SCORE_IMPROVEMENT_TASKS]: undefined;
  [Routes.BADGES_ACHIEVEMENTS]: undefined;
  [Routes.EDIT_BASIC_PROFILE]: undefined;
  [Routes.EDIT_BIO]: undefined;
  [Routes.EDIT_CATEGORIES]: undefined;
  [Routes.EDIT_LANGUAGES]: undefined;
  [Routes.EDIT_SERVICE_AREAS]: undefined;
  [Routes.EDIT_PRICING]: undefined;
  [Routes.GALLERY_PHOTO_MANAGER]: undefined;
  [Routes.TRAVEL_RADIUS_PREFERENCE]: undefined;
  [Routes.SERVICE_AREA_MAP]: undefined;
  // ── Settings (CPN-187–195) ──
  [Routes.ACCOUNT_SETTINGS]: undefined;
  [Routes.NOTIFICATION_PREFERENCES]: undefined;
  [Routes.PRIVACY_CONTROLS]: undefined;
  [Routes.LANGUAGE_SETTINGS]: undefined;
  [Routes.ACCESSIBILITY_TEXT_SIZE]: undefined;
  [Routes.POLICY_CENTER]: undefined;
  [Routes.LEGAL_AGREEMENTS]: undefined;
  [Routes.DATA_DOWNLOAD]: undefined;
  [Routes.DELETE_ACCOUNT]: undefined;
  [Routes.BANK_DETAILS]: undefined;
  [Routes.CHANGE_PIN]: undefined;
  // ── Safety (CPN-121–136) — reachable from Profile > Safety Hub ──
  [Routes.COMPANION_SAFETY_HUB]: undefined;
  [Routes.SAFETY_TIMER]: {sessionId?: string};
  [Routes.SOS]: undefined;
  [Routes.SOS_CONFIRMATION]: undefined;
  [Routes.SAFETY_GUIDELINES]: undefined;
  [Routes.PUBLIC_VENUE_RULES]: undefined;
  [Routes.SAFETY_QUIZ]: undefined;
  [Routes.EMERGENCY_CONTACT_SETUP]: undefined;
  [Routes.TRUSTED_CONTACTS]: undefined;
  [Routes.ADD_TRUSTED_CONTACT]: undefined;
  [Routes.EDIT_TRUSTED_CONTACT]: {name: string; phone: string; relation: string; isPrimary: boolean};
  [Routes.BLOCK_CUSTOMER]: {customerName: string; customerId?: string};
  [Routes.REPORT_CUSTOMER]: {customerName: string; customerId?: string};
  [Routes.INCIDENT_REPORT]: {sessionId?: string};
  [Routes.INCIDENT_EVIDENCE_UPLOAD]: {incidentId?: string};
  [Routes.INCIDENT_SUBMITTED]: {type: 'report' | 'incident'};
  // ── Reviews & Trust (CPN-156–161) — reachable from Profile ──
  [Routes.REVIEWS_DASHBOARD]: undefined;
  [Routes.REVIEW_DETAIL]: {reviewId: string};
  [Routes.TRUST_SCORE_DASHBOARD]: undefined;
  [Routes.TRUST_SCORE_SUMMARY]: undefined;
  [Routes.TRUST_SCORE_IMPROVEMENT_TASKS]: undefined;
  [Routes.BADGES_ACHIEVEMENTS]: undefined;
  // ── Training (CPN-162–164) — reachable from Profile ──
  [Routes.TRAINING_HUB]: undefined;
  [Routes.TRAINING_LESSON]: {lessonId: string; title: string};
  [Routes.TRAINING_COMPLETED]: {lessonId: string};
  // ── Support & Disputes (CPN-166–174) — reachable from Profile > Help ──
  [Routes.SUPPORT_CENTER]: undefined;
  [Routes.CREATE_SUPPORT_TICKET]: {category?: string};
  [Routes.SUPPORT_TICKET_DETAIL]: {ticketId: string; isNew?: boolean};
  [Routes.LIVE_SUPPORT_CHAT]: {ticketId?: string};
  [Routes.HELP_ARTICLE]: {articleId: string; title: string};
  [Routes.DISPUTE_CENTER]: undefined;
  [Routes.DISPUTE_DETAIL]: {disputeId: string};
  [Routes.APPEAL_DECISION]: {disputeId: string};
};

// ─── Tab Navigator ────────────────────────────────────────────────────────────
export type CompanionTabParamList = {
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>;
  RequestsTab: NavigatorScreenParams<RequestsStackParamList>;
  SessionsTab: NavigatorScreenParams<SessionsStackParamList>;
  EarningsTab: NavigatorScreenParams<EarningsStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// ─── Root Navigator ───────────────────────────────────────────────────────────
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Application: NavigatorScreenParams<ApplicationStackParamList>;
  Verification: NavigatorScreenParams<VerificationStackParamList>;
  MainApp: NavigatorScreenParams<CompanionTabParamList>;
  GlobalProfileStack: NavigatorScreenParams<ProfileStackParamList>;
  [Routes.ACCOUNT_SUSPENDED]: undefined;
  [Routes.ACCOUNT_DEACTIVATED]: undefined;
  [Routes.ACCOUNT_UNDER_MANUAL_REVIEW]: undefined;
  [Routes.ACCOUNT_REACTIVATION_REQUEST]: undefined;
  [Routes.POLICY_VIOLATION_NOTICE]: undefined;
  [Routes.NETWORK_ERROR]: undefined;
  [Routes.MAINTENANCE_MODE]: undefined;
  [Routes.FORCE_UPDATE]: undefined;
  // Global screens (cross-tab access)
  [Routes.AVAILABILITY_CALENDAR]: undefined;
  [Routes.WEEKLY_RECURRING_AVAILABILITY]: undefined;
  [Routes.BLOCK_TIME_DAY_OFF]: undefined;
  [Routes.VACATION_MODE]: undefined;
  // Global safety modals
  [Routes.SOS]: undefined;
  [Routes.SOS_CONFIRMATION]: undefined;
  // Global support screen (reachable from any tab)
  [Routes.SUPPORT_CENTER]: undefined;
  // Global screens reachable from Quick Actions (cross-stack)
  [Routes.PAYOUT_REQUEST]: undefined;
  [Routes.PAYOUT_REVIEW]: undefined;
  [Routes.PAYOUT_SUCCESS]: {payoutId?: string};
  [Routes.PAYOUT_FAILED]: {payoutId?: string};
  [Routes.BANK_DETAILS]: undefined;
  [Routes.CREATE_SUPPORT_TICKET]: {category?: string};
  [Routes.SUPPORT_TICKET_DETAIL]: {ticketId: string; isNew?: boolean};
  // Global cross-tab screens — navigated from HomeDashboard and other hubs
  [Routes.BOOKING_REQUESTS_INBOX]: undefined;
  [Routes.UPCOMING_SESSIONS]: undefined;
  [Routes.EARNINGS_DASHBOARD]: undefined;
  [Routes.NEW_BOOKING_REQUEST_DETAIL]: {requestId: string};
  [Routes.SESSION_DETAIL]: {sessionId: string};
  [Routes.COMPANION_SAFETY_HUB]: undefined;
  [Routes.COMPANION_PROFILE]: undefined;
  // Availability sub-screens (reachable globally from Calendar modal)
  [Routes.ADD_AVAILABILITY_SLOT]: undefined;
  [Routes.EDIT_AVAILABILITY_SLOT]: {slotId?: string};
  [Routes.AVAILABILITY_CONFLICT]: { sessionId?: string; sessionTitle?: string; sessionTime?: string; sessionVenue?: string };
  [Routes.LIVE_AVAILABILITY_TOGGLE]: undefined;
  // Booking Request sub-screens (globally accessible)
  [Routes.CUSTOMER_TRUST_SNAPSHOT]: {customerId?: string};
  [Routes.SUGGEST_DIFFERENT_TIME]: {requestId?: string};
  [Routes.EXPIRED_BOOKING_REQUEST]: {requestId?: string};
  [Routes.BOOKING_REQUEST_EMPTY_STATE]: undefined;
  [Routes.BOOKING_REQUESTS_FILTER]: undefined;
  [Routes.BOOKING_ACCEPT_CONFIRMATION]: {requestId: string};
  [Routes.BOOKING_ACCEPTED_SUCCESS]: {requestId: string};
  [Routes.BOOKING_REJECT_REASON]: {requestId: string};
  [Routes.BOOKING_DECLINED_SUCCESS]: {requestId: string};
  // System state screens
  [Routes.NETWORK_ERROR]: undefined;
  [Routes.MAINTENANCE_MODE]: undefined;
  [Routes.FORCE_UPDATE]: undefined;
  // Session incoming call
  [Routes.INCOMING_CALL]: {customerName?: string};
};
