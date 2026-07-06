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
  if (cleaned.length === 0) { return 'Mobile number is required.'; }
  if (cleaned.length !== 10) { return 'Enter a valid 10-digit mobile number.'; }
  if (!/^[6-9]/.test(cleaned)) { return 'Mobile numbers must start with 6, 7, 8, or 9.'; }
  return null;
}

// ─── OTP ─────────────────────────────────────────────────────────────────────

/**
 * Validates a 6-digit numeric OTP.
 */
export function validateOTP(value: string): string | null {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 0) { return 'OTP is required.'; }
  if (cleaned.length !== 6) { return 'Enter the complete 6-digit OTP.'; }
  return null;
}

// ─── PIN ──────────────────────────────────────────────────────────────────────

/**
 * Validates a 4-digit companion workspace PIN.
 * Rejects trivially guessable sequences.
 */
export function validatePIN(value: string): string | null {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 0) { return 'PIN is required.'; }
  if (cleaned.length !== 4) { return 'PIN must be exactly 4 digits.'; }

  // Reject all-same digits: 0000, 1111, etc.
  if (/^(\d)\1{3}$/.test(cleaned)) {
    return 'Choose a PIN that is not a repeated digit (e.g. avoid 0000, 1111).';
  }
  // Reject sequential: 1234, 2345, 9876, etc.
  const seq = cleaned.split('').map(Number);
  const isAscSeq  = seq.every((d, i) => i === 0 || d === seq[i - 1]! + 1);
  const isDescSeq = seq.every((d, i) => i === 0 || d === seq[i - 1]! - 1);
  if (isAscSeq || isDescSeq) {
    return 'Choose a PIN that is not a sequential number (e.g. avoid 1234, 9876).';
  }

  return null;
}

/**
 * Validates PIN confirmation match.
 */
export function validatePINMatch(pin: string, confirm: string): string | null {
  if (confirm.length === 0) { return 'Please re-enter your PIN to confirm.'; }
  if (pin !== confirm) { return 'PINs do not match. Please try again.'; }
  return null;
}

// ─── Name ─────────────────────────────────────────────────────────────────────

/**
 * Validates a legal full name (for KYC/verification use).
 * Min 2 words, no digits, no special characters.
 */
export function validateLegalName(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) { return 'Full legal name is required.'; }
  if (trimmed.length < 2) { return 'Name is too short.'; }
  if (trimmed.length > 100) { return 'Name is too long.'; }
  if (/\d/.test(trimmed)) { return 'Name must not contain numbers.'; }
  if (/[^a-zA-Z\s'.\-]/u.test(trimmed)) { return 'Name contains invalid characters.'; }
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2) { return 'Please enter your full name (first and last name).'; }
  return null;
}

/**
 * Validates a companion display name (public-facing).
 * Single word or two words. No special characters except hyphen.
 */
export function validateDisplayName(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) { return 'Display name is required.'; }
  if (trimmed.length < 2) { return 'Display name is too short.'; }
  if (trimmed.length > 30) { return 'Display name must be 30 characters or fewer.'; }
  if (/[^a-zA-Z\s-]/u.test(trimmed)) { return 'Display name can only contain letters, spaces, or hyphens.'; }
  return null;
}

// ─── Email ────────────────────────────────────────────────────────────────────

/**
 * Validates an email address (basic RFC-compliant check).
 */
export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) { return 'Email address is required.'; }
  // Simple but robust email regex
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
    return 'Enter a valid email address.';
  }
  if (trimmed.length > 254) { return 'Email address is too long.'; }
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
  if (trimmed.length === 0) { return 'Bio is required.'; }
  if (trimmed.length < 50) { return `Bio must be at least 50 characters. Currently ${trimmed.length}.`; }
  if (trimmed.length > 500) { return 'Bio must be 500 characters or fewer.'; }

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
      return 'Your bio contains content that does not meet CoBuddy professional standards. Please keep your bio professional and focused on public social activities. Review the writing guidelines for help.';
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
  if (cleaned.length === 0) { return 'PAN number is required.'; }
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleaned)) {
    return 'Enter a valid PAN number (e.g. ABCDE1234F).';
  }
  return null;
}

// ─── Bank Account ─────────────────────────────────────────────────────────────

/**
 * Validates an Indian bank account number (8–18 digits).
 */
export function validateBankAccount(value: string): string | null {
  const cleaned = value.replace(/\s/g, '');
  if (cleaned.length === 0) { return 'Bank account number is required.'; }
  if (!/^\d{8,18}$/.test(cleaned)) {
    return 'Enter a valid bank account number (8–18 digits).';
  }
  return null;
}

/**
 * Validates an IFSC code (11-character alphanumeric, format XXXX0XXXXXX).
 */
export function validateIFSC(value: string): string | null {
  const cleaned = value.trim().toUpperCase();
  if (cleaned.length === 0) { return 'IFSC code is required.'; }
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleaned)) {
    return 'Enter a valid IFSC code (e.g. HDFC0001234).';
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
  if (trimmed.length === 0) { return 'UPI ID is required.'; }
  if (!/^[a-z0-9.-_]{3,}@[a-z]{2,}$/.test(trimmed)) {
    return 'Enter a valid UPI ID (e.g. yourname@upi).';
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
  if (isNaN(amount) || amount <= 0) { return 'Enter a valid payout amount.'; }
  if (amount < PAYOUT_MINIMUM_INR) {
    return `Minimum payout amount is \u20B9${PAYOUT_MINIMUM_INR}.`;
  }
  if (amount > available) {
    return `Amount exceeds your available balance of \u20B9${available.toLocaleString('en-IN')}.`;
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
    return 'You must be 18 years or older to become a CoBuddy Companion.';
  }
  if (exactAge > 80) {
    return 'Please enter a valid date of birth.';
  }
  return null;
}

// ─── Support Ticket ───────────────────────────────────────────────────────────

/**
 * Validates a support ticket description.
 */
export function validateTicketDescription(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) { return 'Please describe your issue.'; }
  if (trimmed.length < 20) { return 'Please provide more detail (at least 20 characters).'; }
  if (trimmed.length > 2000) { return 'Description must be 2000 characters or fewer.'; }
  return null;
}

// ─── Session Notes ────────────────────────────────────────────────────────────

/**
 * Validates internal post-session notes.
 */
export function validateSessionNote(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length > 500) { return 'Note must be 500 characters or fewer.'; }
  return null; // Notes are optional
}

// ─── Phase 4B — Financial & Address Validators ────────────────────────────────

/**
 * Validates a companion session rate (INR/hour).
 * Minimum: \u20B9800. Maximum: \u20B910,000. Must be a positive integer.
 */
export function validateSessionRate(value: number): string | null {
  if (isNaN(value) || value <= 0) { return 'Please enter a valid hourly rate.'; }
  if (!Number.isInteger(value)) { return 'Rate must be a whole number (no decimals).'; }
  if (value < 800) { return 'Minimum session rate is \u20B9800 per hour.'; }
  if (value > 10000) { return 'Maximum session rate is \u20B910,000 per hour.'; }
  return null;
}

/**
 * Validates an Indian PIN code (6-digit postal code).
 * Must be exactly 6 digits and not start with 0.
 */
export function validatePINCode(value: string): string | null {
  const cleaned = value.trim();
  if (cleaned.length === 0) { return 'PIN code is required.'; }
  if (!/^[1-9][0-9]{5}$/.test(cleaned)) {
    return 'Enter a valid 6-digit PIN code.';
  }
  return null;
}

/**
 * Validates an address line (street address, city, state).
 * 3–100 characters. Allows letters, digits, spaces, commas, dashes, slashes, dots.
 */
export function validateAddressLine(value: string, fieldName = 'Address'): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) { return `${fieldName} is required.`; }
  if (trimmed.length < 3) { return `${fieldName} is too short.`; }
  if (trimmed.length > 100) { return `${fieldName} must be 100 characters or fewer.`; }
  if (!/^[a-zA-Z0-9\s,.#\-/]+$/.test(trimmed)) {
    return `${fieldName} contains invalid characters.`;
  }
  return null;
}
