/**
 * CoBuddy Companion App — Logger Utility
 * Dev-only safe logger. Strips all output in production.
 * PRIVACY: Never pass raw PII, tokens, API keys, or raw user data to logger.
 * Use masking utilities first, then log the masked value.
 *
 * Usage:
 *   logger.log('Session started', sessionId);
 *   logger.error('Auth failed', error.message);
 */

const isDev = __DEV__;

export const logger = {
  log: (...args: unknown[]) => isDev && console.log('[CoBuddyCompanion]', ...args),
  warn: (...args: unknown[]) => isDev && console.warn('[CoBuddyCompanion:WARN]', ...args),
  error: (...args: unknown[]) => console.error('[CoBuddyCompanion:ERROR]', ...args),
  info: (...args: unknown[]) => isDev && console.info('[CoBuddyCompanion:INFO]', ...args),
};
