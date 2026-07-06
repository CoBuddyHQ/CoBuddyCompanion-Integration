/**
 * CoBuddy Companion App — Currency Utility
 * All amounts in INR. Format consistently across the app.
 *
 * Always use RUPEE constant or formatINR() — never paste the \u20B9 character directly.
 * Using the Unicode escape '\u20B9' guarantees correct rendering regardless of
 * file encoding or device locale configuration.
 */

/** Safe rupee symbol — use this instead of pasting \u20B9 directly in source. */
export const RUPEE = '\u20B9';

/**
 * Format a number as Indian Rupee string.
 * Uses Intl for en-IN number grouping (1,00,000 format) but prepends
 * our own RUPEE constant to avoid Intl currency-symbol rendering issues.
 */
export function formatINR(amount: number, decimals: boolean = false): string {
  if (isNaN(amount)) { return `${RUPEE}0`; }
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(amount);
  return `${RUPEE}${formatted}`;
}

/** Format a compact amount (e.g. \u20B91.2K, \u20B93.5L) */
export function formatCompactINR(amount: number): string {
  if (isNaN(amount)) { return `${RUPEE}0`; }
  if (amount >= 100000) {
    return `${RUPEE}${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `${RUPEE}${(amount / 1000).toFixed(1)}K`;
  }
  return `${RUPEE}${amount}`;
}

/** Format earnings per hour */
export function formatPerHour(amount: number): string {
  return `${formatINR(amount)}/hr`;
}

/** Parse a string to a safe number, stripping any currency symbols or commas. */
export function safeParseAmount(value: string): number {
  const n = parseFloat(value.replace(/[^\d.]/g, ''));
  return isNaN(n) ? 0 : n;
}
