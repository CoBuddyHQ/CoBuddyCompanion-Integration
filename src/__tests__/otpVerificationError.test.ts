import { getOtpVerificationErrorMessage } from '../utils/otpVerificationError';

describe('OTP verification errors', () => {
  it('distinguishes expired and missing OTP challenges', () => {
    expect(getOtpVerificationErrorMessage(new Error('OTP has expired'))).toMatch(/expired/i);
    expect(getOtpVerificationErrorMessage(new Error('No OTP found'))).toMatch(/request a new code/i);
  });

  it('preserves throttling and invalid-code guidance', () => {
    expect(getOtpVerificationErrorMessage(new Error('Too many attempts. Request a new OTP.'))).toMatch(/too many attempts/i);
    expect(getOtpVerificationErrorMessage(new Error('Invalid OTP'))).toMatch(/invalid verification code/i);
  });

  it('shows network failures as connection problems instead of wrong-code errors', () => {
    expect(getOtpVerificationErrorMessage({ code: 'NETWORK_TIMEOUT', message: 'Request timed out' })).toBe('Request timed out');
    expect(getOtpVerificationErrorMessage({ code: 'NETWORK_OFFLINE', message: 'Network unavailable' })).toBe('Network unavailable');
  });

  it('uses the server message for other failures and has a safe fallback', () => {
    expect(getOtpVerificationErrorMessage(new Error('Account suspended'))).toBe('Account suspended');
    expect(getOtpVerificationErrorMessage(null)).toMatch(/unable to verify/i);
  });
});
