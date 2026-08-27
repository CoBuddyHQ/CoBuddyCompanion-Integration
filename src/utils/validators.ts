import i18next from 'i18next';
/**
 * CoBuddy Companion App — Validators
 * Field-level validators for all companion input flows.
 * Returns null on success, error string on failure.
 * No PII stored in this module — validation only.
 */

// ─── Phone ────────────────────────────────────────────────────────────────────

/**
 * Validates Indian mobile numbers (10 digits, starting with 6–9).
 * Input should be the digits only — no country code, no spaces.
 */
export function validatePhone(value: string): string | null {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 0) { return i18next.t('validation.mobile_number_is_required'); }
  if (cleaned.length !== 10) { return i18next.t('validation.enter_a_valid_10_digit_mobile_number'); }
  if (!/^[6-9]/.test(cleaned)) { return i18next.t('validation.mobile_numbers_must_start_with_6_7_8_or_'); }
  return null;
}

// ─── OTP ─────────────────────────────────────────────────────────────────────

/**
 * Validates a 6-digit numeric OTP.
 */
export function validateOTP(value: string): string | null {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 0) { return i18next.t('validation.otp_is_required'); }
  if (cleaned.length !== 6) { return i18next.t('validation.enter_the_complete_6_digit_otp'); }
  return null;
}

// ─── PIN ──────────────────────────────────────────────────────────────────────

/**
 * Validates a 4-digit companion workspace PIN.
 * Rejects trivially guessable sequences.
 */
export function validatePIN(value: string): string | null {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 0) { return i18next.t('validation.pin_is_required'); }
  if (cleaned.length !== 4) { return i18next.t('validation.pin_must_be_exactly_4_digits'); }

  // Reject all-same digits: 0000, 1111, etc.
  if (/^(\d)\1{3}$/.test(cleaned)) {
    return i18next.t('validation.choose_a_pin_that_is_not_a_repeated_digi');
  }
  // Reject sequential: 1234, 2345, 9876, etc.
  const seq = cleaned.split('').map(Number);
  const isAscSeq  = seq.every((d, i) => i === 0 || d === seq[i - 1]! + 1);
  const isDescSeq = seq.every((d, i) => i === 0 || d === seq[i - 1]! - 1);
  if (isAscSeq || isDescSeq) {
    return i18next.t('validation.choose_a_pin_that_is_not_a_sequential_nu');
  }

  return null;
}

/**
 * Validates PIN confirmation match.
 */
export function validatePINMatch(pin: string, confirm: string): string | null {
  if (confirm.length === 0) { return i18next.t('validation.please_re_enter_your_pin_to_confirm'); }
  if (pin !== confirm) { return i18next.t('validation.pins_do_not_match_please_try_again'); }
  return null;
}

// ─── Name ─────────────────────────────────────────────────────────────────────

/**
 * Validates a legal full name (for KYC/verification use).
 * Min 2 words, no digits, no special characters.
 */
export function validateLegalName(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) { return i18next.t('validation.full_legal_name_is_required'); }
  if (trimmed.length < 2) { return i18next.t('validation.name_is_too_short'); }
  if (trimmed.length > 100) { return i18next.t('validation.name_is_too_long'); }
  if (/\d/.test(trimmed)) { return i18next.t('validation.name_must_not_contain_numbers'); }
  if (/[^a-zA-Z\s'.\-]/u.test(trimmed)) { return i18next.t('validation.name_contains_invalid_characters'); }
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2) { return i18next.t('validation.please_enter_your_full_name_first_and_la'); }
  return null;
}

/**
 * Validates a companion display name (public-facing).
 * Single word or two words. No special characters except hyphen.
 */
export function validateDisplayName(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) { return i18next.t('validation.display_name_is_required'); }
  if (trimmed.length < 2) { return i18next.t('validation.display_name_is_too_short'); }
  if (trimmed.length > 30) { return i18next.t('validation.display_name_must_be_30_characters_or_fe'); }
  if (/[^a-zA-Z\s-]/u.test(trimmed)) { return i18next.t('validation.display_name_can_only_contain_letters_sp'); }
  return null;
}

// ─── Email ────────────────────────────────────────────────────────────────────

/**
 * Validates an email address (basic RFC-compliant check).
 */
export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) { return i18next.t('validation.email_address_is_required'); }
  // Simple but robust email regex
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
    return i18next.t('validation.enter_a_valid_email_address');
  }
  if (trimmed.length > 254) { return i18next.t('validation.email_address_is_too_long'); }
  return null;
}

// ─── Bio ──────────────────────────────────────────────────────────────────────

/**
 * Validates a companion bio/introduction.
 * Min 50 chars for meaningful content. Max 500.
 * Rejects obvious dating/romantic phrasing.
 */
export function validateBio(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) { return i18next.t('validation.bio_is_required'); }
  if (trimmed.length < 50) { return i18next.t('validation.bio_must_be_at_least_50_characters_curre', { trimmedlength: trimmed.length }); }
  if (trimmed.length > 500) { return i18next.t('validation.bio_must_be_500_characters_or_fewer'); }

  // Safety filter — flag content that violates CoBuddy's professional and non-dating standards.
  // NOTE: Do NOT add overly broad terms like "date" (blocks "session date", "up to date").
  //       Only block phrases that are clearly inappropriate in a professional companion bio.
  const blockedPatterns: RegExp[] = [
    /\bdating\b/i,           // "dating", "online dating"
    /\bgo on a date\b/i,     // "go on a date with me"
    /\bromantic\b/i,          // "romantic evening", "romantic companion"
    /\bromance\b/i,           // "romance", "romance experience"
    /\bintimate\b/i,          // "intimate experience"
    /\bescort\b/i,            // "escort service", "escort companion"
    /\bprivate meeting\b/i,   // "private meeting at my place"
    /\bprivate session\b/i,   // "private session" (vs public session)
    /\bhome visit\b/i,        // "home visit", "visit your home"
    /\bhotel\b/i,             // "hotel room", "meet at hotel"
    /\bnight out\b/i,         // "night out companion"
    /\bcompanion for hire\b/i,// "companion for hire"
    /\bwhatsapp\b/i,          // Off-app contact platform
    /\btelegram\b/i,          // Off-app contact platform
    /\binstagram\b/i,         // Off-app contact platform
    /\bdm me\b/i,             // Off-app contact invitation
  ];
  for (const pattern of blockedPatterns) {
    if (pattern.test(trimmed)) {
      return i18next.t('validation.your_bio_contains_content_that_does_not_');
    }
  }

  return null;
}

// ─── PAN ─────────────────────────────────────────────────────────────────────

/**
 * Validates Indian PAN card number (format: ABCDE1234F).
 */
export function validatePAN(value: string): string | null {
  const cleaned = value.trim().toUpperCase();
  if (cleaned.length === 0) { return i18next.t('validation.pan_number_is_required'); }
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleaned)) {
    return i18next.t('validation.enter_a_valid_pan_number_e_g_abcde1234f');
  }
  return null;
}

// ─── Bank Account ─────────────────────────────────────────────────────────────

/**
 * Validates an Indian bank account number (8–18 digits).
 */
export function validateBankAccount(value: string): string | null {
  const cleaned = value.replace(/\s/g, '');
  if (cleaned.length === 0) { return i18next.t('validation.bank_account_number_is_required'); }
  if (!/^\d{8,18}$/.test(cleaned)) {
    return i18next.t('validation.enter_a_valid_bank_account_number_8_18_d');
  }
  return null;
}

/**
 * Validates an IFSC code (11-character alphanumeric, format XXXX0XXXXXX).
 */
export function validateIFSC(value: string): string | null {
  const cleaned = value.trim().toUpperCase();
  if (cleaned.length === 0) { return i18next.t('validation.ifsc_code_is_required'); }
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleaned)) {
    return i18next.t('validation.enter_a_valid_ifsc_code_e_g_hdfc0001234');
  }
  return null;
}

// ─── UPI ─────────────────────────────────────────────────────────────────────

/**
 * Validates a UPI ID for payout disbursement.
 * Format: username@provider (e.g. name@upi, name@okaxis)
 */
export function validateUPI(value: string): string | null {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.length === 0) { return i18next.t('validation.upi_id_is_required'); }
  if (!/^[a-z0-9.-_]{3,}@[a-z]{2,}$/.test(trimmed)) {
    return i18next.t('validation.enter_a_valid_upi_id_e_g_yourname_upi');
  }
  return null;
}

// ─── Payout Amount ────────────────────────────────────────────────────────────

const PAYOUT_MINIMUM_INR = 500;

/**
 * Validates a payout request amount.
 * @param amount — the requested amount in INR (as a number)
 * @param available — the companion's available balance in INR
 */
export function validatePayoutAmount(amount: number, available: number): string | null {
  if (isNaN(amount) || amount <= 0) { return i18next.t('validation.enter_a_valid_payout_amount'); }
  if (amount < PAYOUT_MINIMUM_INR) {
    return i18next.t('validation.minimum_payout_amount_is_u20b9var', { PAYOUTMINIMUMINR: PAYOUT_MINIMUM_INR });
  }
  if (amount > available) {
    return i18next.t('validation.amount_exceeds_your_available_balance_of', { availabletoLocaleStringenIN: available.toLocaleString('en-IN') });
  }
  return null;
}

// ─── Date of Birth ────────────────────────────────────────────────────────────

/**
 * Validates date of birth for KYC.
 * Companion must be 18+ years old.
 */
export function validateDateOfBirth(dob: Date): string | null {
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();
  const exactAge =
    age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);

  if (exactAge < 18) {
    return i18next.t('validation.you_must_be_18_years_or_older_to_become_');
  }
  if (exactAge > 80) {
    return i18next.t('validation.please_enter_a_valid_date_of_birth');
  }
  return null;
}

// ─── Support Ticket ───────────────────────────────────────────────────────────

/**
 * Validates a support ticket description.
 */
export function validateTicketDescription(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) { return i18next.t('validation.please_describe_your_issue'); }
  if (trimmed.length < 20) { return i18next.t('validation.please_provide_more_detail_at_least_20_c'); }
  if (trimmed.length > 2000) { return i18next.t('validation.description_must_be_2000_characters_or_f'); }
  return null;
}

// ─── Session Notes ────────────────────────────────────────────────────────────

/**
 * Validates internal post-session notes.
 */
export function validateSessionNote(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length > 500) { return i18next.t('validation.note_must_be_500_characters_or_fewer'); }
  return null; // Notes are optional
}

// ─── Phase 4B — Financial & Address Validators ────────────────────────────────

import { AdminConfig } from '../config/adminValues';

/**
 * Validates a companion session rate (INR/hour).
 * Minimum and maximum are defined in AdminConfig. Must be a positive integer.
 */
export function validateSessionRate(value: number): string | null {
  if (isNaN(value) || value <= 0) { return i18next.t('validation.please_enter_a_valid_hourly_rate'); }
  if (!Number.isInteger(value)) { return i18next.t('validation.rate_must_be_a_whole_number_no_decimals'); }
  
  const [min, max] = AdminConfig.pricing.baseHourlyRateLimit;
  if (value < min) { return i18next.t('validation.rate_too_low', { min }); }
  if (value > max) { return i18next.t('validation.rate_too_high', { max }); }
  return null;
}

/**
 * Validates an Indian PIN code (6-digit postal code).
 * Must be exactly 6 digits and not start with 0.
 */
export function validatePINCode(value: string): string | null {
  const cleaned = value.trim();
  if (cleaned.length === 0) { return i18next.t('validation.pin_code_is_required'); }
  if (!/^[1-9][0-9]{5}$/.test(cleaned)) {
    return i18next.t('validation.enter_a_valid_6_digit_pin_code');
  }
  return null;
}

/**
 * Validates an address line (street address, city, state).
 * 3–100 characters. Allows letters, digits, spaces, commas, dashes, slashes, dots.
 */
export function validateAddressLine(value: string, fieldName = 'Address'): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) { return i18next.t('validation.var_is_required', { fieldName: fieldName }); }
  if (trimmed.length < 3) { return i18next.t('validation.var_is_too_short', { fieldName: fieldName }); }
  if (trimmed.length > 100) { return i18next.t('validation.var_must_be_100_characters_or_fewer', { fieldName: fieldName }); }
  if (!/^[a-zA-Z0-9\s,.#\-/]+$/.test(trimmed)) {
    return i18next.t('validation.var_contains_invalid_characters', { fieldName: fieldName });
  }
  return null;
}
