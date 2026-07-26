/**
 * CoBuddy Companion — Auth API Service
 * Wraps all /auth/companion/* endpoints.
 *
 * Backend response shapes verified against auth.service.ts:
 *  verifyOtp → { accessToken, refreshToken, expiresIn, isNewCompanion,
 *                companionId, phone, profileStatus, verificationStatus,
 *                accountStatus, hasPIN }
 *  sendOtp   → { message, expiresInMinutes, devOtp? }
 *  refreshToken → { accessToken, refreshToken, expiresIn }
 */

import { apiPost } from '../client';
import { Endpoints } from '../endpoints';

// ─── Request DTOs (match backend auth.dto.ts exactly) ─────────────────────────

export interface SendOtpDto {
  phone: string;       // E.164 format e.g. "+919876543210"
}

export interface VerifyOtpDto {
  phone: string;
  otp: string;
  deviceId?: string;
  deviceName?: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface SetPinDto {
  pin: string;         // 4 digits
  confirmPin: string;
}

export interface VerifyPinDto {
  pin: string;
}

export interface BiometricEnrollDto {
  deviceId: string;
  publicKey: string;
}

export interface LogoutDto {
  deviceId?: string;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface SendOtpResponse {
  message: string;
  expiresInMinutes: number;
  devOtp?: string;     // Only present in dev/staging
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;   // seconds (900 = 15min)
  isNewCompanion: boolean;
  companionId: string;
  phone: string;       // masked e.g. "+91 ••••••7890"
  profileStatus: string;
  verificationStatus: string;
  accountStatus: string;
  hasPIN: boolean;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const AuthService = {
  /**
   * POST /auth/companion/otp/send
   * Screen: PhoneLoginScreen (CPN-002)
   * In dev mode backend returns devOtp (always "123456")
   */
  sendOtp: (dto: SendOtpDto): Promise<SendOtpResponse> =>
    apiPost<SendOtpResponse>(Endpoints.AUTH.SEND_OTP, dto),

  /**
   * POST /auth/companion/otp/verify
   * Screen: OTPVerificationScreen (CPN-003)
   * Returns tokens + companion profile status
   */
  verifyOtp: (dto: VerifyOtpDto): Promise<VerifyOtpResponse> =>
    apiPost<VerifyOtpResponse>(Endpoints.AUTH.VERIFY_OTP, dto),

  /**
   * POST /auth/companion/token/refresh
   * Called by Axios interceptor in client.ts on 401
   */
  refreshToken: (dto: RefreshTokenDto): Promise<RefreshTokenResponse> =>
    apiPost<RefreshTokenResponse>(Endpoints.AUTH.REFRESH_TOKEN, dto),

  /**
   * POST /auth/companion/logout
   * Revokes refresh token on backend
   */
  logout: (dto?: LogoutDto): Promise<{ message: string }> =>
    apiPost<{ message: string }>(Endpoints.AUTH.LOGOUT, dto ?? {}),

  /**
   * POST /auth/companion/pin/set
   * Screen: CreatePINScreen (CPN-007)
   */
  setPin: (dto: SetPinDto): Promise<{ message: string }> =>
    apiPost<{ message: string }>(Endpoints.AUTH.SET_PIN, dto),

  /**
   * POST /auth/companion/pin/verify
   * Screen: ConfirmPINScreen (CPN-008)
   */
  verifyPin: (dto: VerifyPinDto): Promise<{ message: string } & RefreshTokenResponse> =>
    apiPost(Endpoints.AUTH.VERIFY_PIN, dto),

  /**
   * POST /auth/companion/biometric/enroll
   * Screen: BiometricSetupScreen (CPN-009)
   */
  enrollBiometric: (dto: BiometricEnrollDto): Promise<{ message: string }> =>
    apiPost<{ message: string }>(Endpoints.AUTH.BIOMETRIC_ENROLL, dto),
};
