/**
 * CoBuddy Companion App — Data Masking Utility
 * CRITICAL: Customer and companion private data MUST be masked per product rules.
 * Never display raw PII. Always route through these functions.
 *
 * Masked format: ••••••
 * Phone: +91 ••••••7890
 * UPI: user••••@bank
 * Name: A••••• K
 */

/** Mask a phone number — show country code + last 4 digits only */
export function maskPhone(phone: string): string {
  if (!phone) return '••••••••••';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '••••••••••';
  const last4 = digits.slice(-4);
  const countryCode = phone.startsWith('+91') ? '+91' : '+--';
  return `${countryCode} ••••••${last4}`;
}

/** Mask a name — show first initial + last initial only */
export function maskName(fullName: string): string {
  if (!fullName) return '••••';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0][0] + '•'.repeat(Math.min(parts[0].length - 1, 5));
  }
  const first = parts[0][0] + '•'.repeat(Math.min(parts[0].length - 1, 4));
  const last = parts[parts.length - 1][0] + '•';
  return `${first} ${last}`;
}

/** Mask a UPI ID — show first 3 chars + •••• + @bank */
export function maskUPI(upiId: string): string {
  if (!upiId || !upiId.includes('@')) return '••••@••••';
  const [user, bank] = upiId.split('@');
  if (user.length <= 3) return `${user}••••@${bank}`;
  return `${user.slice(0, 3)}••••@${bank}`;
}

/** Mask a bank account number — show last 4 digits only */
export function maskAccountNumber(account: string): string {
  if (!account) return '•••• •••• ••••';
  const digits = account.replace(/\D/g, '');
  if (digits.length < 4) return '•••• •••• ••••';
  return `•••• •••• ${digits.slice(-4)}`;
}

/** Mask an email — show first 2 chars + •••• + @domain */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '••••@••••';
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user}••••@${domain}`;
  return `${user.slice(0, 2)}••••@${domain}`;
}

/** Mask a PAN card — show first 2 chars + •••••••• + last 1 char */
export function maskPAN(pan: string): string {
  if (!pan) return '•••••••••••';
  if (pan.length < 3) return '•'.repeat(10);
  return `${pan.slice(0, 2)}••••••${pan.slice(-2)}`;
}

/** Mask an address — show city only, hide street/area details */
export function maskAddress(address: string): string {
  if (!address) return '••••, ••••';
  // Show only last part (city/state), mask the rest
  const parts = address.split(',');
  if (parts.length <= 1) return '•••• Area';
  const city = parts[parts.length - 1].trim();
  return `••••, ${city}`;
}

/** Show masked placeholder text */
export const MASKED = '••••••' as const;
export const MASKED_AMOUNT = '\u20B9 ••••' as const;
export const MASKED_GPS = '•••°N, •••°E' as const;
