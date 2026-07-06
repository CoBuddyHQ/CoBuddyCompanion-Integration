import i18next from "i18next"; /**
* CoBuddy Companion App — Auth & Onboarding Screen Content
* Approved copy for CPN-001 through CPN-012.
*
* AUTHORITY: This file is the canonical copy source for Phase 3 screens.
* All content here has been reviewed against:
*   - canonicalContentRules.ts (brand, banned terms, masking)
*   - screenContentFixes.ts (P0/P1 screen-specific fixes)
*   - Product Content QA audit
*
* DO NOT:
*   - Use Stitch-generated text directly in screens.
*   - Hardcode copy inside components.
*   - Use any BANNED_BRAND_TERMS or BANNED_PRODUCT_TERMS.
*/

// ─── CPN-001: Splash ─────────────────────────────────────────────────────────

export const SplashContent = {
  BRAND_NAME: 'CoBuddy',
  PANEL_LABEL: 'Companion',
  TAGLINE: 'Verified Social Experiences',
  VERIFIED_PLATFORM: 'Verified Companion Partner Platform',
  TRUST_LINE: 'SAFE • VERIFIED • PROFESSIONAL'
} as const;

// ─── CPN-002: Phone Login ─────────────────────────────────────────────────────
// P0 FIX APPLIED: Default country code is +91. No +44/+33 defaults.
// P0 FIX APPLIED: "hospitality" copy removed. "companion workspace" used.

export const PhoneLoginContent = {
  HEADLINE: 'Welcome Back',
  SUBHEADLINE: 'Sign in to your companion workspace',
  PHONE_LABEL: 'Mobile Number',
  PHONE_PLACEHOLDER: '98765 43210',
  COUNTRY_CODE: '+91',
  COUNTRY_FLAG: '🇮🇳',
  COUNTRY_NAME: 'India',
  CTA_PRIMARY: 'Send OTP',
  FOOTER_NOTE: "We'll send a 6-digit OTP to verify your number.",
  NEW_COMPANION: 'New to CoBuddy?',
  APPLY_LINK: 'Apply to become a companion',
  HELP_LINK: 'Need help signing in?',
  SECURE_LOGIN: 'Secure companion login',
  ACCOUNT_PROTECTED: 'Your account stays protected',
  TERMS: 'Terms',
  SAFETY_STANDARDS: 'Safety Standards',
  PRIVACY_POLICY: 'Privacy Policy',
  SELECT_COUNTRY: 'Select Country Code'
} as const;

// ─── CPN-003: OTP Verification ────────────────────────────────────────────────
// P0 FIX APPLIED: All encoding artifacts removed. +91 masked format.

export const OTPContent = {
  HEADLINE: 'Verify Your Number',
  SUBHEADLINE: "We've sent a 6-digit OTP to",
  MASKED_EXAMPLE: '+91 ••••••7890',
  RESEND_LABEL: 'Resend OTP',
  RESEND_TIMER: 'Resend in {seconds}s',
  CHANGE_NUMBER: 'Change number',
  CTA_PRIMARY: 'Verify & Continue',
  ERROR_INVALID: 'The OTP you entered is incorrect. Please try again.',
  ERROR_EXPIRED: 'Your OTP has expired. Please request a new one.',
  DIGIT_COUNT: 6,
  ENTER_OTP: 'ENTER OTP',
  SECURE_VERIFICATION: 'Secure verification',
  USE_ANOTHER_NUMBER: 'Use another number'
} as const;

// ─── CPN-004: Language Selection ─────────────────────────────────────────────

export const LanguageContent = {
  HEADLINE: 'Choose Your Language',
  SUBHEADLINE: 'Select the language you are most comfortable with',
  CTA_PRIMARY: 'Continue',
  APP_INTERFACE: 'App Interface Language',
  APP_INTERFACE_CAPS: 'APP INTERFACE LANGUAGE',
  USE_ENGLISH: 'Use English for Now',
  LANGUAGES: [
  { code: 'hi', label: 'हिंदी', nativeLabel: 'Hindi' },
  { code: 'en', label: i18next.t("content.content.authOnboardingContent.english"), nativeLabel: 'English' },
  { code: 'mr', label: 'मराठी', nativeLabel: 'Marathi' },
  { code: 'gu', label: 'ગુજરાતી', nativeLabel: 'Gujarati' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', nativeLabel: 'Punjabi' },
  { code: 'ta', label: 'தமிழ்', nativeLabel: 'Tamil' },
  { code: 'te', label: 'తెలుగు', nativeLabel: 'Telugu' },
  { code: 'kn', label: 'ಕನ್ನಡ', nativeLabel: 'Kannada' },
  { code: 'bn', label: 'বাংলা', nativeLabel: 'Bengali' }]

} as const;

// ─── CPN-005: Notification Permission ────────────────────────────────────────

export const NotificationPermContent = {
  HEADLINE: 'Stay Informed',
  SUBHEADLINE: 'Enable notifications to receive booking requests and safety alerts',
  WHY_MATTER: 'WHY NOTIFICATIONS MATTER',
  BULLET_1_ICON: 'request-quote',
  BULLET_1: 'New booking requests (with response timer)',
  BULLET_2_ICON: 'health-and-safety',
  BULLET_2: 'Safety check-in reminders',
  BULLET_3_ICON: 'payments',
  BULLET_3: 'Payout confirmations',
  BULLET_4_ICON: 'campaign',
  BULLET_4: 'Platform policy updates',
  CTA_PRIMARY: 'Allow Notifications',
  CTA_SKIP: 'Skip for Now',
  SKIP_NOTE: 'You can enable notifications later from Settings.'
} as const;

// ─── CPN-006: Location Permission ─────────────────────────────────────────────
// P0 FIX APPLIED: Full rewrite — Stitch content was wrong/phone_login copy.
// PURPOSE: Venue proximity check-in only. Never shared with customers.

export const LocationPermContent = {
  HEADLINE: 'Enable Location Access',
  SUBHEADLINE: 'Required for venue check-in and service area matching',
  HOW_HELPS: 'HOW LOCATION HELPS',
  PRIVATE_DESIGN: 'Private by design',
  BULLET_1_ICON: 'location-on',
  BULLET_1: 'Verify you are at the approved public venue before check-in',
  BULLET_2_ICON: 'visibility-off',
  BULLET_2: 'Your exact location is never visible to customers',
  BULLET_3_ICON: 'lock',
  BULLET_3: 'Location data is encrypted and cleared after each session',
  BULLET_4_ICON: 'place',
  BULLET_4: 'Only your city and area are used for booking matching',
  PRIVACY_NOTE: 'CoBuddy only accesses your location during active session check-ins.',
  CTA_PRIMARY: 'Allow Location Access',
  CTA_SKIP: 'Not Now',
  SKIP_NOTE: 'You will need location access to check into sessions.'
} as const;

// ─── CPN-007: Create PIN ──────────────────────────────────────────────────────

export const CreatePINContent = {
  HEADLINE: 'Create Your Workspace PIN',
  SUBHEADLINE: 'Set a 4-digit PIN to secure your CoBuddy workspace',
  PIN_LABEL: 'Enter PIN',
  HELPER: 'Choose a PIN that is not a repeated or sequential number.',
  SECURITY_NOTE: 'Your PIN is stored securely and is never shared.',
  CTA_PRIMARY: 'Set PIN',
  PROTECTS: 'Protects bookings, earnings, and safety tools',
  BACK_TO_OTP: 'Back to OTP verification'
} as const;

// ─── CPN-008: Confirm PIN ─────────────────────────────────────────────────────

export const ConfirmPINContent = {
  HEADLINE: 'Confirm Your PIN',
  SUBHEADLINE: 'Re-enter your PIN to confirm',
  PIN_LABEL: 'Confirm PIN',
  ERROR_MISMATCH: 'PINs do not match. Please try again.',
  CTA_PRIMARY: 'Confirm & Continue',
  CHANGE_PIN: 'Change PIN',
  SECURE_ACCESS: 'Secure access confirmation',
  RE_ENTER: 'RE-ENTER PIN'
} as const;

// ─── CPN-009: Biometric Setup ─────────────────────────────────────────────────

export const BiometricContent = {
  HEADLINE: 'Enable Biometric Login',
  SUBHEADLINE: 'Use fingerprint or face recognition for faster, secure access',
  FAST_PRIVATE: 'Fast, private, and secure',
  WHY_ENABLE: 'WHY ENABLE BIOMETRIC ACCESS?',
  STAYS_ON_DEVICE: 'Your biometric data stays on your device',
  BENEFIT_1_ICON: 'fingerprint',
  BENEFIT_1: 'Faster sign-in — no PIN needed every time',
  BENEFIT_2_ICON: 'shield',
  BENEFIT_2: 'Your biometric data stays on your device',
  BENEFIT_3_ICON: 'security',
  BENEFIT_3: 'You can always fall back to your PIN',
  CTA_PRIMARY: 'Enable Biometrics',
  CTA_SKIP: 'Use PIN Only',
  SKIP_NOTE: 'You can enable biometric login later in Settings.'
} as const;

// ─── CPN-010: Companion Welcome ───────────────────────────────────────────────

export const CompanionWelcomeContent = {
  HEADLINE: 'Welcome to CoBuddy Companion',
  SUBHEADLINE: 'Your verified workspace for trusted social experiences',
  POINT_1_ICON: 'verified-user',
  POINT_1_TITLE: 'Verified & Trusted',
  POINT_1_BODY: 'Every session is verified, public-only, and safety-first.',
  POINT_2_ICON: 'payments',
  POINT_2_TITLE: 'Transparent Earnings',
  POINT_2_BODY: 'Track your earnings, payouts, and session history in real time.',
  POINT_3_ICON: 'health-and-safety',
  POINT_3_TITLE: 'Safety Tools Built In',
  POINT_3_BODY: 'SOS, safety timer, and trusted contacts — always accessible.',
  CTA_PRIMARY: "Let's Begin"
} as const;

// ─── CPN-011: Role Confirmation ───────────────────────────────────────────────

export const RoleConfirmContent = {
  ROLE_TITLE: 'Companion Partner',
  ROLE_SUBTITLE: 'Offer trusted social experiences through a safety-first verified platform.',
  TRUST_LABEL: 'Before you continue',
  TRUST_BODY: 'CoBuddy reviews every companion profile, identity document, and safety consent before publishing.',
  HEADLINE: 'Understanding Your Role',
  SUBHEADLINE: 'As a CoBuddy Companion, here is what you commit to',
  COMMIT_1_ICON: 'place',
  COMMIT_1: 'All sessions take place only at CoBuddy-approved public venues',
  COMMIT_2_ICON: 'phone-disabled',
  COMMIT_2: 'No personal contact information is shared with customers',
  COMMIT_3_ICON: 'account-balance-wallet',
  COMMIT_3: 'All payments are processed exclusively through CoBuddy',
  COMMIT_4_ICON: 'group',
  COMMIT_4: 'Sessions are non-romantic, professional social experiences',
  COMMIT_5_ICON: 'report',
  COMMIT_5: 'Any safety concern is reported through the app immediately',
  CTA_PRIMARY: 'I Understand & Agree',
  CTA_SECONDARY: 'Read Full Guidelines'
} as const;

// ─── CPN-012: Terms Consent ───────────────────────────────────────────────────
// P1 FIX APPLIED: "hospitality" copy removed.
// Uses: verified social experiences, approved public venues, in-app communication.

export const TermsConsentContent = {
  POLICY_ITEMS: [
  { icon: 'shield', title: i18next.t("content.content.authOnboardingContent.safety_first_sessions"), body: 'Sessions must follow CoBuddy safety standards and support protocols.' },
  { icon: 'location-on', title: i18next.t("content.content.authOnboardingContent.public_venue_policy"), body: 'Companion experiences must stay within approved public locations.' },
  { icon: 'verified-user', title: i18next.t("content.content.authOnboardingContent.identity_verification"), body: 'Your identity, documents, profile, and consent details will be reviewed.' },
  { icon: 'handshake', title: i18next.t("content.content.authOnboardingContent.professional_conduct"), body: 'Respectful communication, boundaries, and platform rules are required.' }],

  HEADLINE: 'Terms & Community Standards',
  SUBHEADLINE: 'Please review and accept before continuing',
  SECTION_1_TITLE: 'What CoBuddy Is',
  SECTION_1_BODY:
  'CoBuddy is a platform for verified social experiences — trusted, public-only activity companionship. Every session takes place at a CoBuddy-approved public venue.',
  SECTION_2_TITLE: 'What You Agree To',
  SECTION_2_ITEMS: [
  'Conduct all sessions at approved public venues only',
  'Keep all communication within the CoBuddy platform',
  'Never share personal contact details with customers',
  'Accept payment exclusively through CoBuddy',
  'Report any safety or policy concern immediately',
  'Comply with CoBuddy Safety Rules at all times'],

  SECTION_3_TITLE: 'Your Privacy',
  SECTION_3_BODY:
  'Your personal information, exact location, and financial details are never shared with customers. CoBuddy collects only what is necessary for safe, verified sessions.',
  TERMS_LINK: 'View full Terms of Service',
  PRIVACY_LINK: 'View Privacy Policy',
  SAFETY_LINK: 'View Safety Rules',
  CHECKBOX_LABEL: 'I have read and agree to the Terms of Service, Privacy Policy, and CoBuddy Safety Rules.',
  CTA_PRIMARY: 'Accept & Continue',
  CTA_DISABLED_NOTE: 'Please accept the terms above to continue.'
} as const;