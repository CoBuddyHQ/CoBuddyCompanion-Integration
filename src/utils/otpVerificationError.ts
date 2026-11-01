export function getOtpVerificationErrorMessage(error: unknown): string {
  const candidate = error as { code?: unknown; message?: unknown } | null;
  const message = typeof candidate?.message === 'string' ? candidate.message.trim() : '';
  const normalized = message.toLowerCase();

  if (normalized.includes('expired')) {
    return 'Verification code expired. Request a new code and try again.';
  }
  if (normalized.includes('no otp') || normalized.includes('no verification code')) {
    return 'There is no active verification code. Request a new code and try again.';
  }
  if (normalized.includes('too many attempts')) {
    return 'Too many attempts. Request a new code before trying again.';
  }
  if (normalized.includes('invalid otp') || normalized.includes('invalid verification code')) {
    return 'Invalid verification code. Check the code and try again.';
  }
  if (candidate?.code === 'NETWORK_TIMEOUT' || candidate?.code === 'NETWORK_OFFLINE') {
    return message || 'Could not reach the verification service. Check your connection and try again.';
  }

  return message || 'Unable to verify the code right now. Try again.';
}
