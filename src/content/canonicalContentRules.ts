import i18next from "i18next"; /**
* CoBuddy Companion App — Canonical Content Rules
* ─────────────────────────────────────────────────
* Single source of truth for all content, copy, and terminology
* used across Phase 3+ screen implementations.
*
* RULE: Every screen developer must import from this file instead of
*       hardcoding strings. This guarantees brand, product, and safety
*       alignment across all 206 screens.
*
* DO NOT add marketing copy here. This is a constants file, not a CMS.
* DO NOT import this into store slices or API modules — UI layer only.
*/

// ─── Brand Identity ───────────────────────────────────────────────────────────

export const Brand = {
  /** Official app name — always "CoBuddy", never variants */
  APP_NAME: 'CoBuddy',

  /** Full panel name for headers and onboarding */
  PANEL_NAME: 'CoBuddy Companion',

  /** Short panel identifier — used in compact UIs */
  PANEL_SHORT: 'Companion',

  /** Support entity name — for support/dispute copy */
  SUPPORT_NAME: 'CoBuddy Support',

  /** Trust & Safety team name */
  SAFETY_TEAM: 'CoBuddy Trust & Safety',

  /** Platform description — always use one of these */
  PLATFORM_DESCRIPTION: 'verified social experiences',
  PLATFORM_DESCRIPTION_ALT: 'trusted activity companionship'
} as const;

// ─── Banned Brand Terms ───────────────────────────────────────────────────────
// These must NEVER appear in any screen copy, notification, error message,
// or UI label. They were found in Stitch AI exports and must be replaced.

export const BANNED_BRAND_TERMS: readonly string[] = [
'SafeSocial', // Wrong brand — a different company's name
'Vantage', // Stitch AI luxury template brand
'Vantage Performance', // Fake analytics brand
'Vantage Elite', // Fake badge tier
'Platinum Concierge', // Fake luxury tier — does not exist in CoBuddy
'Platinum Member', // Fake membership tier
'Platinum Record', // Fake achievement badge
'CoBuddy Executive', // Wrong variant — not a real product name
'Concierge', // Never use — implies private/luxury service
'Executive Member' // Non-existent tier
] as const;

// ─── Banned Product Terms ─────────────────────────────────────────────────────
// These terms represent concepts that CoBuddy explicitly prohibits.
// Never use in screen copy, button labels, notification body, or form placeholders.

export const BANNED_PRODUCT_TERMS: readonly string[] = [
// Dating / romantic
'dating',
'romance',
'romantic',
'intimate',
'girlfriend experience',
'boyfriend experience',
'companionship for hire',
'date me',
'go on a date',

// Escort / private
'escort',
'escort service',
'private companion',
'private meeting',
'private session',
'isolated location',

// Venue violations
'home visit',
'home session',
'visit your home',
'hotel room',
'hotel lobby',
'private residence',
'your place',
'my place',

// Payment violations — off-platform
'cash',
'direct UPI',
'direct payment',
'pay me directly',
'bank transfer directly',

// Off-app contact platforms
'WhatsApp',
'Telegram',
'Instagram',
'Snapchat',
'DM me',
'contact me outside',
'off-app',
'off platform'] as
const;

// ─── Allowed Session Language ─────────────────────────────────────────────────
// Use these terms when describing sessions, activities, or the companion role.

export const SessionLanguage = {
  SESSION: 'session',
  EXPERIENCE: 'experience',
  ACTIVITY: 'activity',
  BOOKING: 'booking',
  COMPANION_ROLE: 'activity companion',
  SERVICE_TYPE: 'verified social experience',
  PLATFORM_ACTIVITY: 'public companionship'
} as const;

// ─── Allowed Venue Language ───────────────────────────────────────────────────

export const VenueLanguage = {
  APPROVED: 'CoBuddy-approved public venue',
  APPROVED_SHORT: 'approved venue',
  PUBLIC_ONLY: 'public-only sessions',
  VENUE_TYPES: [
  'Public Café',
  'City Walking Trail',
  'Public Park',
  'Art Gallery',
  'Bookstore',
  'Shopping Mall',
  'Museum',
  'Food Court',
  'Business Networking Space',
  'Public Events Venue',
  'Cinema'] as
  const,
  PROHIBITED_NOTE:
  'Sessions must only take place at CoBuddy-approved public venues. Private homes, hotel rooms, and isolated locations are strictly prohibited.'
} as const;

// ─── Allowed Safety Language ──────────────────────────────────────────────────

export const SafetyLanguage = {
  SAFETY_TOOLS: 'CoBuddy safety tools',
  SOS_LABEL: 'Emergency SOS',
  TIMER_LABEL: 'Safety Timer',
  TRUSTED_CONTACTS: 'Trusted Contacts',
  SAFETY_HOLD: 'Safety hold',
  PUBLIC_RULE: 'All sessions must take place at approved public venues.',
  NO_OFF_APP: 'Never share contact information or arrange to meet outside the CoBuddy platform.',
  SOS_INSTRUCTION:
  'If you feel unsafe at any time, use the Emergency SOS button. Your trusted contacts and CoBuddy support will be notified immediately.',
  PERIODIC_CHECKIN:
  'CoBuddy performs periodic safety check-ins during active sessions. Please respond promptly to stay connected.'
} as const;

// ─── Customer Masking Rules ───────────────────────────────────────────────────

export const CustomerMasking = {
  /**
   * Rule: Customer display name in LISTS, NOTIFICATIONS, and DASHBOARD
   * → Initials only: "A.R.", "P.R.", "S.K."
   * → Format: `${firstName[0]}.${lastName[0]}.`
   * → NEVER show full name in these contexts
   */
  INITIALS_ONLY_CONTEXTS: [
  'notification list',
  'dashboard widget',
  'request inbox list item',
  'transaction history row',
  'session list row',
  'review list row',
  'dispute list row'] as
  const,

  /**
   * Rule: Customer display name ONLY ALLOWED IN FULL on:
   * → Session Detail screen (full context)
   * → Customer Trust Snapshot screen (safety context)
   * → Active Session screen (companion needs to identify customer)
   * → Customer Arrival Verification screen
   *
   * Even on these screens, use first name + last initial only.
   * NEVER show surname in full.
   */
  FULL_NAME_ALLOWED_SCREENS: [
  'SESSION_DETAIL',
  'CUSTOMER_TRUST_SNAPSHOT',
  'ACTIVE_SESSION',
  'CUSTOMER_ARRIVAL_VERIFICATION'] as
  const,

  /** Fallback label when customer name cannot be shown */
  ANONYMOUS_LABEL: 'Verified customer',

  /** Format for masked initials — use this template */
  INITIALS_FORMAT: (firstName: string, lastName: string): string =>
  `${firstName.charAt(0).toUpperCase()}.${lastName.charAt(0).toUpperCase()}.`
} as const;

// ─── PII Masking Formats ──────────────────────────────────────────────────────

export const PIIMasking = {
  /** Phone: +91 ••••••7890 */
  PHONE_EXAMPLE: '+91 ••••••XXXX',

  /** Bank account: •••• 4821 */
  BANK_EXAMPLE: '•••• XXXX',

  /** UPI ID: name••••@bank */
  UPI_EXAMPLE: 'name••••@bank',

  /** PAN: AB••••••XY */
  PAN_EXAMPLE: 'AB••••••XY',

  /** UTR: •••• 9021 */
  UTR_EXAMPLE: '•••• XXXX',

  /**
   * Rule: NEVER show exact GPS coordinates.
   * Location in UI must always be: area name + "Approved Venue"
   * Example: "MP Nagar — Approved Venue" (not "23.2332, 77.4343")
   */
  LOCATION_RULE: 'Area name + "Approved Venue" only. No coordinates.',

  /**
   * Rule: Payout amounts in notifications and history are the companion's
   * own earnings — these MAY be shown unmasked as they belong to the companion.
   * Customer payment amounts are never shown in companion UI.
   */
  PAYOUT_AMOUNT_RULE: 'Companion payout amounts may be shown. Customer payment amounts must never be shown.'
} as const;

// ─── India-First Rules ────────────────────────────────────────────────────────

export const IndiaFirst = {
  /** Default country code for all phone inputs */
  DEFAULT_COUNTRY_CODE: '+91',

  /** Default country name */
  DEFAULT_COUNTRY: 'India',

  /** Currency */
  CURRENCY_SYMBOL: '\u20B9',
  CURRENCY_CODE: 'INR',

  /** Default language for app UI */
  DEFAULT_LANGUAGE: 'en',

  /** Supported KYC document types for India */
  KYC_DOCUMENT_TYPES: [
  'Aadhaar Card',
  'PAN Card',
  'Passport',
  'Voter ID',
  'Driving Licence'] as
  const,

  /**
   * RULE: Phone login screen must default to +91.
   * +44 (UK) and +33 (France) from Stitch are BANNED as defaults.
   * User may change country code manually but +91 must be pre-selected.
   */
  PHONE_DEFAULT_RULE:
  'Default country code must be +91 (India). No other country code may be pre-selected.'
} as const;

// ─── UPI Disambiguation Rule ──────────────────────────────────────────────────

export const UPIRule = {
  /**
   * CRITICAL RULE:
   * UPI in the CoBuddy Companion App refers EXCLUSIVELY to
   * payout disbursement — the method by which CoBuddy sends
   * the companion's earnings TO them.
   *
   * UPI is NEVER used for customer-to-companion payment.
   * Customer payments happen through CoBuddy's payment gateway only.
   *
   * Every UPI-related screen and label must use this framing.
   */
  PAYOUT_ONLY_LABEL: 'Payout via UPI',
  PAYOUT_ONLY_DESCRIPTION:
  'Your UPI ID is used only for receiving payouts from CoBuddy. Customers never pay you directly through UPI.',
  FIELD_LABEL: 'UPI ID (for payout disbursement)',
  FIELD_PLACEHOLDER: 'yourname@upi'
} as const;

// ─── Earnings & Payout Language ───────────────────────────────────────────────

export const EarningsLanguage = {
  /** Do NOT use "balance" without qualifier — be specific */
  AVAILABLE_LABEL: 'Available to withdraw',
  PENDING_LABEL: 'Under review',
  HOLD_LABEL: 'Safety hold',
  EARNED_LABEL: 'Total earned',

  /** Payout copy */
  PAYOUT_CTA: 'Request Payout',
  PAYOUT_MINIMUM_NOTE: 'Minimum payout amount is \u20B9500.',
  PAYOUT_BANK_NOTE: 'Payout will be credited to your verified bank account.',
  PAYOUT_TIMELINE_NOTE: 'Processing takes 1–3 business days after approval.',
  BANK_CHANGE_NOTE:
  'For security, changes to your payout bank account require a CoBuddy support review.',

  /** Pricing copy — NEVER use luxury tier language */
  RATE_LABEL: 'Hourly Rate',
  SESSION_RATE: 'Session Rate',
  EXTENSION_RATE: 'Extension Rate (per 15 min)',
  PLATFORM_FEE_NOTE: 'A small platform service fee is deducted from each session earning. This is shown transparently in your transaction history.'
} as const;

// ─── Off-App Contact Warnings ─────────────────────────────────────────────────

export const OffAppWarnings = {
  CHAT_REMINDER:
  'Never share personal contact information. Keep all communication within CoBuddy.',
  PAYMENT_REMINDER:
  'Never accept or request direct payment. All earnings are processed exclusively through CoBuddy.',
  VENUE_REMINDER:
  'Only meet customers at CoBuddy-approved public venues. Private locations are not permitted.',
  REPORT_PROMPT:
  'If a customer requests off-app contact or payment, please report it immediately.'
} as const;

// ─── Verified Badge Rules ─────────────────────────────────────────────────────

export const VerifiedBadgeRules = {
  /**
   * RULE: "Verified" badge must ONLY appear on screens where
   * verification is already COMPLETE (verificationStatus === 'approved').
   *
   * It must NEVER appear on:
   * - Application screens (KYC in progress)
   * - Verification pending/processing screens
   * - Any pre-verification onboarding step
   *
   * P0 BUG FROM STITCH: CPN-023 (Basic Details) showed "VERIFIED" badge
   * on Step 1 of the application — before any verification has occurred.
   * This must never be replicated.
   */
  SHOW_ONLY_WHEN_STATUS: 'approved' as const,
  NEVER_ON_STATUS: [
  'not_started',
  'in_progress',
  'pending_review',
  'rejected',
  'resubmit_required'] as
  const
} as const;

// ─── Achievement Badge System ─────────────────────────────────────────────────
// REPLACES the fake luxury badges from Stitch (Vantage Elite, Platinum Record).
// Real CoBuddy badges are earned through measurable, product-relevant actions.

export const AchievementBadges = {
  FIRST_SESSION: {
    id: 'first_session',
    label: i18next.t("content.content.canonicalContentRules.first_session"),
    description: i18next.t("content.content.canonicalContentRules.completed_your_first_verified_public_ses"),
    icon: 'star'
  },
  SESSION_10: {
    id: 'sessions_10',
    label: i18next.t("content.content.canonicalContentRules.10_sessions"),
    description: i18next.t("content.content.canonicalContentRules.completed_10_verified_public_sessions"),
    icon: 'military_tech'
  },
  SESSION_50: {
    id: 'sessions_50',
    label: i18next.t("content.content.canonicalContentRules.50_sessions"),
    description: i18next.t("content.content.canonicalContentRules.completed_50_verified_public_sessions"),
    icon: 'workspace_premium'
  },
  SAFETY_TRAINED: {
    id: 'safety_trained',
    label: i18next.t("content.content.canonicalContentRules.safety_certified"),
    description: i18next.t("content.content.canonicalContentRules.completed_all_required_cobuddy_safety_tr"),
    icon: 'health_and_safety'
  },
  PERFECT_ATTENDANCE: {
    id: 'perfect_attendance',
    label: i18next.t("content.content.canonicalContentRules.perfect_attendance"),
    description: i18next.t("content.content.canonicalContentRules.zero_cancellations_or_no_shows_in_the_la"),
    icon: 'event_available'
  },
  TOP_RATED: {
    id: 'top_rated',
    label: i18next.t("content.content.canonicalContentRules.top_rated"),
    description: i18next.t("content.content.canonicalContentRules.maintained_a_rating_of_4_8_or_above_acro"),
    icon: 'grade'
  },
  TRUSTED_COMPANION: {
    id: 'trusted_companion',
    label: i18next.t("content.content.canonicalContentRules.trusted_companion"),
    description: i18next.t("content.content.canonicalContentRules.trust_score_above_90_for_60_consecutive"),
    icon: 'verified_user'
  },
  CITY_EXPLORER: {
    id: 'city_explorer',
    label: i18next.t("content.content.canonicalContentRules.city_explorer"),
    description: i18next.t("content.content.canonicalContentRules.completed_sessions_at_5_or_more_differen"),
    icon: 'explore'
  }
} as const;

// ─── Safety Quiz Questions ────────────────────────────────────────────────────
// For CPN-127 Safety Quiz — defines the canonical question set.

export const SAFETY_QUIZ_QUESTIONS = [
{
  id: 'sq_01',
  question: 'Where must all CoBuddy sessions take place?',
  options: [
  'Any location agreed upon with the customer',
  'At CoBuddy-approved public venues only',
  'At the customer\'s home or office',
  'In hotel lobbies or cafés of the customer\'s choice'],

  correctIndex: 1,
  explanation:
  'All sessions must take place exclusively at CoBuddy-approved public venues. Private homes, hotel rooms, and unapproved locations are strictly prohibited.'
},
{
  id: 'sq_02',
  question: 'What should you do if a customer asks for your personal phone number?',
  options: [
  'Share it only if you feel safe',
  'Share it after the session is confirmed',
  'Never share it — report the request through the app',
  'Share it via the CoBuddy chat'],

  correctIndex: 2,
  explanation:
  'Never share personal contact information. If a customer requests off-app contact, report it immediately using the "Report Off-App Contact" option.'
},
{
  id: 'sq_03',
  question: 'What does the Safety Timer do?',
  options: [
  'Tracks the session duration for billing',
  'Alerts CoBuddy and your trusted contacts if you miss a check-in',
  'Reminds you to leave the venue on time',
  'Locks the app after the session ends'],

  correctIndex: 1,
  explanation:
  'The Safety Timer requires periodic check-ins during sessions. If you miss a check-in, CoBuddy and your trusted contacts are notified immediately.'
},
{
  id: 'sq_04',
  question: 'When can you use the Emergency SOS button?',
  options: [
  'Only if you are physically in danger',
  'Whenever you feel unsafe, uncomfortable, or threatened',
  'Only after calling the police first',
  'Only during active sessions'],

  correctIndex: 1,
  explanation:
  'Use the SOS button any time you feel unsafe — this includes feeling threatened, harassed, or coerced. You do not need to wait for a physical emergency.'
},
{
  id: 'sq_05',
  question: 'A customer offers to pay you directly in cash. What do you do?',
  options: [
  'Accept it if the session was good',
  'Accept it and report it later',
  'Decline firmly and remind them all payments are through CoBuddy',
  'Accept and inform the customer to pay CoBuddy later'],

  correctIndex: 2,
  explanation:
  'All payments must go through CoBuddy. Off-platform cash payments violate the platform policy and may result in account suspension.'
},
{
  id: 'sq_06',
  question: 'What should you do if a customer does not arrive within 15 minutes of the session start time?',
  options: [
  'Wait indefinitely until they arrive',
  'Leave and mark the session as cancelled',
  'Use the "Customer No-Show" feature in the app and wait for CoBuddy guidance',
  'Call the customer directly'],

  correctIndex: 2,
  explanation:
  'Use the "Customer No-Show" feature. CoBuddy will guide you through the next steps and protect your earnings for the waiting time.'
},
{
  id: 'sq_07',
  question: 'How should you report an incident during or after a session?',
  options: [
  'Contact the customer directly to resolve it',
  'Post about it on social media',
  'Use the Incident Report feature in the Safety section of the app',
  'Wait for CoBuddy to contact you'],

  correctIndex: 2,
  explanation:
  'All incidents must be reported through the Incident Report feature. Include factual details only. CoBuddy\'s Trust & Safety team reviews all reports.'
},
{
  id: 'sq_08',
  question: 'Which of these is a CoBuddy policy violation?',
  options: [
  'Conducting a session at an approved café',
  'Meeting the customer at a public park walking trail',
  'Changing the venue to the customer\'s home during the session',
  'Extending the session by 30 minutes with customer approval'],

  correctIndex: 2,
  explanation:
  'Changing the venue to a non-approved or private location is a serious policy violation. If a customer requests this, decline firmly and report the request.'
}] as
const;

// ─── Training Lesson Content Stubs ────────────────────────────────────────────
// For CPN-163 Training Lesson — defines canonical lesson topics.

export const TRAINING_MODULES = [
{
  id: 'TRN-01',
  title: i18next.t("content.content.canonicalContentRules.public_venue_safety_rules"),
  duration: '8 min',
  description: i18next.t("content.content.canonicalContentRules.learn_the_complete_list_of_approved_venu"),

  isRequired: true
},
{
  id: 'TRN-02',
  title: i18next.t("content.content.canonicalContentRules.sos_emergency_response"),
  duration: '6 min',
  description: i18next.t("content.content.canonicalContentRules.how_to_use_the_emergency_sos_button_what"),

  isRequired: true
},
{
  id: 'TRN-03',
  title: i18next.t("content.content.canonicalContentRules.off_app_contact_payment_policy"),
  duration: '5 min',
  description: i18next.t("content.content.canonicalContentRules.why_off_app_communication_is_prohibited"),

  isRequired: true
},
{
  id: 'TRN-04',
  title: i18next.t("content.content.canonicalContentRules.incident_reporting"),
  duration: '7 min',
  description: i18next.t("content.content.canonicalContentRules.step_by_step_guide_to_filing_an_incident"),

  isRequired: true
},
{
  id: 'TRN-05',
  title: i18next.t("content.content.canonicalContentRules.handling_no_show_situations"),
  duration: '5 min',
  description: i18next.t("content.content.canonicalContentRules.what_to_do_when_a_customer_does_not_arri"),

  isRequired: false
},
{
  id: 'TRN-06',
  title: i18next.t("content.content.canonicalContentRules.understanding_your_earnings"),
  duration: '6 min',
  description: i18next.t("content.content.canonicalContentRules.how_session_earnings_are_calculated_when"),

  isRequired: false
},
{
  id: 'TRN-07',
  title: i18next.t("content.content.canonicalContentRules.professional_communication_standards"),
  duration: '8 min',
  description: i18next.t("content.content.canonicalContentRules.cobuddy_s_communication_standards_for_in"),

  isRequired: false
}] as
const;