/**
 * CoBuddy Companion App — Store Index
 * Central export for all Zustand stores and their types.
 */

// ── Auth ──────────────────────────────────────────────────────────────────────
export {useAuthStore} from './slices/authStore';
export type {AuthStatus} from './slices/authStore';

// ── UI ────────────────────────────────────────────────────────────────────────
export {useUIStore} from './slices/uiStore';
export type {Toast, ToastType} from './slices/uiStore';

// ── Profile ───────────────────────────────────────────────────────────────────
export {useProfileStore} from './slices/profileStore';

// ── Session ───────────────────────────────────────────────────────────────────
export {useSessionStore} from './slices/sessionStore';

// ── Requests ──────────────────────────────────────────────────────────────────
export {useRequestStore} from './slices/requestStore';

// ── Earnings ──────────────────────────────────────────────────────────────────
export {useEarningsStore} from './slices/earningsStore';

// ── Safety ────────────────────────────────────────────────────────────────────
export {useSafetyStore} from './slices/safetyStore';
export type {SOSStatus} from './slices/safetyStore';

// ── Notifications ─────────────────────────────────────────────────────────────
export {useNotificationStore} from './slices/notificationStore';

// ── Shared Store Types ────────────────────────────────────────────────────────
export type {
  CompanionProfile,
  VerificationStatus,
  ProfileStatus,
  TrustLevel,
  Session,
  SessionStatus,
  ExperienceCategory,
  CustomerSummary,
  VenueDetail,
  BookingRequest,
  RequestStatus,
  Transaction,
  TransactionType,
  TransactionStatus,
  PayoutRecord,
  PayoutStatus,
  EarningsSummary,
  TrustedContact,
  SafetyTimerState,
  SafetyTimerStatus,
  AppNotification,
  NotificationCategory,
  NotificationPriority,
  CompanionReview,
  SupportTicket,
  TicketStatus,
  TicketCategory,
} from './types/store.types';
