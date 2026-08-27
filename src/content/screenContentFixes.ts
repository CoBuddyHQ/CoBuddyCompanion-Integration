/**
 * CoBuddy Companion App — Screen Content Fixes Manifest
 * ───────────────────────────────────────────────────────
 * Phase 3 implementation reference for every screen that needs
 * content corrections identified during the Product Content QA audit.
 *
 * USAGE: Before implementing any screen, look up its CPN ID here.
 *   - If the screen has an entry → apply the fix before coding.
 *   - If no entry → content from Stitch reference is acceptable.
 *
 * PRIORITY LEVELS:
 *   P0 — Blocking. Must be fixed. Cannot ship with this issue.
 *   P1 — Important. Must be fixed before beta/TestFlight.
 *   P2 — Polish. Fix before public launch.
 *
 * SOURCE: companion_product_content_audit.md
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type FixPriority = 'P0' | 'P1' | 'P2';
export type FixDecision = 'REWRITE' | 'SIMPLIFY' | 'MERGE' | 'REMOVE_ELEMENT';

export interface ScreenFix {
  screenId: string;           // e.g. 'CPN-002'
  screenName: string;
  priority: FixPriority;
  decision: FixDecision;
  issues: string[];           // What is wrong (from Stitch or general rule)
  requiredFixes: string[];    // Exactly what to change when implementing
  canonicalCopy?: Record<string, string>; // Key → correct copy string
  bannedCopy?: string[];      // Copy that must never appear on this screen
}

// ─── P0 Fixes — Blocking ──────────────────────────────────────────────────────

export const SCREEN_FIXES: ScreenFix[] = [

  // ── AUTH ────────────────────────────────────────────────────────────────────

  {
    screenId: 'CPN-002',
    screenName: 'Phone Login',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      'Default country codes are +44 (UK) and +33 (France) — Stitch template defaults',
      'Copy says "trusted hospitality experience" — customer-side marketing, wrong context',
    ],
    requiredFixes: [
      'Default country code must be +91 (India) — pre-selected, not optional',
      'Remove +44 and +33 from the default dropdown — users can still search for them',
      'Replace "trusted hospitality experience" with "companion workspace"',
      'Phone input placeholder must show Indian format: 98765 43210',
    ],
    canonicalCopy: {
      HEADLINE: 'Welcome to CoBuddy Companion',
      SUBHEADLINE: 'Your verified companion workspace',
      PHONE_LABEL: 'Mobile Number',
      PHONE_PLACEHOLDER: '98765 43210',
      COUNTRY_CODE_DEFAULT: '+91',
      CTA_PRIMARY: 'Send OTP',
      FOOTER_NOTE: 'We\'ll send a 6-digit OTP to verify your number.',
    },
    bannedCopy: [
      'hospitality experience',
      'luxury',
      'concierge',
      '+44',
      '+33',
    ],
  },

  {
    screenId: 'CPN-003',
    screenName: 'OTP Verification',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      'Encoding artifacts: "We?Tve sent" — UTF-8 smart quote corruption from Stitch',
      'Phone example must use +91 masked format, not generic placeholder',
    ],
    requiredFixes: [
      'Fix all encoding artifacts — replace curly/smart quotes with straight quotes',
      'OTP destination preview must show masked +91 format: "+91 ••••••7890"',
      'Resend OTP timer must be 30 seconds (not variable)',
      'Input must be 6 numeric boxes, not a single text field',
    ],
    canonicalCopy: {
      HEADLINE: 'Verify Your Number',
      SUBHEADLINE: 'We\'ve sent a 6-digit OTP to',
      RESEND_LABEL: 'Resend OTP',
      RESEND_TIMER: 'Resend in {seconds}s',
      CTA_PRIMARY: 'Verify & Continue',
      ERROR_INVALID: 'The OTP you entered is incorrect. Please try again.',
      ERROR_EXPIRED: 'Your OTP has expired. Please request a new one.',
    },
    bannedCopy: ['We?Tve', 'We\u2019ve', 'didn\u2019t', '+44', '+33'],
  },

  {
    screenId: 'CPN-006',
    screenName: 'Location Permission',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      'Stitch export renders as phone_login copy (rendering/export issue)',
      'Needs proper location permission copy explaining venue proximity check',
    ],
    requiredFixes: [
      'Write fresh copy — do not use any Stitch reference for this screen',
      'Explain: location is used for venue proximity check-in only',
      'Clarify: exact location is never shared with customers',
      'GPS is obfuscated — only area name is used',
    ],
    canonicalCopy: {
      HEADLINE: 'Enable Location Access',
      SUBHEADLINE: 'Used only for session check-in and venue verification',
      BULLET_1: 'Verify you are at the approved public venue before check-in',
      BULLET_2: 'Your exact location is never shared with customers',
      BULLET_3: 'Location data is encrypted and not stored after the session',
      CTA_PRIMARY: 'Allow Location Access',
      CTA_SKIP: 'Not Now (limit some features)',
      PRIVACY_NOTE: 'CoBuddy only accesses your location when you are checking into a session.',
    },
    bannedCopy: ['tracking', 'monitor', 'always on', 'background location'],
  },

  // ── KYC / APPLICATION ────────────────────────────────────────────────────────

  {
    screenId: 'CPN-023',
    screenName: 'Basic Details (Application Step)',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      '"VERIFIED" badge appears on Step 1 of application — before any verification has occurred',
      'This misleads companions into thinking they are already verified',
    ],
    requiredFixes: [
      'Remove "VERIFIED" badge entirely from this screen',
      'Replace with a neutral step indicator: "Step 1 of 5 — Identity"',
      'Do not show any verification status badge during the application phase',
      'Use phase labels, not step counts: Identity → Safety → Financial → Profile → Submit',
    ],
    canonicalCopy: {
      STEP_LABEL: 'Identity',
      STEP_PROGRESS: 'Step 1 of 5',
      HEADLINE: 'Tell us about yourself',
    },
    bannedCopy: ['VERIFIED', 'Verified ✓', 'Identity Verified'],
  },

  {
    screenId: 'CPN-030',
    screenName: 'Service Style Preferences',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      '"Service style" label sounds like an escort-style service menu',
      'Can accidentally imply off-platform companion services',
    ],
    requiredFixes: [
      'Rename screen title to: "Communication & Activity Preferences"',
      'Rename all "service style" labels to "activity preference" or "communication style"',
      'All options must describe HOW the companion engages, not WHAT they offer privately',
    ],
    canonicalCopy: {
      SCREEN_TITLE: 'Communication & Activity Preferences',
      SECTION_COMM: 'Communication Style',
      SECTION_ACTIVITY: 'Activity Style',
      HELPER: 'These preferences help customers find a companion whose style matches their expectations for public social experiences.',
    },
    bannedCopy: ['service style', 'service menu', 'service type preference'],
  },

  {
    screenId: 'CPN-033',
    screenName: 'Companion Pricing',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      'Stitch uses luxury rate card language: "Platinum rate", "Vantage pricing"',
      'Does not match CoBuddy\'s simple hourly rate model',
    ],
    requiredFixes: [
      'Remove all luxury tier pricing language',
      'Use only: "Hourly Rate" and "Session Rate" labels',
      'Show one primary rate input — INR per hour',
      'Add note: "Your rate is subject to CoBuddy review before going live"',
      'Show platform fee disclosure: "CoBuddy deducts a small service fee from each session"',
    ],
    canonicalCopy: {
      SCREEN_TITLE: 'Set Your Session Rate',
      RATE_LABEL: 'Hourly Rate (INR)',
      RATE_PLACEHOLDER: 'e.g. \u20B91,200',
      REVIEW_NOTE: 'Your rate will be reviewed by CoBuddy before it goes live on your profile.',
      FEE_NOTE: 'CoBuddy deducts a small service fee per session. This is shown in your earnings breakdown.',
      MIN_RATE_NOTE: 'Minimum session rate: \u20B9200/hour',
    },
    bannedCopy: ['Platinum rate', 'Vantage pricing', 'premium tier', 'concierge rate', 'luxury rate'],
  },

  {
    screenId: 'CPN-040',
    screenName: 'Address Verification',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      'Purpose not explained — companions may fear their address is shared with customers',
      'No privacy disclaimer about address usage',
    ],
    requiredFixes: [
      'Add explicit privacy disclaimer: "Your exact address is NEVER visible to customers"',
      'Explain: address is used for service area matching only (city/area level)',
      'Show what data is used vs what stays private',
    ],
    canonicalCopy: {
      SCREEN_TITLE: 'Address Verification',
      PRIVACY_BADGE: 'Your address is never shared with customers',
      PRIVACY_NOTE: 'We use your address only to verify your service area. Customers see only your city and general area — never your exact address.',
      ADDRESS_LABEL: 'Residential Address',
      PURPOSE_NOTE: 'This is used for city and area matching during booking. It is reviewed only by CoBuddy\'s verification team.',
    },
    bannedCopy: ['address shared', 'customers will see', 'public address'],
  },

  {
    screenId: 'CPN-044',
    screenName: 'UPI Details',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      'UPI framed as "backup" without clarifying its purpose',
      'Could imply direct customer-to-companion UPI payments',
    ],
    requiredFixes: [
      'Rename section to: "UPI for Payout Disbursement"',
      'Add explicit disambiguation: "Customers never pay you via UPI"',
      'Clarify: UPI is an alternative to bank transfer for receiving payouts from CoBuddy',
      'Field label must be: "UPI ID (for receiving payouts)"',
    ],
    canonicalCopy: {
      SCREEN_TITLE: 'UPI for Payout Disbursement',
      FIELD_LABEL: 'UPI ID (for receiving payouts)',
      FIELD_PLACEHOLDER: 'yourname@upi',
      DISCLAIMER: 'Your UPI ID is used only for receiving payouts from CoBuddy. Customers do not pay you directly through UPI.',
      OPTIONAL_NOTE: 'UPI is optional if you have already added a verified bank account.',
    },
    bannedCopy: ['customer pays via UPI', 'backup payment', 'UPI payment from customer'],
  },

  // ── DASHBOARD ────────────────────────────────────────────────────────────────

  {
    screenId: 'CPN-061',
    screenName: 'Home Dashboard',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      'Notification snippet shows "platinum member is requesting" — fake membership tier',
      'Customer name appears in full in notification widget — must be masked',
    ],
    requiredFixes: [
      'Remove all "platinum", "gold member", "premium member" tier language',
      'Customer names in dashboard widgets must be initials only: "A.R."',
      'Replace member tier with: "Verified customer"',
      'Notification snippet body must never show full customer name',
    ],
    canonicalCopy: {
      REQUEST_SNIPPET: 'A verified customer sent a {category} request',
      CUSTOMER_LABEL: 'Verified customer',
    },
    bannedCopy: ['platinum member', 'gold member', 'premium member', 'elite member'],
  },

  {
    screenId: 'CPN-064',
    screenName: 'Performance Insights',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      'Shows "Vantage Performance" brand — does not exist in CoBuddy',
      'Fabricated metrics: "Satisfaction Index 97.2%", "Repeat Rate 94%" — misleading',
      'Would make companions make business decisions based on fake data',
    ],
    requiredFixes: [
      'Remove "Vantage Performance" header entirely — use "Your Performance"',
      'Remove all fabricated percentage metrics',
      'At MVP, show only real derivable metrics: rating, sessions count, acceptance rate, trust score',
      'Add "More detailed insights available after 10 sessions" note for new companions',
      'No chart/index at MVP — add only after real backend analytics are available',
    ],
    canonicalCopy: {
      SCREEN_TITLE: 'Your Performance',
      METRIC_RATING: 'Average Rating',
      METRIC_SESSIONS: 'Sessions Completed',
      METRIC_ACCEPTANCE: 'Request Acceptance Rate',
      METRIC_TRUST: 'Trust Score',
      EARLY_NOTE: 'More detailed performance insights become available after 10 completed sessions.',
    },
    bannedCopy: ['Vantage Performance', 'Satisfaction Index', 'Repeat Rate 94%', 'Elite Score'],
  },

  {
    screenId: 'CPN-065',
    screenName: 'Notification Center',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      '"Platinum member is requesting" in notification list item — wrong tier language',
      'Customer full name visible in notification list — must be masked to initials',
    ],
    requiredFixes: [
      'All notification list items must use customer initials only (never full name)',
      'Replace all tier language ("platinum", "premium") with "Verified customer"',
      'Notification body template must follow: "A verified customer sent a {category} request"',
    ],
    bannedCopy: ['platinum member', 'premium customer', 'elite user'],
  },

  {
    screenId: 'CPN-066',
    screenName: 'Important Announcements',
    priority: 'P0',
    decision: 'REWRITE',
    issues: ['"Vantage" used as announcement category header — wrong brand'],
    requiredFixes: [
      'Remove "Vantage" section header',
      'Replace with: "Platform Updates" or "CoBuddy Announcements"',
    ],
    canonicalCopy: {
      SCREEN_TITLE: 'Announcements',
      CATEGORY_SAFETY: 'Safety & Policy',
      CATEGORY_PAYOUT: 'Payout & Earnings',
      CATEGORY_TRAINING: 'Training',
      CATEGORY_CITY: 'City & Venue Updates',
    },
    bannedCopy: ['Vantage', 'Vantage Updates'],
  },

  // ── REQUESTS ─────────────────────────────────────────────────────────────────

  {
    screenId: 'CPN-084',
    screenName: 'Booking Accept Confirmation',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      '"Safety Bonus \u20B91150" appears as separate line item — disproportionate and confusing',
      'Bottom tab bar shows mid-flow — should not be visible during accept/reject decision',
    ],
    requiredFixes: [
      'Remove or clearly label the safety bonus — show it as: "Safety compliance bonus (if applicable)" with a ? info tooltip',
      'Hide bottom tab bar during the accept/decline confirmation flow',
      'Show only two CTAs: "Confirm Accept" and "Cancel"',
      'Earning breakdown must show: Base Rate + Extension Rate (if any). Bonus shown as optional.',
    ],
    canonicalCopy: {
      BONUS_LABEL: 'Safety bonus (if applicable)',
      BONUS_TOOLTIP: 'Safety bonuses are awarded after verified session completion, subject to CoBuddy review.',
      CTA_CONFIRM: 'Confirm & Accept',
      CTA_CANCEL: 'Go Back',
    },
    bannedCopy: ['Safety Bonus \u20B91150'],
  },

  {
    screenId: 'CPN-085',
    screenName: 'Booking Accepted Success',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      '"VANTAGE" appears in screen header — wrong brand',
      'Customer name "Aarav R." shown in full — must be initials only',
    ],
    requiredFixes: [
      'Remove "VANTAGE" header — replace with CoBuddy logo or "CoBuddy" wordmark',
      'Show customer as initials only: "A.R."',
    ],
    canonicalCopy: {
      HEADLINE: 'Booking Confirmed',
      CUSTOMER_LABEL: 'Customer',
    },
    bannedCopy: ['VANTAGE', 'Aarav R.', 'Ananya R.', 'Julian V.'],
  },

  {
    screenId: 'CPN-086',
    screenName: 'Booking Reject Reason',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      'CRITICAL: Brand name shows as "SafeSocial" — completely wrong brand',
      'This is a Stitch copy-paste from another app template',
    ],
    requiredFixes: [
      'Replace every instance of "SafeSocial" with "CoBuddy"',
      'Audit entire screen for any other brand leakage',
      'Decline reasons themselves are correct — keep them, only fix branding',
    ],
    bannedCopy: ['SafeSocial', 'Safe Social', 'SafeSocial Inc.'],
  },

  // ── SESSIONS ─────────────────────────────────────────────────────────────────

  {
    screenId: 'CPN-100',
    screenName: 'Session Prep Checklist',
    priority: 'P1',
    decision: 'REWRITE',
    issues: [
      'Stitch export shows 62% progress but actual checklist items not defined',
      '8 checklist items needed — not visible in Stitch',
    ],
    requiredFixes: [
      'Implement the full canonical 8-item checklist below',
      'First 5 = preparation items, Last 3 = safety confirmations (marked required)',
    ],
    canonicalCopy: {
      ITEM_1: 'Reviewed session details and customer trust score',
      ITEM_2: 'Confirmed venue location and meeting point',
      ITEM_3: 'Planned route to the approved venue',
      ITEM_4: 'Informed a trusted contact about the session',
      ITEM_5: 'Digital Session Pass is ready',
      ITEM_6: '(Required) Safety timer is set up',
      ITEM_7: '(Required) Safety tools are accessible on my device',
      ITEM_8: '(Required) I confirm this session is at an approved public venue',
    },
  },

  {
    screenId: 'CPN-103',
    screenName: 'Navigation to Venue',
    priority: 'P1',
    decision: 'REWRITE',
    issues: [
      'Stitch shows a fake in-app map — reimplementing Google Maps in-app is wrong approach',
      'Navigation must use system maps via deep link, not a fake map render',
    ],
    requiredFixes: [
      'Remove the fake map UI entirely',
      'Show venue name, area, and meeting point clearly',
      'Primary CTA: "Open in Maps" → deep link to Google Maps / Apple Maps with venue coordinates',
      'Show "Safe Travel Protocol" reminder: stick to public routes, ETA shared with customer only',
      'ETA display is fine — pull from Maps API or static estimate',
    ],
    canonicalCopy: {
      CTA_MAPS: 'Open in Google Maps',
      CTA_MAPS_ALT: 'Open in Maps',
      PROTOCOL_TITLE: 'Safe Travel Protocol',
      PROTOCOL_BODY: 'Travel via public routes. Your exact location is private — only your estimated arrival time is shared with the customer.',
    },
  },

  {
    screenId: 'CPN-108',
    screenName: 'In-Session Chat',
    priority: 'P1',
    decision: 'REWRITE',
    issues: [
      'No visible "no off-app contact" reminder in the chat UI',
      'Must prevent and flag requests for personal phone/email in chat',
    ],
    requiredFixes: [
      'Add persistent banner at top of chat: "Keep all communication within CoBuddy"',
      'Add "Report Off-App Request" quick action button in chat options menu',
      'Customer phone/email must NEVER appear in chat UI — masked even if customer sends it',
    ],
    canonicalCopy: {
      CHAT_BANNER: 'All communication must stay within CoBuddy.',
      REPORT_OPTION: 'Report Off-App Contact Request',
      PRIVACY_LOCK: 'Private & Encrypted',
    },
    bannedCopy: ['share your number', 'WhatsApp', 'Telegram', 'contact me at'],
  },

  {
    screenId: 'CPN-109',
    screenName: 'In-Session Call',
    priority: 'P1',
    decision: 'REWRITE',
    issues: [
      'Must confirm this is VoIP-only through CoBuddy, not a phone call',
      'Phone numbers must NEVER appear on this screen',
    ],
    requiredFixes: [
      'Show "In-App Call" label — never "Phone Call"',
      'Show customer as initials only',
      'Do NOT show any phone number — the call routes through CoBuddy VoIP',
      'Add "CoBuddy encrypted call" label to confirm platform routing',
    ],
    canonicalCopy: {
      CALL_TYPE: 'CoBuddy In-App Call',
      CALL_SUBTITLE: 'Encrypted · Routed through CoBuddy',
      CUSTOMER_LABEL: 'Customer',
      END_CALL: 'End Call',
    },
    bannedCopy: ['Phone Call', 'Calling +91', 'Direct Call'],
  },

  {
    screenId: 'CPN-118',
    screenName: 'Post-Session Notes',
    priority: 'P1',
    decision: 'REWRITE',
    issues: [
      '"High standards of safety and exclusivity" — "exclusivity" is wrong brand tone',
      'Must be 100% clear notes are internal only — not shared with customer',
    ],
    requiredFixes: [
      'Replace "exclusivity" with "professionalism and safety"',
      'Add visible "INTERNAL ONLY" or "Not shared with customer" label',
      'Notes guidance must specify: factual, professional, no personal details about customer',
    ],
    canonicalCopy: {
      SCREEN_TITLE: 'Post-Session Notes',
      INTERNAL_BADGE: 'Internal only — not shared with customer',
      GUIDANCE: 'Describe how the session went factually. Include any safety observations. These notes are reviewed only by CoBuddy if an issue is reported.',
      PLACEHOLDER: 'e.g. Session completed at the approved venue. Customer was respectful. No issues to report.',
    },
    bannedCopy: ['exclusivity', 'luxury standards', 'high-end service'],
  },

  // ── SAFETY ────────────────────────────────────────────────────────────────────

  {
    screenId: 'CPN-127',
    screenName: 'Safety Quiz',
    priority: 'P1',
    decision: 'REWRITE',
    issues: [
      'Quiz questions not defined in Stitch export — only the quiz UI shell exists',
    ],
    requiredFixes: [
      'Implement the 8 canonical quiz questions from canonicalContentRules.ts → SAFETY_QUIZ_QUESTIONS',
      'Each question must show feedback/explanation after answer',
      'Pass score: 7/8 correct (87.5%)',
      'Failed quiz must allow retry after 24 hours',
    ],
    canonicalCopy: {
      HEADLINE: 'Safety & Policy Quiz',
      PASS_MESSAGE: 'Congratulations! You\'ve completed the CoBuddy safety quiz.',
      FAIL_MESSAGE: 'You need 7 correct answers to pass. Review the guidelines and try again in 24 hours.',
      PASS_SCORE: '7 out of 8',
    },
  },

  // ── EARNINGS ──────────────────────────────────────────────────────────────────

  {
    screenId: 'CPN-141',
    screenName: 'Completed Payouts',
    priority: 'P1',
    decision: 'REWRITE',
    issues: [
      '"No external payout changes allowed" — copy is abrupt and sounds punitive',
    ],
    requiredFixes: [
      'Replace abrupt copy with clear, supportive explanation',
      'Make bank change process clear: requires support review for security',
    ],
    canonicalCopy: {
      BANK_CHANGE_NOTE: 'To update your payout bank details, please contact CoBuddy support. Changes require a security review to protect your earnings.',
      BANK_CHANGE_CTA: 'Request Bank Change via Support',
    },
    bannedCopy: ['No external payout changes allowed', 'changes blocked'],
  },

  {
    screenId: 'CPN-142',
    screenName: 'Payout Request',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      'Header shows "Platinum Concierge" — luxury tier that does not exist in CoBuddy',
    ],
    requiredFixes: [
      'Remove "Platinum Concierge" header entirely',
      'Replace with plain "Request Payout" header',
      'Screen content otherwise is functionally correct — only fix the header branding',
    ],
    canonicalCopy: {
      SCREEN_TITLE: 'Request Payout',
      HEADLINE: 'Withdraw Your Earnings',
    },
    bannedCopy: ['Platinum Concierge', 'Platinum', 'Concierge', 'Vantage'],
  },

  {
    screenId: 'CPN-150',
    screenName: 'Tax Invoice Details',
    priority: 'P1',
    decision: 'REWRITE',
    issues: [
      'Sample shows real-looking name "Advait Malhotra" — must use placeholder',
      '"GSTIN Not added" section lacks explanation for companions who don\'t have GST',
    ],
    requiredFixes: [
      'Replace "Advait Malhotra" with companion\'s display name from profile store',
      'Add explanation for GSTIN: "GSTIN is optional for individuals earning under \u20B920 lakh/year. Most companions are not required to register."',
      'PAN masking format: AB••••••XY — verify it is applied',
    ],
    canonicalCopy: {
      GSTIN_OPTIONAL_NOTE: 'GSTIN is optional. Individual companions earning under \u20B920 lakh per year are typically not required to register for GST.',
      GSTIN_ADD_CTA: 'Add GSTIN (Optional)',
    },
    bannedCopy: ['Advait Malhotra', 'dummy PAN', 'ABCDE1234F'],
  },

  // ── REVIEWS & TRUST ───────────────────────────────────────────────────────────

  {
    screenId: 'CPN-156',
    screenName: 'Badges & Achievements',
    priority: 'P1',
    decision: 'REWRITE',
    issues: [
      'Stitch shows fake luxury badges: "Vantage Elite", "Platinum Record"',
      'These have no business meaning and use banned brand terms',
    ],
    requiredFixes: [
      'Replace all Stitch badge designs with real CoBuddy achievement badges from canonicalContentRules.ts → AchievementBadges',
      'Each badge must show: name, description, earning criteria, icon from Material Icons',
      'Remove ALL "Vantage", "Platinum", "Elite", "Premium" badge names',
    ],
    bannedCopy: ['Vantage Elite', 'Platinum Record', 'Gold Standard', 'Premier Companion'],
  },

  // ── TRAINING ─────────────────────────────────────────────────────────────────

  {
    screenId: 'CPN-163',
    screenName: 'Training Lesson',
    priority: 'P1',
    decision: 'REWRITE',
    issues: [
      'Lesson content not defined in Stitch — only the lesson viewer shell exists',
    ],
    requiredFixes: [
      'Implement lessons using TRAINING_MODULES from canonicalContentRules.ts',
      'Required modules (TRN-01 to TRN-04) must be completed before profile goes live',
      'Each lesson must have: title, duration, description, completion tracking',
    ],
  },

  // ── SUPPORT ───────────────────────────────────────────────────────────────────

  {
    screenId: 'CPN-166',
    screenName: 'Support Center',
    priority: 'P1',
    decision: 'SIMPLIFY',
    issues: [
      'Two Stitch exports exist: support_center_screen_1 and support_center_screen_2 — duplicate',
    ],
    requiredFixes: [
      'Implement ONE canonical support center screen',
      'Use support_center_screen (Master Foundation) as the reference',
      'Tabs: My Tickets | Help Articles | Disputes | Live Chat',
    ],
    canonicalCopy: {
      SCREEN_TITLE: 'Support Center',
      TAB_TICKETS: 'My Tickets',
      TAB_HELP: 'Help Articles',
      TAB_DISPUTES: 'Disputes',
      TAB_CHAT: 'Live Chat',
    },
  },

  {
    screenId: 'CPN-174',
    screenName: 'Appeal Decision',
    priority: 'P1',
    decision: 'REWRITE',
    issues: [
      'No SLA shown for appeal review',
      'No limit on how many times a companion can appeal the same dispute',
    ],
    requiredFixes: [
      'Add SLA note: "CoBuddy reviews appeals within 5 business days"',
      'Add appeal limit rule: "One appeal is allowed per dispute decision"',
      'If appeal is already filed, disable the appeal CTA and show status',
    ],
    canonicalCopy: {
      SLA_NOTE: 'Appeals are reviewed within 5 business days. You will be notified of the outcome via the Support Center.',
      LIMIT_NOTE: 'One appeal is permitted per dispute decision.',
      FILED_STATUS: 'Your appeal is under review.',
    },
  },

  // ── PROFILE ───────────────────────────────────────────────────────────────────

  {
    screenId: 'CPN-182',
    screenName: 'Edit Pricing',
    priority: 'P1',
    decision: 'REWRITE',
    issues: [
      'Pricing edits take effect immediately without review — rate changes should be reviewed',
    ],
    requiredFixes: [
      'After companion saves new rate, set a "pending review" state',
      'Show note: "Your updated rate will be reviewed by CoBuddy before going live (typically within 24 hours)"',
      'Current live rate remains active until new rate is approved',
    ],
    canonicalCopy: {
      REVIEW_GATE_NOTE: 'Your updated session rate will be reviewed by CoBuddy before it appears on your profile. Your current rate remains active until the update is approved.',
      REVIEW_SLA: 'Typically reviewed within 24 hours.',
    },
  },

  {
    screenId: 'CPN-184',
    screenName: 'Gallery Photo Manager',
    priority: 'P2',
    decision: 'REWRITE',
    issues: [
      'Only shows "Drag to reorder" — no indicator for photos under review after update',
    ],
    requiredFixes: [
      'Show "Under Review" badge on photos that have been updated and are pending approval',
      'Show "Live" badge on currently approved and published photos',
      'Add note: "Updated photos are reviewed within 24 hours before going live"',
    ],
    canonicalCopy: {
      UNDER_REVIEW_BADGE: 'Under Review',
      LIVE_BADGE: 'Live',
      REVIEW_NOTE: 'Updated photos are reviewed by CoBuddy within 24 hours.',
    },
  },

  {
    screenId: 'CPN-194',
    screenName: 'Data Download',
    priority: 'P2',
    decision: 'REWRITE',
    issues: [
      '"High-level security protocols" is vague marketing speak',
      'No clear mechanism explained for how data is delivered',
    ],
    requiredFixes: [
      'Replace "high-level security protocols" with specific delivery mechanism',
      'Explain: data is exported as an encrypted file sent to companion\'s registered email',
    ],
    canonicalCopy: {
      DELIVERY_NOTE: 'Your data export will be sent as a secure, encrypted file to your registered email address within 24 hours.',
      SECURITY_NOTE: 'The export is encrypted and protected. It includes your session history, earnings reports, and verification details.',
    },
    bannedCopy: ['high-level security protocols', 'enterprise-grade encryption', 'military-grade'],
  },

  // ── ACCOUNT STATES ────────────────────────────────────────────────────────────

  {
    screenId: 'CPN-197',
    screenName: 'Account Deactivated',
    priority: 'P0',
    decision: 'REWRITE',
    issues: [
      '"CoBuddy Executive" appears as header — wrong brand name variant',
      'Payout amount shown on deactivated state — privacy/security risk during review',
    ],
    requiredFixes: [
      'Replace "CoBuddy Executive" with plain "CoBuddy" header',
      'Do NOT show pending payout amount on deactivated screen — show "Contact support for earnings information"',
      'Deactivated state must clearly show what IS and IS NOT accessible',
    ],
    canonicalCopy: {
      HEADLINE: 'Account Deactivated',
      EARNINGS_PLACEHOLDER: 'Contact CoBuddy support for information about your pending earnings.',
      EARNINGS_NOTE: 'Your earnings are protected during the review period.',
    },
    bannedCopy: ['CoBuddy Executive', 'Executive Panel', 'CoBuddy Pro'],
  },
];

// ─── Lookup Utility ───────────────────────────────────────────────────────────

/**
 * Get the fix entry for a specific screen.
 * Returns undefined if no fix is needed (screen is KEEP AS IS).
 */
export function getScreenFix(screenId: string): ScreenFix | undefined {
  return SCREEN_FIXES.find(f => f.screenId === screenId);
}

/**
 * Get all P0 fixes — these must be applied before any screen is marked complete.
 */
export function getP0Fixes(): ScreenFix[] {
  return SCREEN_FIXES.filter(f => f.priority === 'P0');
}

/**
 * Get all fixes for a given priority level.
 */
export function getFixesByPriority(priority: FixPriority): ScreenFix[] {
  return SCREEN_FIXES.filter(f => f.priority === priority);
}
