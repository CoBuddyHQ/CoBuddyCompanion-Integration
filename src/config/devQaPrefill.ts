/**
 * DEV QA Prefill — CoBuddy Companion App
 *
 * ⚠️  QA CONVENIENCE ONLY. NEVER SHIPS TO PRODUCTION.
 *
 * When DEV_QA_PREFILL is set to `true`, PhoneLoginScreen and
 * OTPVerificationScreen will pre-fill their inputs so emulator testers
 * can navigate without typing on the virtual keyboard.
 *
 * DEFAULT: false — production behavior, real user input required.
 *
 * HOW TO ENABLE for a QA session:
 *   Change `false` → `true` on the line below, save, and let Metro reload.
 *   Remember to revert before committing / demo.
 *
 * SAFETY GUARANTEES:
 *  1. The entire block evaluates to a no-op when `__DEV__ === false`
 *     (i.e. in any release APK). Metro dead-code elimination removes it.
 *  2. No credentials (phone, OTP, PIN) are stored in Zustand or AsyncStorage.
 *     Pre-fill only sets local React useState values inside each screen.
 *  3. Validation is NOT bypassed. The phone must still pass validatePhone()
 *     and the OTP must still pass validateOTP() before navigation proceeds.
 *  4. No hidden tap shortcuts, secret routes, or auto-navigation exist.
 *     The tester must still tap every CTA button explicitly.
 *
 * Documented in: phase3_cleanup_short_report.md
 */

/** Master switch. DEFAULT false = real input required. */
const DEV_QA_PREFILL: boolean = __DEV__ && false;

/** Phone number pre-filled on PhoneLoginScreen (10 digits, no country code).
 *  Returns empty string when DEV_QA_PREFILL is false → no pre-fill. */
export const QA_PHONE: string = DEV_QA_PREFILL ? '9876543210' : '';

/** OTP digits pre-filled on OTPVerificationScreen.
 *  Returns empty array when DEV_QA_PREFILL is false → no pre-fill. */
export const QA_OTP_DIGITS: string[] = DEV_QA_PREFILL
  ? ['1', '2', '3', '4', '5', '6']
  : [];

/** Phone numbers authorized for development / QA testing. */
export const AUTHORIZED_TEST_PHONES: string[] = [
  '9999992398',
  '8435892398',
  '9876543210',
  '9000000001',
  '9000000002',
  '9000000003',
];

export default DEV_QA_PREFILL;
