import i18next from "i18next";import { useTranslation } from "react-i18next"; /**
 * CoBuddy Companion App — Error Handler
 * Wraps API and runtime errors into typed CoBuddy error shapes.
 * Never logs sensitive data. Never exposes raw server errors to UI.
 */

import { logger } from './logger';

// ─── Error Types ────────────────────────────────────────────────────────────

export type CoBuddyErrorCode =
// Auth
'AUTH_INVALID_OTP' |
'AUTH_OTP_EXPIRED' |
'AUTH_SESSION_EXPIRED' |
'AUTH_PIN_INCORRECT' |
'AUTH_ACCOUNT_SUSPENDED' |
'AUTH_ACCOUNT_DEACTIVATED'
// Network
| 'NETWORK_OFFLINE' |
'NETWORK_TIMEOUT' |
'SERVER_ERROR' |
'SERVER_MAINTENANCE'
// KYC / Verification
| 'KYC_DOCUMENT_REJECTED' |
'KYC_SELFIE_FAILED' |
'KYC_RESUBMIT_REQUIRED'
// Requests
| 'REQUEST_EXPIRED' |
'REQUEST_ALREADY_ACCEPTED' |
'REQUEST_CONFLICT'
// Sessions
| 'SESSION_CHECKIN_TOO_FAR' |
'SESSION_NOT_ACTIVE' |
'SESSION_EXTEND_REJECTED'
// Earnings / Payout
| 'PAYOUT_BELOW_MINIMUM' |
'PAYOUT_BANK_UNVERIFIED' |
'PAYOUT_SAFETY_HOLD' |
'PAYOUT_FAILED'
// Disputes
| 'DISPUTE_ALREADY_OPEN' |
'DISPUTE_WINDOW_CLOSED'
// Generic
| 'VALIDATION_ERROR' |
'UNKNOWN_ERROR';

export interface CoBuddyError {
  code: CoBuddyErrorCode;
  message: string; // User-facing message — safe, no raw server data
  retryable: boolean; // Can the user retry this action?
  supportable: boolean; // Should we show "Contact Support" CTA?
  raw?: string; // Internal only — never rendered in UI
}

// ─── Error Map ───────────────────────────────────────────────────────────────

const ERROR_MAP: Record<CoBuddyErrorCode, Omit<CoBuddyError, 'raw'>> = {
  AUTH_INVALID_OTP: { code: 'AUTH_INVALID_OTP', message: i18next.t("content.utils.errorHandler.the_otp_you_entered_is_incorrect_please"), retryable: true, supportable: false },
  AUTH_OTP_EXPIRED: { code: 'AUTH_OTP_EXPIRED', message: i18next.t("content.utils.errorHandler.your_otp_has_expired_please_request_a_ne"), retryable: true, supportable: false },
  AUTH_SESSION_EXPIRED: { code: 'AUTH_SESSION_EXPIRED', message: i18next.t("content.utils.errorHandler.your_session_has_expired_please_log_in_a"), retryable: false, supportable: false },
  AUTH_PIN_INCORRECT: { code: 'AUTH_PIN_INCORRECT', message: i18next.t("content.utils.errorHandler.incorrect_pin_please_try_again"), retryable: true, supportable: false },
  AUTH_ACCOUNT_SUSPENDED: { code: 'AUTH_ACCOUNT_SUSPENDED', message: i18next.t("content.utils.errorHandler.your_account_is_temporarily_suspended_pl"), retryable: false, supportable: true },
  AUTH_ACCOUNT_DEACTIVATED: { code: 'AUTH_ACCOUNT_DEACTIVATED', message: i18next.t("content.utils.errorHandler.your_account_is_deactivated_reactivate_f"), retryable: false, supportable: true },
  NETWORK_OFFLINE: { code: 'NETWORK_OFFLINE', message: i18next.t("content.utils.errorHandler.no_internet_connection_please_check_your"), retryable: true, supportable: false },
  NETWORK_TIMEOUT: { code: 'NETWORK_TIMEOUT', message: i18next.t("content.utils.errorHandler.the_request_took_too_long_please_try_aga"), retryable: true, supportable: false },
  SERVER_ERROR: { code: 'SERVER_ERROR', message: i18next.t("content.utils.errorHandler.something_went_wrong_on_our_end_please_t"), retryable: true, supportable: true },
  SERVER_MAINTENANCE: { code: 'SERVER_MAINTENANCE', message: i18next.t("content.utils.errorHandler.cobuddy_is_currently_under_maintenance_w"), retryable: true, supportable: false },
  KYC_DOCUMENT_REJECTED: { code: 'KYC_DOCUMENT_REJECTED', message: i18next.t("content.utils.errorHandler.your_document_could_not_be_verified_plea"), retryable: true, supportable: true },
  KYC_SELFIE_FAILED: { code: 'KYC_SELFIE_FAILED', message: i18next.t("content.utils.errorHandler.your_selfie_did_not_match_our_records_pl"), retryable: true, supportable: false },
  KYC_RESUBMIT_REQUIRED: { code: 'KYC_RESUBMIT_REQUIRED', message: i18next.t("content.utils.errorHandler.your_verification_needs_corrections_plea"), retryable: true, supportable: true },
  REQUEST_EXPIRED: { code: 'REQUEST_EXPIRED', message: i18next.t("content.utils.errorHandler.this_booking_request_has_expired_the_cus"), retryable: false, supportable: false },
  REQUEST_ALREADY_ACCEPTED: { code: 'REQUEST_ALREADY_ACCEPTED', message: i18next.t("content.utils.errorHandler.this_request_has_already_been_accepted"), retryable: false, supportable: false },
  REQUEST_CONFLICT: { code: 'REQUEST_CONFLICT', message: 'This action or information conflicts with an existing record. Please review and try again.', retryable: true, supportable: false },
  SESSION_CHECKIN_TOO_FAR: { code: 'SESSION_CHECKIN_TOO_FAR', message: i18next.t("content.utils.errorHandler.you_are_too_far_from_the_approved_venue"), retryable: true, supportable: false },
  SESSION_NOT_ACTIVE: { code: 'SESSION_NOT_ACTIVE', message: i18next.t("content.utils.errorHandler.this_session_is_no_longer_active"), retryable: false, supportable: true },
  SESSION_EXTEND_REJECTED: { code: 'SESSION_EXTEND_REJECTED', message: i18next.t("content.utils.errorHandler.the_customer_declined_the_extension_requ"), retryable: false, supportable: false },
  PAYOUT_BELOW_MINIMUM: { code: 'PAYOUT_BELOW_MINIMUM', message: i18next.t("content.utils.errorHandler.minimum_payout_amount_is_500_please_adju"), retryable: true, supportable: false },
  PAYOUT_BANK_UNVERIFIED: { code: 'PAYOUT_BANK_UNVERIFIED', message: i18next.t("content.utils.errorHandler.your_bank_account_needs_to_be_verified_b"), retryable: false, supportable: true },
  PAYOUT_SAFETY_HOLD: { code: 'PAYOUT_SAFETY_HOLD', message: i18next.t("content.utils.errorHandler.a_safety_hold_is_active_contact_support"), retryable: false, supportable: true },
  PAYOUT_FAILED: { code: 'PAYOUT_FAILED', message: i18next.t("content.utils.errorHandler.your_payout_could_not_be_processed_your"), retryable: true, supportable: true },
  DISPUTE_ALREADY_OPEN: { code: 'DISPUTE_ALREADY_OPEN', message: i18next.t("content.utils.errorHandler.a_dispute_is_already_open_for_this_sessi"), retryable: false, supportable: true },
  DISPUTE_WINDOW_CLOSED: { code: 'DISPUTE_WINDOW_CLOSED', message: i18next.t("content.utils.errorHandler.the_dispute_window_for_this_session_has"), retryable: false, supportable: true },
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', message: i18next.t("content.utils.errorHandler.please_check_the_information_you_entered"), retryable: true, supportable: false },
  UNKNOWN_ERROR: { code: 'UNKNOWN_ERROR', message: i18next.t("content.utils.errorHandler.an_unexpected_error_occurred_please_try"), retryable: true, supportable: true }
};

// ─── HTTP Status → Error Code Map ────────────────────────────────────────────

function httpStatusToCode(status: number, serverCode?: string): CoBuddyErrorCode {
  if (serverCode && serverCode in ERROR_MAP) {
    return serverCode as CoBuddyErrorCode;
  }
  switch (status) {
    case 400:return 'VALIDATION_ERROR';
    case 401:return 'AUTH_SESSION_EXPIRED';
    case 403:return 'AUTH_ACCOUNT_SUSPENDED';
    case 408:return 'NETWORK_TIMEOUT';
    case 409:return 'REQUEST_CONFLICT';
    case 503:return 'SERVER_MAINTENANCE';
    default:
      if (status >= 500) {return 'SERVER_ERROR';}
      return 'UNKNOWN_ERROR';
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Convert any thrown error (Axios, network, runtime) into a safe CoBuddyError.
 * This is the single entry point — never handle raw errors in components.
 */
export function handleError(error: unknown, context?: string): CoBuddyError {
  const errMsg = (error as any)?.response?.data?.message || (error as any)?.message || String(error);
  const errUrl = (error as any)?.config?.url || '';
  const errStatus = (error as any)?.response?.status || '';
  logger.error(`[${context ?? 'Error'}] ${errStatus ? `(${errStatus}) ` : ''}${errUrl}`, errMsg);

  // Axios-shaped error
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as {
      response?: {status: number;data?: {code?: string;message?: string;};};
      code?: string;
    };

    if (axiosError.response) {
      const { status, data } = axiosError.response;
      const serverCode = data?.code;
      const errorCode = httpStatusToCode(status, serverCode);
      const base = ERROR_MAP[errorCode];
      const finalMessage = data?.message && typeof data.message === 'string' && data.message.trim().length > 0
        ? data.message
        : base.message;
      return { ...base, message: finalMessage, raw: data?.message };
    }

    // Network-level Axios error (no response)
    if (axiosError.code === 'ECONNABORTED') {
      return { ...ERROR_MAP.NETWORK_TIMEOUT };
    }
    if (axiosError.code === 'ERR_NETWORK') {
      return { ...ERROR_MAP.NETWORK_OFFLINE };
    }
  }

  // Known CoBuddyError re-thrown
  if (
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  'message' in error &&
  (error as CoBuddyError).code in ERROR_MAP)
  {
    return error as CoBuddyError;
  }

  return { ...ERROR_MAP.UNKNOWN_ERROR };
}

/**
 * Build a CoBuddyError directly from a known error code.
 * Useful for pre-validation errors before any API call.
 */
export function createError(
code: CoBuddyErrorCode,
rawDetail?: string)
: CoBuddyError {
  return { ...ERROR_MAP[code], raw: rawDetail };
}

/**
 * Type guard — checks if an error is a CoBuddyError.
 */
export function isCoBuddyError(e: unknown): e is CoBuddyError {
  return (
    typeof e === 'object' &&
    e !== null &&
    'code' in e &&
    'message' in e &&
    'retryable' in e);

}