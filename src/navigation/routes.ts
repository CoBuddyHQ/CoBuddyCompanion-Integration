/**
 * CoBuddy Companion App — Route Registry
 * All 206 CPN screen route constants.
 * Group screens by module. Use ONLY these constants for navigation.
 */

export const Routes = {
  // ─── Auth (CPN-001 → CPN-009) ─────────────────────────────────────────────
  SPLASH: 'CPN_001_Splash',
  PHONE_LOGIN: 'CPN_002_PhoneLogin',
  OTP_VERIFICATION: 'CPN_003_OTPVerification',
  LANGUAGE_SELECTION: 'CPN_004_LanguageSelection',
  NOTIFICATION_PERMISSION: 'CPN_005_NotificationPermission',
  LOCATION_PERMISSION: 'CPN_006_LocationPermission',
  CREATE_PIN: 'CPN_007_CreatePIN',
  CONFIRM_PIN: 'CPN_008_ConfirmPIN',
  BIOMETRIC_SETUP: 'CPN_009_BiometricSetup',

  // ─── Onboarding (CPN-010 → CPN-012) ──────────────────────────────────────
  COMPANION_WELCOME: 'CPN_010_CompanionWelcome',
  ROLE_CONFIRMATION: 'CPN_011_RoleConfirmation',
  TERMS_CONSENT: 'CPN_012_TermsConsent',

  // ─── Application / KYC (CPN-021 → CPN-050) ───────────────────────────────
  JOURNEY_INTRO: 'CPN_021_JourneyIntro',
  ELIGIBILITY_CONFIRMATION: 'CPN_022_EligibilityConfirmation',
  BASIC_DETAILS: 'CPN_023_BasicDetails',
  BIO_INTRODUCTION: 'CPN_024_BioIntroduction',
  BACKGROUND_DECLARATION: 'CPN_025_BackgroundDeclaration',
  EXPERIENCE_CATEGORIES: 'CPN_026_ExperienceCategories',
  INTERESTS_PERSONALITY: 'CPN_027_InterestsPersonality',
  WORK_PREFERENCE: 'CPN_028_WorkPreference',
  CITY_SERVICE_AREA: 'CPN_029_CityServiceArea',
  SERVICE_STYLE_PREFERENCES: 'CPN_030_ServiceStylePreferences',
  PUBLIC_VENUE_PREFERENCE: 'CPN_031_PublicVenuePreference',
  BOUNDARIES_SAFETY: 'CPN_032_BoundariesSafety',
  COMPANION_PRICING: 'CPN_033_CompanionPricing',
  LANGUAGES_SELECTION: 'CPN_034_LanguagesSelection',
  PROFILE_PHOTO_UPLOAD: 'CPN_035_ProfilePhotoUpload',
  GOVERNMENT_ID_TYPE: 'CPN_036_GovernmentIDType',
  GOVERNMENT_ID_UPLOAD: 'CPN_037_GovernmentIDUpload',
  SELFIE_CAPTURE: 'CPN_038_SelfieCapture',
  LIVENESS_DETECTION: 'CPN_039_LivenessDetection',
  ADDRESS_VERIFICATION: 'CPN_040_AddressVerification',
  PAN_TAX_DETAILS: 'CPN_041_PANTaxDetails',
  ADD_BANK_ACCOUNT: 'CPN_042_AddBankAccount',
  BANK_ACCOUNT_VERIFICATION: 'CPN_043_BankAccountVerification',
  UPI_DETAILS: 'CPN_044_UPIDetails',
  PROFILE_SETUP_INTRO: 'CPN_045_ProfileSetupIntro',
  PROFILE_COMPLETION_CHECKLIST: 'CPN_046_ProfileCompletionChecklist',
  APPLICATION_PROGRESS: 'CPN_047_ApplicationProgress',
  APPLICATION_REVIEW_INFO: 'CPN_048_ApplicationReviewInfo',
  SUBMIT_PROFILE_FOR_APPROVAL: 'CPN_049_SubmitProfileForApproval',
  APPLICATION_SAVED_DRAFT: 'CPN_050_ApplicationSavedDraft',

  // ─── Verification (CPN-051 → CPN-059) ────────────────────────────────────
  VERIFICATION_HUB: 'CPN_051_VerificationHub',
  VERIFICATION_PENDING: 'CPN_052_VerificationPending',
  VERIFICATION_PROCESSING: 'CPN_053_VerificationProcessing',
  VERIFICATION_APPROVED: 'CPN_054_VerificationApproved',
  VERIFICATION_REJECTED: 'CPN_055_VerificationRejected',
  RESUBMIT_VERIFICATION: 'CPN_056_ResubmitVerification',
  PROFILE_REVIEW_PENDING: 'CPN_057_ProfileReviewPending',
  PROFILE_APPROVED_PUBLISHED: 'CPN_058_ProfileApprovedPublished',
  PROFILE_EDIT_REJECTED: 'CPN_059_ProfileEditRejected',

  // ─── Dashboard (CPN-061 → CPN-066) ───────────────────────────────────────
  HOME_DASHBOARD: 'CPN_061_HomeDashboard',
  TODAY_OVERVIEW: 'CPN_062_TodayOverview',
  QUICK_ACTIONS: 'CPN_063_QuickActions',
  PERFORMANCE_INSIGHTS: 'CPN_064_PerformanceInsights',
  NOTIFICATION_CENTER: 'CPN_065_NotificationCenter',
  IMPORTANT_ANNOUNCEMENTS: 'CPN_066_ImportantAnnouncements',

  // ─── Availability (CPN-071 → CPN-078) ────────────────────────────────────
  AVAILABILITY_CALENDAR: 'CPN_071_AvailabilityCalendar',
  ADD_AVAILABILITY_SLOT: 'CPN_072_AddAvailabilitySlot',
  EDIT_AVAILABILITY_SLOT: 'CPN_073_EditAvailabilitySlot',
  WEEKLY_RECURRING_AVAILABILITY: 'CPN_074_WeeklyRecurringAvailability',
  BLOCK_TIME_DAY_OFF: 'CPN_075_BlockTimeDayOff',
  AVAILABILITY_CONFLICT: 'CPN_076_AvailabilityConflict',
  LIVE_AVAILABILITY_TOGGLE: 'CPN_077_LiveAvailabilityToggle',
  VACATION_MODE: 'CPN_078_VacationMode',

  // ─── Booking Requests (CPN-081 → CPN-090) ────────────────────────────────
  BOOKING_REQUESTS_INBOX: 'CPN_081_BookingRequestsInbox',
  NEW_BOOKING_REQUEST_DETAIL: 'CPN_082_NewBookingRequestDetail',
  CUSTOMER_TRUST_SNAPSHOT: 'CPN_083_CustomerTrustSnapshot',
  BOOKING_ACCEPT_CONFIRMATION: 'CPN_084_BookingAcceptConfirmation',
  BOOKING_ACCEPTED_SUCCESS: 'CPN_085_BookingAcceptedSuccess',
  BOOKING_REJECT_REASON: 'CPN_086_BookingRejectReason',
  BOOKING_DECLINED_SUCCESS: 'CPN_087_BookingDeclinedSuccess',
  SUGGEST_DIFFERENT_TIME: 'CPN_088_SuggestDifferentTime',
  EXPIRED_BOOKING_REQUEST: 'CPN_089_ExpiredBookingRequest',
  BOOKING_REQUEST_EMPTY_STATE: 'CPN_090_BookingRequestEmptyState',
  BOOKING_REQUESTS_FILTER: 'CPN_091_BookingRequestsFilter',

  // ─── Sessions (CPN-096 → CPN-120) ────────────────────────────────────────
  UPCOMING_SESSIONS: 'CPN_096_UpcomingSessions',
  SESSION_DETAIL: 'CPN_097_SessionDetail',
  DIGITAL_SESSION_PASS: 'CPN_098_DigitalSessionPass',
  SESSION_REMINDER: 'CPN_099_SessionReminder',
  SESSION_PREP_CHECKLIST: 'CPN_100_SessionPrepChecklist',
  CUSTOMER_PROFILE_SAFETY_SUMMARY: 'CPN_101_CustomerProfileSafetySummary',
  VENUE_MEETING_POINT_DETAIL: 'CPN_102_VenueMeetingPointDetail',
  NAVIGATION_TO_VENUE: 'CPN_103_NavigationToVenue',
  PRE_ARRIVAL: 'CPN_104_PreArrival',
  ARRIVAL_CHECK_IN: 'CPN_105_ArrivalCheckIn',
  CUSTOMER_ARRIVAL_VERIFICATION: 'CPN_106_CustomerArrivalVerification',
  ACTIVE_SESSION: 'CPN_107_ActiveSession',
  IN_SESSION_CHAT: 'CPN_108_InSessionChat',
  IN_SESSION_CALL: 'CPN_109_InSessionCall',
  LIVE_LOCATION_SHARING: 'CPN_110_LiveLocationSharing',
  EXTEND_SESSION_REQUEST: 'CPN_111_ExtendSessionRequest',
  EXTEND_SESSION_CONFIRMATION: 'CPN_112_ExtendSessionConfirmation',
  EARLY_END_SESSION: 'CPN_113_EarlyEndSession',
  CANCEL_SESSION_REQUEST: 'CPN_114_CancelSessionRequest',
  CANCELLATION_REASON: 'CPN_115_CancellationReason',
  CANCELLATION_REVIEW_PENDING: 'CPN_116_CancellationReviewPending',
  CUSTOMER_NO_SHOW: 'CPN_117_CustomerNoShow',
  POST_SESSION_NOTES: 'CPN_118_PostSessionNotes',
  SESSION_COMPLETE: 'CPN_119_SessionComplete',
  CUSTOMER_RATING_FEEDBACK: 'CPN_120_CustomerRatingFeedback',

  // ─── Safety (CPN-121 → CPN-136) ──────────────────────────────────────────
  COMPANION_SAFETY_HUB: 'CPN_121_CompanionSafetyHub',
  SAFETY_TIMER: 'CPN_122_SafetyTimer',
  SOS: 'CPN_123_SOS',
  SOS_CONFIRMATION: 'CPN_124_SOSConfirmation',
  SAFETY_GUIDELINES: 'CPN_125_SafetyGuidelines',
  PUBLIC_VENUE_RULES: 'CPN_126_PublicVenueRules',
  SAFETY_QUIZ: 'CPN_127_SafetyQuiz',
  EMERGENCY_CONTACT_SETUP: 'CPN_128_EmergencyContactSetup',
  TRUSTED_CONTACTS: 'CPN_129_TrustedContacts',
  ADD_TRUSTED_CONTACT: 'CPN_130_AddTrustedContact',
  EDIT_TRUSTED_CONTACT: 'CPN_131_EditTrustedContact',
  BLOCK_CUSTOMER: 'CPN_132_BlockCustomer',
  REPORT_CUSTOMER: 'CPN_133_ReportCustomer',
  INCIDENT_REPORT: 'CPN_134_IncidentReport',
  INCIDENT_EVIDENCE_UPLOAD: 'CPN_135_IncidentEvidenceUpload',
  INCIDENT_SUBMITTED: 'CPN_136_IncidentSubmitted',

  // ─── Earnings (CPN-137 → CPN-150) ────────────────────────────────────────
  EARNINGS_DASHBOARD: 'CPN_137_EarningsDashboard',
  DAILY_EARNINGS_BREAKDOWN: 'CPN_138_DailyEarningsBreakdown',
  WEEKLY_MONTHLY_EARNINGS: 'CPN_139_WeeklyMonthlyEarnings',
  PENDING_EARNINGS: 'CPN_140_PendingEarnings',
  COMPLETED_PAYOUTS: 'CPN_141_CompletedPayouts',
  PAYOUT_REQUEST: 'CPN_142_PayoutRequest',
  PAYOUT_REVIEW: 'CPN_143_PayoutReview',
  PAYOUT_SUCCESS: 'CPN_144_PayoutSuccess',
  PAYOUT_PENDING: 'CPN_145_PayoutPending',
  PAYOUT_FAILED: 'CPN_146_PayoutFailed',
  REFUND_PENALTY_EXPLANATION: 'CPN_147_RefundPenaltyExplanation',
  TRANSACTION_HISTORY: 'CPN_148_TransactionHistory',
  TRANSACTION_DETAIL: 'CPN_149_TransactionDetail',
  TAX_INVOICE_DETAILS: 'CPN_150_TaxInvoiceDetails',

  // ─── Reviews & Trust (CPN-156 → CPN-161) ─────────────────────────────────
  REVIEWS_DASHBOARD: 'CPN_156_ReviewsDashboard',
  REVIEW_DETAIL: 'CPN_157_ReviewDetail',
  TRUST_SCORE_DASHBOARD: 'CPN_158_TrustScoreDashboard',
  TRUST_SCORE_SUMMARY: 'CPN_159_TrustScoreSummary',
  TRUST_SCORE_IMPROVEMENT_TASKS: 'CPN_160_TrustScoreImprovementTasks',
  BADGES_ACHIEVEMENTS: 'CPN_161_BadgesAchievements',

  // ─── Training (CPN-162 → CPN-164) ────────────────────────────────────────
  TRAINING_HUB: 'CPN_162_TrainingHub',
  TRAINING_LESSON: 'CPN_163_TrainingLesson',
  TRAINING_COMPLETED: 'CPN_164_TrainingCompleted',

  // ─── Support & Disputes (CPN-166 → CPN-174) ──────────────────────────────
  SUPPORT_CENTER: 'CPN_166_SupportCenter',
  // CPN-167 intentionally unassigned (Stitch design gap — do not fill)
  CREATE_SUPPORT_TICKET: 'CPN_168_CreateSupportTicket',
  SUPPORT_TICKET_DETAIL: 'CPN_169_SupportTicketDetail',
  LIVE_SUPPORT_CHAT: 'CPN_170_LiveSupportChat',
  HELP_ARTICLE: 'CPN_171_HelpArticle',
  DISPUTE_CENTER: 'CPN_172_DisputeCenter',
  DISPUTE_DETAIL: 'CPN_173_DisputeDetail',
  APPEAL_DECISION: 'CPN_174_AppealDecision',

  // ─── Profile (CPN-175 → CPN-186) ─────────────────────────────────────────
  COMPANION_PROFILE: 'CPN_175_CompanionProfile',
  PROFILE_PREVIEW: 'CPN_176_ProfilePreview',
  EDIT_BASIC_PROFILE: 'CPN_177_EditBasicProfile',
  EDIT_BIO: 'CPN_178_EditBio',
  EDIT_CATEGORIES: 'CPN_179_EditCategories',
  EDIT_LANGUAGES: 'CPN_180_EditLanguages',
  EDIT_SERVICE_AREAS: 'CPN_181_EditServiceAreas',
  EDIT_PRICING: 'CPN_182_EditPricing',
  GALLERY_PHOTO_MANAGER: 'CPN_184_GalleryPhotoManager',
  TRAVEL_RADIUS_PREFERENCE: 'CPN_185_TravelRadiusPreference',
  SERVICE_AREA_MAP: 'CPN_186_ServiceAreaMap',

  // ─── Settings (CPN-187 → CPN-195) ────────────────────────────────────────
  ACCOUNT_SETTINGS: 'CPN_187_AccountSettings',
  NOTIFICATION_PREFERENCES: 'CPN_188_NotificationPreferences',
  PRIVACY_CONTROLS: 'CPN_189_PrivacyControls',
  LANGUAGE_SETTINGS: 'CPN_190_LanguageSettings',
  ACCESSIBILITY_TEXT_SIZE: 'CPN_191_AccessibilityTextSize',
  POLICY_CENTER: 'CPN_192_PolicyCenter',
  LEGAL_AGREEMENTS: 'CPN_193_LegalAgreements',
  DATA_DOWNLOAD: 'CPN_194_DataDownload',
  DELETE_ACCOUNT: 'CPN_195_DeleteAccount',
  BANK_DETAILS: 'CPN_196_BankDetails',
  CHANGE_PIN: 'CPN_CHANGE_PIN',

  // ─── Account States (CPN-196 → CPN-200) ──────────────────────────────────
  ACCOUNT_SUSPENDED: 'CPN_196_AccountSuspended',
  ACCOUNT_DEACTIVATED: 'CPN_197_AccountDeactivated',
  ACCOUNT_UNDER_MANUAL_REVIEW: 'CPN_198_AccountUnderManualReview',
  ACCOUNT_REACTIVATION_REQUEST: 'CPN_199_AccountReactivationRequest',
  POLICY_VIOLATION_NOTICE: 'CPN_200_PolicyViolationNotice',

  // ─── Full-Screen System States (CPN-204 → CPN-206) ───────────────────────
  // NOTE: CPN-201 (EmptyState), CPN-202 (LoadingState), CPN-203 (GenericError)
  // are REUSABLE COMPONENTS, not navigable screens. Do not add them as routes.
  NETWORK_ERROR: 'CPN_204_NetworkError',
  MAINTENANCE_MODE: 'CPN_205_MaintenanceMode',
  FORCE_UPDATE: 'CPN_206_ForceUpdate',

  // ─── Session Incoming Call (CPN-207) ──────────────────────────────────────
  INCOMING_CALL: 'CPN_207_IncomingCall',
} as const;

export type RouteKey = keyof typeof Routes;
export type RouteName = (typeof Routes)[RouteKey];
