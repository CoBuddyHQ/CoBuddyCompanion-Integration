import i18next from "i18next"; /**
 * CoBuddy Companion App — Application & KYC Screen Content
 * Approved copy for CPN-021 through CPN-050.
 *
 * AUTHORITY: This file is the canonical copy source for Phase 4A screens.
 * All content reviewed against:
 *   - canonicalContentRules.ts (brand, banned terms, masking)
 *   - screenContentFixes.ts (P0/P1 screen-specific fixes)
 *   - Product Content QA audit
 *
 * DO NOT:
 *   - Use Stitch-generated text directly in screens.
 *   - Hardcode copy inside components.
 *   - Use banned terms: SafeSocial, Vantage, Platinum, concierge, hospitality,
 *     escort, dating, romantic, private meeting, hotel room.
 *   - Show "Step X of 17" numbering anywhere.
 */

// ─── Progress Phases (used across CPN-021 to CPN-050) ────────────────────────

export const APPLICATION_PHASES = [
{ id: 'identity', label: i18next.t("content.content.applicationKycContent.identity"), icon: 'person' },
{ id: 'safety', label: i18next.t("content.content.applicationKycContent.safety"), icon: 'shield' },
{ id: 'financial', label: i18next.t("content.content.applicationKycContent.financial"), icon: 'account-balance' },
{ id: 'profile', label: i18next.t("content.content.applicationKycContent.profile"), icon: 'badge' }] as
const;

export type ApplicationPhaseId = (typeof APPLICATION_PHASES)[number]['id'];

// ─── Common UI Strings ────────────────────────────────────────────────────────
export const CommonKycContent = {
  CANCEL: 'Cancel',
  CONFIRM: 'Confirm',
  REQUIRED: 'Required',
  NEXT_STEP: 'Next step',
  CORRECTIONS_REQUIRED: 'Corrections Required',
  REVIEW_STARTED: 'REVIEW STARTED',
  WHAT_HAPPENS_NEXT: 'WHAT HAPPENS NEXT',
  REVIEW_TIMELINE: 'REVIEW TIMELINE',
  OVERALL_READINESS: 'Overall readiness',
  FINAL_REVIEW_REQUIRED: 'Final review required',
  VERIFICATION_COMPLETE: 'VERIFICATION COMPLETE',
  APPROVED: 'Approved',
  VERIFICATION_NOT_APPROVED: 'Verification not approved',
  EDIT_REVIEW_NOT_APPROVED: 'Edit review not approved',
  VERIFICATION_PROGRESS: 'Verification Progress',
  PROFILE_SETUP_PROGRESS: 'Profile Setup Progress',
  REQUIRED_STEPS: 'REQUIRED STEPS',
  TAP_TO_COMPLETE: 'Tap to complete',
  SUBMITTED: 'Submitted'
} as const;

// ─── CPN-021: Journey Intro ───────────────────────────────────────────────────

export const JourneyIntroContent = {
  HEADLINE: 'Your Companion Journey',
  SUBHEADLINE: 'A verified companion application. Complete at your own pace — your progress is saved for this session.',
  SECTION_TITLE: 'Application Overview',
  SECTION_BODY: 'Your application has four phases. Each phase covers a different part of your profile. You can move back and forth freely and resume any saved progress.',
  PHASE_LABELS: [
  { phase: 'Profile Setup', desc: 'Basic info, bio, experience, preferences and service area' },
  { phase: 'Identity & Documents', desc: 'Government ID, selfie, liveness check, address and PAN' },
  { phase: 'Financial Setup', desc: 'Session pricing, verified bank account and UPI payout details' },
  { phase: 'Review & Submit', desc: 'Final checklist, application review and submission for CoBuddy approval' }],

  PRIVACY_NOTE: 'Your information is encrypted and used only for verification. It is never shared with customers.',
  SAVE_NOTE: 'Progress is saved during your current session. Complete submission when you are ready.',
  CTA_PRIMARY: 'Begin Application',
  CTA_SECONDARY: 'Continue Saved Draft',
  SECTION_BADGE: 'Phase 1 of 4  ·  Profile Setup'
} as const;

// ─── CPN-022: Eligibility Confirmation ───────────────────────────────────────

export const EligibilityContent = {
  HEADLINE: 'Confirm Your Eligibility',
  SUBHEADLINE: 'Before you begin, please confirm you meet all requirements to apply as a CoBuddy Companion.',
  SECTION_TITLE: 'Eligibility Requirements',
  SECTION_BODY: 'All five confirmations are required to proceed. If you do not meet any requirement, you will not be able to complete the application at this time.',
  CONFIRMATIONS: [
  {
    id: 'age',
    icon: 'cake',
    label: i18next.t("content.content.applicationKycContent.i_am_18_years_of_age_or_older"),
    note: 'Age is verified during identity check.'
  },
  {
    id: 'public_venues',
    icon: 'store',
    label: i18next.t("content.content.applicationKycContent.i_understand_all_sessions_take_place_exc"),
    note: 'Private homes, hotel rooms, and isolated locations are not permitted.'
  },
  {
    id: 'conduct',
    icon: 'people',
    label: i18next.t("content.content.applicationKycContent.i_will_maintain_professional_non_romanti"),
    note: 'CoBuddy provides verified social experiences — not dating or romantic services.'
  },
  {
    id: 'in_app',
    icon: 'lock',
    label: i18next.t("content.content.applicationKycContent.all_communication_and_payments_happen_th"),
    note: 'No off-app contact, direct cash, or external platform transfers.'
  },
  {
    id: 'verification',
    icon: 'verified-user',
    label: i18next.t("content.content.applicationKycContent.i_agree_to_complete_identity_and_safety"),
    note: 'Verification documents are encrypted and reviewed only for compliance.'
  }],

  CTA_PRIMARY: 'I Confirm — Continue',
  CTA_DISABLED_TIP: 'Please confirm all requirements to continue.',
  BADGE_LABEL: 'Phase 1 of 4  ·  Profile Setup'
} as const;

// ─── CPN-023: Basic Details ───────────────────────────────────────────────────
// FIX: No VERIFIED badge on Step 1. Applicant is not yet verified.
// Explain legal name vs display name distinction clearly.

export const BasicDetailsContent = {
  HEADLINE: 'Your Basic Details',
  SUBHEADLINE: 'These details are used for identity verification. They are not visible to customers unless stated.',
  LEGAL_NAME_LABEL: 'Legal Full Name',
  LEGAL_NAME_HINT: 'As it appears on your government ID. Used for identity verification only.',
  LEGAL_NAME_PLACEHOLDER: 'First and last name',
  DISPLAY_NAME_LABEL: 'Display Name',
  DISPLAY_NAME_HINT: 'This is how customers will see your name on your public profile. First name or a professional alias is recommended.',
  DISPLAY_NAME_PLACEHOLDER: 'Your preferred display name',
  EMAIL_LABEL: 'Email Address',
  EMAIL_HINT: 'Used for application updates and important account notifications. Not shared with customers.',
  EMAIL_PLACEHOLDER: 'you@email.com',
  DOB_LABEL: 'Date of Birth',
  DOB_PLACEHOLDER: 'Select your date of birth',
  DOB_PRIVACY_NOTE: 'Your date of birth is used for eligibility and identity verification. It is never shown on your public profile.',
  DOB_AGE_GATE: 'You must be 18 years or older to become a CoBuddy Companion.',
  GENDER_LABEL: 'Gender',
  GENDER_HINT: 'Optional. Helps match you with suitable booking requests.',
  GENDER_OPTIONS: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
  PRIVACY_NOTE: 'Your legal name and date of birth are encrypted and used only for verification. They are never visible to customers.',
  CTA_PRIMARY: 'Save & Continue',
  SECTION_BADGE: 'Phase 1 of 4  ·  Profile Setup',
  // Below added during audit cleanup:
  SECTION_IDENTITY_TITLE: 'Identity Details',
  SECTION_IDENTITY_SUB: 'Used for verification only. Not visible to customers.',
  SECTION_CONTACT_TITLE: 'Contact & Date of Birth',
  SECTION_CONTACT_SUB: 'Email for notifications. DOB for age verification.',
  DOB_MODAL_SUB: 'Scroll to select day, month, and year',
  DOB_MODAL_DAY: 'Day',
  DOB_MODAL_MONTH: 'Month',
  DOB_MODAL_YEAR: 'Year',
  DOB_MODAL_CANCEL: 'Cancel',
  DOB_MODAL_CONFIRM: 'Confirm',
  ACCESSIBILITY_LEGAL_NAME: 'Legal full name',
  ACCESSIBILITY_DISPLAY_NAME: 'Display name',
  ACCESSIBILITY_EMAIL: 'Email address',
  ACCESSIBILITY_SAVE: 'Save basic details and continue'
} as const;

// ─── CPN-024: Bio Introduction ────────────────────────────────────────────────

export const BioIntroContent = {
  HEADLINE: 'Write Your Professional Bio',
  SUBHEADLINE: 'Your bio is the first thing a customer reads about you. Keep it professional, genuine, and focused on your interests and experiences.',
  BIO_LABEL: 'Professional Introduction',
  BIO_PLACEHOLDER: 'Tell customers about your interests, the activities you enjoy, and what makes you a great companion for public social experiences. For example: your favourite café activities, cultural interests, or city knowledge.',
  CHAR_MIN: 50,
  CHAR_MAX: 500,
  CHAR_HINT: '{current} / {max} characters',
  GUIDELINES_TITLE: 'Writing Guidelines',
  GUIDELINES: [
  { icon: 'check_circle', text: 'Focus on your genuine interests and activities you enjoy in public.' },
  { icon: 'check_circle', text: 'Mention specific things you like: art, food, books, city walks, events.' },
  { icon: 'check_circle', text: 'Use a warm, professional tone — as if introducing yourself to a new colleague.' },
  { icon: 'cancel', text: 'Do not use dating, romantic, or suggestive language.' },
  { icon: 'cancel', text: 'Do not mention private meetings, hotel visits, or home visits.' },
  { icon: 'cancel', text: 'Do not include external contact details (WhatsApp, Instagram, Telegram).' }],

  BLOCKED_NOTICE: 'Your bio contains content that does not meet CoBuddy professional standards. Please keep your bio focused on public social activities.',
  CTA_PRIMARY: 'Save & Continue',
  SECTION_BADGE: 'Phase 1 of 4  ·  Profile Setup'
} as const;

// ─── CPN-025: Background Declaration ─────────────────────────────────────────

export const BackgroundDeclarationContent = {
  HEADLINE: 'Professional Declaration',
  SUBHEADLINE: 'Please confirm the following statements before continuing your application.',
  SECTION_TITLE: 'Declaration of Professional Standards',
  SECTION_BODY: 'This declaration ensures CoBuddy maintains a safe, professional platform for both companions and customers. All statements must be true and confirmed.',
  DECLARATIONS: [
  {
    id: 'accurate_info',
    icon: 'check-circle',
    label: i18next.t("content.content.applicationKycContent.all_information_i_provide_in_this_applic")
  },
  {
    id: 'public_venue_only',
    icon: 'store',
    label: i18next.t("content.content.applicationKycContent.i_will_conduct_all_sessions_exclusively")
  },
  {
    id: 'professional_conduct',
    icon: 'people',
    label: i18next.t("content.content.applicationKycContent.i_will_maintain_professional_conduct_dur")
  },
  {
    id: 'no_private_contact',
    icon: 'phone-locked',
    label: i18next.t("content.content.applicationKycContent.i_will_not_share_personal_contact_inform")
  },
  {
    id: 'safety_policy',
    icon: 'shield',
    label: i18next.t("content.content.applicationKycContent.i_have_read_and_will_comply_with_cobuddy")
  },
  {
    id: 'no_misrepresentation',
    icon: 'verified-user',
    label: i18next.t("content.content.applicationKycContent.i_understand_that_providing_false_inform")
  }],

  LEGAL_NOTE: 'This declaration is part of your verified companion agreement with CoBuddy.',
  CTA_PRIMARY: 'Confirm Declaration & Continue',
  SECTION_BADGE: 'Phase 1 of 4  ·  Profile Setup'
} as const;

// ─── CPN-026: Experience Categories ──────────────────────────────────────────

export const ExperienceCategoriesContent = {
  HEADLINE: 'Choose Your Experience Categories',
  SUBHEADLINE: 'Select the types of public social experiences you are comfortable supporting. These will be shown on your companion profile.',
  SECTION_TITLE: 'Available Categories',
  SECTION_BODY: 'Choose at least one category. You can update these after your profile is approved.',
  CATEGORIES: [
  { id: 'cafe', icon: 'local-cafe', label: i18next.t("content.content.applicationKycContent.caf_conversations") },
  { id: 'city_walks', icon: 'directions-walk', label: i18next.t("content.content.applicationKycContent.city_walks") },
  { id: 'art_culture', icon: 'palette', label: i18next.t("content.content.applicationKycContent.art_culture") },
  { id: 'bookstores', icon: 'menu-book', label: i18next.t("content.content.applicationKycContent.bookstores") },
  { id: 'food', icon: 'restaurant', label: i18next.t("content.content.applicationKycContent.food_exploration") },
  { id: 'shopping', icon: 'shopping-bag', label: i18next.t("content.content.applicationKycContent.shopping_assistance") },
  { id: 'events', icon: 'event', label: i18next.t("content.content.applicationKycContent.public_events") },
  { id: 'networking', icon: 'groups', label: i18next.t("content.content.applicationKycContent.networking") },
  { id: 'movies', icon: 'movie', label: i18next.t("content.content.applicationKycContent.movies_at_public_cinemas") },
  { id: 'wellness', icon: 'self-improvement', label: i18next.t("content.content.applicationKycContent.approved_wellness_activities") }],

  MIN_SELECTION: 1,
  MIN_HINT: 'Select at least 1 category to continue.',
  SELECTION_COUNT_LABEL: '{count} selected',
  APPROVED_NOTE: 'All categories take place at approved public venues only.',
  CTA_PRIMARY: 'Save & Continue',
  SECTION_BADGE: 'Phase 1 of 4  ·  Profile Setup'
} as const;

// ─── CPN-027: Interests & Personality ────────────────────────────────────────

export const InterestsPersonalityContent = {
  HEADLINE: 'Interests & Personality',
  SUBHEADLINE: 'Add tags that describe your personality and interests. These help customers find companions who match their activity preferences.',
  SECTION_COMM_TITLE: 'Communication Style',
  SECTION_ACTIVITY_TITLE: 'Activity Interests',
  COMM_TAGS: [
  { id: 'great_listener', label: i18next.t("content.content.applicationKycContent.great_listener") },
  { id: 'good_conversationalist', label: i18next.t("content.content.applicationKycContent.good_conversationalist") },
  { id: 'thoughtful', label: i18next.t("content.content.applicationKycContent.thoughtful") },
  { id: 'encouraging', label: i18next.t("content.content.applicationKycContent.encouraging") },
  { id: 'calm_presence', label: i18next.t("content.content.applicationKycContent.calm_presence") },
  { id: 'observant', label: i18next.t("content.content.applicationKycContent.observant") },
  { id: 'multilingual', label: i18next.t("content.content.applicationKycContent.multilingual") },
  { id: 'patient', label: i18next.t("content.content.applicationKycContent.patient") }],

  ACTIVITY_TAGS: [
  { id: 'art_lover', label: i18next.t("content.content.applicationKycContent.art_lover") },
  { id: 'bookworm', label: i18next.t("content.content.applicationKycContent.bookworm") },
  { id: 'foodie', label: i18next.t("content.content.applicationKycContent.foodie") },
  { id: 'city_explorer', label: i18next.t("content.content.applicationKycContent.city_explorer") },
  { id: 'culture_enthusiast', label: i18next.t("content.content.applicationKycContent.culture_enthusiast") },
  { id: 'nature_walk', label: i18next.t("content.content.applicationKycContent.nature_walk_fan") },
  { id: 'cinema_buff', label: i18next.t("content.content.applicationKycContent.cinema_buff") },
  { id: 'events_networking', label: i18next.t("content.content.applicationKycContent.events_networking") },
  { id: 'wellness_yoga', label: i18next.t("content.content.applicationKycContent.wellness_yoga") },
  { id: 'history_heritage', label: i18next.t("content.content.applicationKycContent.history_heritage") },
  { id: 'photography', label: i18next.t("content.content.applicationKycContent.photography") },
  { id: 'music_concerts', label: i18next.t("content.content.applicationKycContent.music_concerts") }],

  MAX_TAGS: 8,
  MAX_HINT: 'Choose up to 8 tags total.',
  SELECTION_COUNT_LABEL: '{count} / {max} selected',
  SAFETY_NOTE: 'Tags must reflect professional interests only. Romantic, appearance-based, or suggestive tags are not permitted.',
  CTA_PRIMARY: 'Save & Continue',
  SECTION_BADGE: 'Phase 1 of 4  ·  Profile Setup'
} as const;

// ─── CPN-028: Work Preference ─────────────────────────────────────────────────

export const WorkPreferenceContent = {
  HEADLINE: 'Work Preferences',
  SUBHEADLINE: 'Set your session preferences to help CoBuddy match you with the right booking requests.',
  DURATION_TITLE: 'Preferred Session Duration',
  DURATION_OPTIONS: [
  { id: '1h', label: i18next.t("content.content.applicationKycContent.1_hour") },
  { id: '2h', label: i18next.t("content.content.applicationKycContent.2_hours") },
  { id: '3h', label: i18next.t("content.content.applicationKycContent.3_hours") },
  { id: 'flex', label: i18next.t("content.content.applicationKycContent.flexible") }],

  DAYS_TITLE: 'Available Days',
  DAY_OPTIONS: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  TIME_TITLE: 'Preferred Time Range',
  TIME_OPTIONS: [
  { id: 'morning', label: i18next.t("content.content.applicationKycContent.morning"), sub: '8 AM – 12 PM' },
  { id: 'afternoon', label: i18next.t("content.content.applicationKycContent.afternoon"), sub: '12 PM – 5 PM' },
  { id: 'evening', label: i18next.t("content.content.applicationKycContent.evening"), sub: '5 PM – 9 PM' }],

  FREQ_TITLE: 'Weekly Session Frequency',
  FREQ_OPTIONS: [
  { id: '1-2', label: i18next.t("content.content.applicationKycContent.1_2_sessions") },
  { id: '3-5', label: i18next.t("content.content.applicationKycContent.3_5_sessions") },
  { id: 'any', label: i18next.t("content.content.applicationKycContent.as_available") }],

  VENUE_NOTE: 'All sessions take place at approved public venues only. Work preferences help with scheduling — not service type.',
  CTA_PRIMARY: 'Save & Continue',
  SECTION_BADGE: 'Phase 1 of 4  ·  Profile Setup'
} as const;

// ─── CPN-029: City & Service Area ─────────────────────────────────────────────
// Privacy: City and broad area only. No GPS, no home address.

export const CITY_BROAD_AREAS: Record<string, string[]> = {
  Mumbai: [
  'Andheri', 'Bandra', 'Borivali', 'Colaba', 'Dadar',
  'Goregaon', 'Juhu', 'Kandivali', 'Kurla', 'Malad',
  'Mulund', 'Navi Mumbai', 'Powai', 'Thane', 'Worli'],

  Delhi: [
  'Connaught Place', 'Dwarka', 'East Delhi', 'Hauz Khas',
  'Janakpuri', 'Lajpat Nagar', 'Noida Border', 'Rohini',
  'Saket', 'South Delhi', 'Vasant Kunj', 'West Delhi'],

  Bengaluru: [
  'Indiranagar', 'Jayanagar', 'JP Nagar', 'Koramangala',
  'Marathahalli', 'MG Road', 'Rajajinagar', 'Whitefield',
  'Electronic City', 'Hebbal', 'HSR Layout', 'Yelahanka'],

  Hyderabad: [
  'Banjara Hills', 'Gachibowli', 'Hitech City', 'Jubilee Hills',
  'Kukatpally', 'Madhapur', 'Mehdipatnam', 'Secunderabad', 'Uppal'],

  Chennai: [
  'Adyar', 'Anna Nagar', 'Chromepet', 'Guindy',
  'Nungambakkam', 'Porur', 'T Nagar', 'Velachery'],

  Kolkata: [
  'Ballygunge', 'Behala', 'Dum Dum', 'Howrah',
  'Lake Town', 'New Town', 'Park Street', 'Salt Lake'],

  Pune: [
  'Aundh', 'Baner', 'Hadapsar', 'Hinjewadi',
  'Kalyani Nagar', 'Kothrud', 'Magarpatta', 'Viman Nagar'],

  Ahmedabad: [
  'Bodakdev', 'CG Road', 'Maninagar', 'Navrangpura',
  'Prahladnagar', 'Satellite', 'Vastrapur'],

  Jaipur: [
  'C-Scheme', 'Mansarovar', 'Malviya Nagar', 'Vaishali Nagar', 'Tonk Road'],

  Lucknow: [
  'Aliganj', 'Gomti Nagar', 'Hazratganj', 'Indira Nagar'],

  Chandigarh: [
  'Sector 17', 'Sector 22', 'Sector 35', 'Mohali', 'Panchkula'],

  Kochi: [
  'Aluva', 'Edapally', 'Ernakulam', 'Fort Kochi', 'Kakkanad', 'Vyttila'],

  Surat: [
  'Adajan', 'Althan', 'Katargam', 'Piplod', 'Udhna'],

  Indore: [
  'Palasia', 'Rajwada', 'Vijay Nagar', 'Scheme 54'],

  Nagpur: [
  'Civil Lines', 'Dharampeth', 'Ramdaspeth', 'Sitabuldi', 'Trimurti Nagar']

};

export const CityServiceAreaContent = {
  HEADLINE: 'City & Service Area',
  SUBHEADLINE: 'Share which city and broad areas you are available to meet customers. Your exact residential location is never shown to customers.',
  CITY_LABEL: 'Your City',
  CITY_PLACEHOLDER: 'Select your city',
  CITY_OPTIONS: Object.keys(CITY_BROAD_AREAS),
  AREA_LABEL: 'Broad Service Areas',
  AREA_SUBLABEL: 'Select the neighbourhoods or districts where you are comfortable meeting customers.',
  AREA_HINT: 'At least 1 area required. Maximum 8 areas. Broad areas only — not your exact address.',
  BROAD_AREA_MIN: 1,
  BROAD_AREA_MAX: 8,
  AREA_COUNT_LABEL: '{count} / {max} areas selected',
  PRIVACY_NOTE: 'Only your selected city and broad service areas are used for matching. Your exact residential location is never shown to customers.',
  TRAVEL_LABEL: 'Willing to travel within city?',
  TRAVEL_OPTIONS: ['Yes — within the city', 'Only my selected areas'],
  CTA_PRIMARY: 'Save & Continue',
  SECTION_BADGE: 'Phase 1 of 4  ·  Profile Setup'
} as const;

// ─── CPN-030: Communication & Activity Preferences ────────────────────────────
// IMPORTANT: Title is "Communication & Activity Preferences"
// BANNED: "Service Style Preferences" — risk of wrong product framing

export const CommActivityPreferencesContent = {
  HEADLINE: 'Communication & Activity Preferences',
  SUBHEADLINE: 'Help customers understand how you prefer to interact and what kind of activities you enjoy most during sessions.',
  COMM_TITLE: 'Communication Style',
  COMM_OPTIONS: [
  { id: 'chatty', label: i18next.t("content.content.applicationKycContent.chatty_talkative"), icon: 'chat' },
  { id: 'balanced', label: i18next.t("content.content.applicationKycContent.balanced_talk_listen"), icon: 'compare-arrows' },
  { id: 'quiet', label: i18next.t("content.content.applicationKycContent.comfortable_with_quiet"), icon: 'volume-off' }],

  PACE_TITLE: 'Activity Pace',
  PACE_OPTIONS: [
  { id: 'relaxed', label: i18next.t("content.content.applicationKycContent.relaxed_unhurried"), icon: 'wb-sunny' },
  { id: 'moderate', label: i18next.t("content.content.applicationKycContent.moderate_pace"), icon: 'directions-walk' },
  { id: 'active', label: i18next.t("content.content.applicationKycContent.active_on_the_go"), icon: 'directions-run' }],

  GROUP_TITLE: 'Group Sessions',
  GROUP_OPTIONS: [
  { id: 'one_on_one', label: i18next.t("content.content.applicationKycContent.one_on_one_only") },
  { id: 'small_group', label: i18next.t("content.content.applicationKycContent.small_group_3_5_people") },
  { id: 'any', label: i18next.t("content.content.applicationKycContent.either_is_fine") }],

  ACCESSIBILITY_TITLE: 'Accessibility Considerations',
  ACCESSIBILITY_HINT: 'Let us know if you have any mobility or accessibility preferences that should be considered when selecting approved public venues for sessions.',
  ACCESSIBILITY_PLACEHOLDER: 'E.g. prefer step-free venues, need quiet spaces (optional)',
  PRIVACY_NOTE: 'These preferences help with matching only. They do not change CoBuddy\'s safety or venue requirements.',
  CTA_PRIMARY: 'Save & Continue',
  SECTION_BADGE: 'Phase 1 of 4  ·  Profile Setup'
} as const;

// ─── CPN-031: Public Venue Preference ─────────────────────────────────────────

export const PublicVenuePreferenceContent = {
  HEADLINE: 'Public Venue Preferences',
  SUBHEADLINE: 'Select the public venue types where you feel comfortable supporting CoBuddy social experiences. All venues are approved for safety.',
  SECTION_TITLE: 'Preferred Venue Types',
  VENUES: [
  { id: 'cafe', icon: 'local-cafe', label: i18next.t("content.content.applicationKycContent.caf") },
  { id: 'restaurant', icon: 'restaurant', label: i18next.t("content.content.applicationKycContent.restaurant") },
  { id: 'public_park', icon: 'park', label: i18next.t("content.content.applicationKycContent.public_park") },
  { id: 'gallery_museum', icon: 'museum', label: i18next.t("content.content.applicationKycContent.gallery_or_museum") },
  { id: 'bookstore', icon: 'menu-book', label: i18next.t("content.content.applicationKycContent.bookstore") },
  { id: 'shopping_mall', icon: 'shopping-bag', label: i18next.t("content.content.applicationKycContent.shopping_mall") },
  { id: 'cinema', icon: 'movie', label: i18next.t("content.content.applicationKycContent.cinema") },
  { id: 'event_venue', icon: 'event', label: i18next.t("content.content.applicationKycContent.public_event_venue") },
  { id: 'wellness_venue', icon: 'spa', label: i18next.t("content.content.applicationKycContent.approved_wellness_venue") }],

  NEVER_ALLOWED_TITLE: 'Never Permitted',
  NEVER_ALLOWED: [
  { icon: 'home', label: i18next.t("content.content.applicationKycContent.private_home") },
  { icon: 'hotel', label: i18next.t("content.content.applicationKycContent.hotel_room") },
  { icon: 'location-off', label: i18next.t("content.content.applicationKycContent.isolated_location") },
  { icon: 'directions-car', label: i18next.t("content.content.applicationKycContent.vehicle_only_meetup") }],

  MIN_SELECTION: 1,
  MIN_HINT: 'Select at least 1 venue type to continue.',
  APPROVED_NOTE: 'All venues are verified and approved by CoBuddy. Customers can only book sessions at venues on the approved list.',
  CTA_PRIMARY: 'Save & Continue',
  SECTION_BADGE: 'Phase 1 of 4  ·  Profile Setup'
} as const;

// ─── CPN-032: Boundaries & Safety ─────────────────────────────────────────────

export const BoundariesSafetyContent = {
  HEADLINE: 'Boundaries & Safety',
  SUBHEADLINE: 'These platform rules apply to all CoBuddy Companions. They protect both you and your customers during every session.',
  PLATFORM_RULES_TITLE: 'Platform Safety Rules',
  PLATFORM_RULES_SUBTITLE: 'Mandatory for all verified companions. These rules are non-negotiable.',
  PLATFORM_RULES: [
  { icon: 'store', label: i18next.t("content.content.applicationKycContent.all_sessions_at_approved_public_venues_o"), locked: true },
  { icon: 'block', label: i18next.t("content.content.applicationKycContent.no_private_meetings_homes_hotels_or_isol"), locked: true },
  { icon: 'phone-locked', label: i18next.t("content.content.applicationKycContent.no_off_app_contact_with_customers"), locked: true },
  { icon: 'payment', label: i18next.t("content.content.applicationKycContent.no_direct_cash_or_off_platform_payments"), locked: true },
  { icon: 'favorite-border', label: i18next.t("content.content.applicationKycContent.no_romantic_intimate_or_sexual_conduct"), locked: true }],

  COMPANION_RIGHTS_TITLE: 'Your Rights as a Companion',
  COMPANION_RIGHTS_SUBTITLE: 'CoBuddy guarantees these protections for every verified companion.',
  COMPANION_RIGHTS: [
  { icon: 'exit-to-app', label: i18next.t("content.content.applicationKycContent.right_to_end_any_session_that_feels_unsa") },
  { icon: 'warning', label: i18next.t("content.content.applicationKycContent.sos_and_safety_timer_tools_available_dur") },
  { icon: 'report', label: i18next.t("content.content.applicationKycContent.right_to_report_any_customer_behaviour_t") },
  { icon: 'lock', label: i18next.t("content.content.applicationKycContent.your_home_address_and_personal_contact_a") },
  { icon: 'account-balance', label: i18next.t("content.content.applicationKycContent.earnings_are_protected_and_processed_thr") }],

  ACCEPTANCE_LABEL: 'I have read and accept these boundaries and safety rules as a condition of my CoBuddy Companion application.',
  LEGAL_NOTE: 'This acknowledgement is recorded as part of your verified companion agreement.',
  SAFETY_BADGE: 'Phase 1 of 4  ·  Profile Setup',
  CTA_PRIMARY: 'Accept & Continue',
  CTA_DISABLED_TIP: 'Please read and accept the boundaries and safety rules to continue.',
  SECTION_BADGE: 'Phase 1 of 4  ·  Profile Setup'
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 4B — FINANCIAL & VERIFICATION (CPN-033 to CPN-044)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── CPN-033: Companion Pricing (P0 REWRITE — see screenContentFixes.ts) ──────
// Banned: 'Platinum rate', 'Vantage pricing', 'premium tier', 'concierge rate'

export const CompanionPricingContent = {
  SECTION_BADGE: 'Phase 3 of 4  ·  Financial Setup',
  HEADLINE: 'Set Your Session Rate',
  SUBHEADLINE: 'Choose a fair hourly rate for verified public companion sessions. Rates are reviewed by CoBuddy before your profile goes live.',
  RATE_LABEL: 'Hourly Rate (\u20B9 INR)',
  RATE_PLACEHOLDER: '\u20B91,200',
  DURATION_LABEL: 'Default Session Duration',
  DURATION_OPTIONS: [
  { label: i18next.t("content.content.applicationKycContent.60_minutes"), value: 60 },
  { label: i18next.t("content.content.applicationKycContent.90_minutes"), value: 90 },
  { label: i18next.t("content.content.applicationKycContent.120_minutes"), value: 120 }] as
  const,
  DURATION_DEFAULT: 90,
  MIN_RATE_NOTE: 'Minimum session rate: \u20B9800/hour',
  SUGGESTED_RANGE: 'Suggested range: \u20B9800–\u20B92,000 based on similar companions in your city.',
  REVIEW_NOTE: 'Your rate will be reviewed by CoBuddy before it goes live on your profile.',
  FEE_NOTE: 'CoBuddy deducts a small service fee per session. This is shown transparently in your earnings breakdown.',
  EARNINGS_PREVIEW_TITLE: 'Estimated Earnings Preview',
  EARNINGS_SESSION: 'Customer session price',
  EARNINGS_FEE: 'Platform service fee',
  EARNINGS_YOU: 'Your estimated earning',
  PLATFORM_RULE: 'For your safety, all transactions must happen through CoBuddy. Requesting or accepting off-platform payments is a policy violation.',
  PRICING_RULES_TITLE: 'Pricing Rules',
  PRICING_RULES: [
  { icon: 'visibility', text: 'Customers see exactly what they pay upfront.' },
  { icon: 'security', text: 'All transactions are processed through CoBuddy only.' },
  { icon: 'money-off', text: 'Never request or accept cash or direct UPI payments.' },
  { icon: 'gavel', text: 'Unusual rates may require additional verification before going live.' }],

  CTA_PRIMARY: 'Save Pricing & Continue',
  CTA_SAVE_DRAFT: 'Save Draft',
  SECTION_LABEL: 'Financial Setup'
} as const;

// ─── CPN-034: Languages Selection ─────────────────────────────────────────────

export const NATIVE_SCRIPTS: Record<string, string> = {
  Hindi: 'अ',
  English: 'A',
  Hinglish: 'A/अ',
  Marathi: 'म',
  Gujarati: 'અ',
  Punjabi: 'ਅ',
  Bengali: 'অ',
  Tamil: 'அ',
  Telugu: 'అ',
  Kannada: 'ಅ',
  Malayalam: 'അ',
  Urdu: 'ا'
};

export const LanguagesSelectionContent = {
  SECTION_BADGE: 'Phase 1 of 4  ·  Profile Setup',
  HEADLINE: 'Select Your Spoken Languages',
  SUBHEADLINE: 'Choose the languages you\'re comfortable using during customer conversations and verified public experiences.',
  LANGUAGES_TITLE: 'Languages You Speak',
  LANGUAGES_SUBTITLE: 'Select all languages you can confidently use with customers.',
  LANGUAGE_OPTIONS: [
  'Hindi', 'English', 'Hinglish', 'Marathi', 'Gujarati',
  'Punjabi', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Urdu'] as
  const,
  PRIMARY_LANG_TITLE: 'Primary Communication Language',
  PRIMARY_LANG_SUBTITLE: 'This helps CoBuddy understand your preferred customer communication language.',
  COMFORT_TITLE: 'Communication Comfort',
  COMFORT_OPTIONS: [
  'Comfortable with casual conversation',
  'Comfortable in small group settings',
  'Comfortable guiding city/public venue conversations'] as
  const,
  REVIEW_NOTE: 'Your selected languages may appear on your public companion profile after CoBuddy review.',
  DRAFT_NOTE: 'You can update languages before final profile submission.',
  CTA_PRIMARY: 'Save Languages & Continue',
  CTA_SAVE_DRAFT: 'Save Draft'
} as const;

// ─── CPN-035: Profile Photo Upload ────────────────────────────────────────────

export const ProfilePhotoUploadContent = {
  SECTION_BADGE: 'Phase 1 of 4  ·  Profile Setup',
  HEADLINE: 'Upload Your Profile Photo',
  SUBHEADLINE: 'Add a clear, professional photo that helps customers recognise and trust your companion profile.',
  PHOTO_STANDARDS_TITLE: 'Photo Standards',
  PHOTO_STANDARDS: [
  { icon: 'face', text: 'Face clearly visible and centred.' },
  { icon: 'light-mode', text: 'Good lighting — natural or well-lit environment.' },
  { icon: 'work', text: 'Professional presentation appropriate for client interactions.' },
  { icon: 'block', text: 'No filters, sunglasses, or distracting backgrounds.' }],

  REVIEW_NOTE: 'All photos are subject to review by the CoBuddy verification team to maintain platform security and quality standards.',
  CTA_PRIMARY: 'Save Photo & Continue',
  CTA_SKIP: 'Skip for Now',
  CTA_CAMERA: 'Take Photo',
  CTA_GALLERY: 'Choose from Gallery',
  CTA_RETAKE: 'Retake'
} as const;

// ─── CPN-036: Government ID Type Selection ────────────────────────────────────

export const GovernmentIDTypeContent = {
  SECTION_BADGE: 'Phase 2 of 4  ·  Identity & Documents',
  HEADLINE: 'Choose Your Government ID',
  SUBHEADLINE: 'Select the identity document you want to use for companion verification.',
  PROMPT_NOTE: 'Make sure your selected ID is clear, valid, and matches your basic profile details.',
  PRIVACY_NOTE: 'Your ID is used only for verification, trust, safety, and compliance operations.',
  SELECT_TITLE: 'Select ID Document',
  SELECT_SUBTITLE: 'Choose one valid government ID. You\'ll upload it in the next step.',
  ID_OPTIONS: [
  { id: 'aadhaar', icon: 'badge', label: i18next.t("content.content.applicationKycContent.aadhaar_card"), description: i18next.t("content.content.applicationKycContent.use_aadhaar_as_your_primary_identity_doc"), recommended: true },
  { id: 'driving', icon: 'directions-car', label: i18next.t("content.content.applicationKycContent.driving_licence"), description: i18next.t("content.content.applicationKycContent.use_a_valid_indian_driving_licence"), recommended: false },
  { id: 'voter', icon: 'how-to-vote', label: i18next.t("content.content.applicationKycContent.voter_id"), description: i18next.t("content.content.applicationKycContent.use_your_election_commission_voter_ident"), recommended: false },
  { id: 'passport', icon: 'flight', label: i18next.t("content.content.applicationKycContent.passport"), description: i18next.t("content.content.applicationKycContent.use_a_valid_passport_for_identity_verifi"), recommended: false }] as
  const,
  VERIFIED_NOTE: 'Only verified companions can receive booking requests on CoBuddy.',
  CTA_PRIMARY: 'Continue to Upload',
  CTA_SAVE_LATER: 'Save & Continue Later'
} as const;

// ─── CPN-037: Government ID Upload ────────────────────────────────────────────

export const GovernmentIDUploadContent = {
  SECTION_BADGE: 'Phase 2 of 4  ·  Identity & Documents',
  HEADLINE: 'Upload Your Government ID',
  SUBHEADLINE: 'Upload a clear image of your selected ID so CoBuddy can verify your identity safely.',
  FRONT_LABEL: 'Front side',
  FRONT_HINT: 'Make sure the name and number are clearly visible.',
  BACK_LABEL: 'Back side',
  BACK_HINT: 'Upload the complete back side of your document.',
  UPLOAD_GUIDELINES_TITLE: 'Upload Guidelines',
  UPLOAD_GUIDELINES: [
  'Use clear lighting',
  'Avoid blur or glare',
  'Show full document edges',
  'Details must match your basic profile'] as
  const,
  PRIVACY_NOTE: 'Your ID is used only for verification, trust, safety, and compliance operations.',
  WARNING_NOTE: 'Do not upload edited, cropped, or unclear document images.',
  CTA_PRIMARY: 'Submit ID for Review',
  CTA_SAVE_LATER: 'Save & Continue Later'
} as const;

// ─── CPN-038: Selfie Capture ──────────────────────────────────────────────────

export const SelfieCaptureContent = {
  SECTION_BADGE: 'Phase 2 of 4  ·  Identity & Documents',
  HEADLINE: 'Capture Your Selfie',
  SUBHEADLINE: 'Take a clear selfie so CoBuddy can verify that your face matches your submitted identity details.',
  SELFIE_GUIDELINES_TITLE: 'Selfie Guidelines',
  SELFIE_GUIDELINES: [
  { icon: 'wb-sunny', text: 'Use clear lighting. Avoid shadows or backlight.' },
  { icon: 'face', text: 'Face the camera. Keep your full face visible.' },
  { icon: 'visibility', text: 'No sunglasses or mask. Your face must be clearly visible.' },
  { icon: 'crop-free', text: 'Stay within frame. Align your face inside the guide.' }],

  PRIVACY_NOTE: 'Your selfie is used only for verification, trust, safety, and compliance operations.',
  PROFILE_NOTE: 'Your selfie will not be shown publicly on your companion profile.',
  ALIGN_HINT: 'Align your face within the frame',
  ALIGN_SUBHINT: 'Use good lighting and look straight at the camera.',
  CTA_CAPTURE: 'Capture Selfie',
  CTA_RETAKE: 'Retake',
  CTA_SAVE_LATER: 'Save & Continue Later'
} as const;

// ─── CPN-039: Liveness Detection ──────────────────────────────────────────────

export const LivenessDetectionContent = {
  SECTION_BADGE: 'Phase 2 of 4  ·  Identity & Documents',
  HEADLINE: 'Complete Live Face Check',
  SUBHEADLINE: 'Follow the on-screen instruction so CoBuddy can confirm your selfie is live and secure.',
  INSTRUCTIONS_TITLE: 'Live Check Instructions',
  INSTRUCTIONS: [
  { icon: 'face', text: 'Keep your face visible' },
  { icon: 'sync', text: 'Follow one movement' },
  { icon: 'light-mode', text: 'Stay in good lighting' }],

  SECURITY_TITLE: 'Built for secure verification',
  SECURITY_BODY: 'Liveness detection helps prevent fake profiles, edited photos, and unauthorised applications.',
  PROCESSING_NOTE: 'Live check will be processed by our verification team after submission.',
  PRIVACY_NOTE: 'This check is used only for verification, trust, and safety operations.',
  CTA_START: 'Start Live Check',
  CTA_RETAKE: 'Retake Selfie'
} as const;

// ─── CPN-040: Address Verification (P0 REWRITE — see screenContentFixes.ts) ───
// Banned: 'address shared', 'customers will see', 'public address'

export const AddressVerificationContent = {
  SECTION_BADGE: 'Phase 2 of 4  ·  Identity & Documents',
  HEADLINE: 'Verify Your Address',
  SUBHEADLINE: 'Add your current residential address so CoBuddy can complete trust, safety, and compliance checks.',
  PRIVACY_BADGE: 'Your address is never shared with customers',
  PRIVACY_NOTE: 'We use your address only to verify your service area. Customers see only your city and general area — never your exact address.',
  PURPOSE_NOTE: 'This is used for city and area matching during booking. It is reviewed only by CoBuddy\'s verification team.',
  ADDRESS_TITLE: 'Current Residential Address',
  LINE1_LABEL: 'Address Line 1',
  LINE1_PLACEHOLDER: 'House/Flat no., Street, Area',
  LINE2_LABEL: 'Address Line 2 (optional)',
  LINE2_PLACEHOLDER: 'Landmark, Colony',
  CITY_LABEL: 'City',
  CITY_PLACEHOLDER: 'e.g. Mumbai',
  STATE_LABEL: 'State',
  STATE_PLACEHOLDER: 'e.g. Maharashtra',
  PIN_LABEL: 'PIN Code',
  PIN_PLACEHOLDER: '400001',
  TYPE_LABEL: 'Address Type',
  TYPE_OPTIONS: [
  { value: 'current_residence', label: i18next.t("content.content.applicationKycContent.current_residence") },
  { value: 'permanent_residence', label: i18next.t("content.content.applicationKycContent.permanent_residence") }] as
  const,
  ID_MATCH_LABEL: 'Address matches my ID document',
  PROOF_TITLE: 'Address Proof',
  PROOF_SUBTITLE: 'Upload only if your current address is different from your submitted ID.',
  PROOF_HINT: 'Utility bill, rent agreement, or bank statement (last 3 months)',
  PROOF_CTA: 'Upload address proof',
  CTA_PRIMARY: 'Save Address Details',
  CTA_SAVE_LATER: 'Save & Continue Later'
} as const;

// Indian states list for address form
export const INDIA_STATES: string[] = [
'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'];


// ─── CPN-041: PAN & Tax Details ───────────────────────────────────────────────

export const PANTaxDetailsContent = {
  SECTION_BADGE: 'Phase 2 of 4  \u00b7  Identity \u0026 Documents',
  HEADLINE: 'Add PAN \u0026 Tax Details',
  SUBHEADLINE: 'Provide your PAN information so CoBuddy can support earnings, payout records, and compliance requirements.',
  REQUIRED_FOR: 'Required for payouts',
  PAN_LABEL: 'PAN Number',
  PAN_PLACEHOLDER: 'e.g. ABCDE1234F',
  PAN_NAME_LABEL: 'Name as per PAN',
  PAN_NAME_PLACEHOLDER: 'Full name as printed on your PAN card',
  DOB_LABEL: 'Date of Birth',
  DOB_HINT: 'Pre-filled from your basic details. Edit if different from PAN.',
  RESIDENCY_LABEL: 'Tax Residency',
  RESIDENCY_DEFAULT: 'India',
  GST_TOGGLE_LABEL: 'I have GST registration',
  GST_HINT: 'Optional for most companions. Required only if you earn above \u20B920 lakh/year.',
  GST_LABEL: 'GST Number',
  GST_PLACEHOLDER: 'e.g. 22ABCDE1234F1Z5',
  CONFIRMATION_LABEL: 'I confirm that the PAN and tax details provided are accurate and belong to me.',
  PRIVACY_NOTE: 'Tax details are used only for earnings processing and compliance. They are never shown on your public profile.',
  PAN_REVIEW_NOTE: 'PAN details may be reviewed before payouts are enabled.',
  CTA_PRIMARY: 'Save Tax Details',
  CTA_SAVE_LATER: 'Save & Continue Later'
} as const;

// ─── CPN-042: Add Bank Account ─────────────────────────────────────────────────

export const AddBankAccountContent = {
  SECTION_BADGE: 'Phase 3 of 4  ·  Financial Setup',
  HEADLINE: 'Add Verified Bank Account',
  SUBHEADLINE: 'Add your bank account for receiving CoBuddy companion earnings securely.',
  ACCOUNT_TITLE: 'Bank Account Details',
  HOLDER_LABEL: 'Account Holder Name',
  HOLDER_PLACEHOLDER: 'Full name as on bank records',
  ACCOUNT_LABEL: 'Bank Account Number',
  ACCOUNT_PLACEHOLDER: 'Enter account number',
  CONFIRM_LABEL: 'Confirm Account Number',
  CONFIRM_PLACEHOLDER: 'Re-enter account number',
  IFSC_LABEL: 'IFSC Code',
  IFSC_PLACEHOLDER: 'e.g. HDFC0001234',
  BANK_NAME_LABEL: 'Bank Name',
  BANK_NAME_PLACEHOLDER: 'Detected from IFSC',
  TYPE_LABEL: 'Account Type',
  TYPE_OPTIONS: [
  { value: 'savings', label: i18next.t("content.content.applicationKycContent.savings") },
  { value: 'current', label: i18next.t("content.content.applicationKycContent.current") },
  { value: 'salary', label: i18next.t("content.content.applicationKycContent.salary") }] as
  const,
  PRECHECK_TITLE: 'Pre-Verification Checks',
  PRECHECK_NAME: 'Name matched with profile',
  PRECHECK_NAME_HINT: 'Account name aligns with verified identity',
  PRECHECK_IFSC: 'Valid IFSC detected',
  PRECHECK_IFSC_HINT: 'Branch details confirmed',
  SECURITY_NOTE: 'Your bank details are securely encrypted. We will never ask for your OTP or PIN. This account is used strictly for processing your payouts.',
  CONFIRMATION_LABEL: 'I confirm that the bank details provided are correct and belong to me.',
  CTA_PRIMARY: 'Submit for Verification',
  CTA_EDIT: 'Edit Details',
  CTA_CANCEL: 'Cancel',
  PRIVACY_NOTE: 'Bank details are encrypted and used only for payout disbursement.'
} as const;

// ─── CPN-043: Bank Account Verification ───────────────────────────────────────

export const BankAccountVerificationContent = {
  SECTION_BADGE: 'Phase 3 of 4  ·  Financial Setup',
  HEADLINE: 'Bank Verification In Progress',
  SUBHEADLINE: 'CoBuddy is verifying your payout bank account before enabling secure earnings transfers.',
  STEPS: [
  { key: 'submitted', label: i18next.t("content.content.applicationKycContent.bank_details_submitted"), status: 'done' },
  { key: 'checking', label: i18next.t("content.content.applicationKycContent.bank_account_check"), status: 'pending' },
  { key: 'kyc', label: i18next.t("content.content.applicationKycContent.kyc_name_match"), status: 'pending' },
  { key: 'activation', label: i18next.t("content.content.applicationKycContent.payout_activation"), status: 'pending' }] as
  const,
  SLA_NOTE: 'Usually completed within a few minutes to 24 hours.',
  ACCOUNT_PREVIEW: 'Bank Account Preview',
  SECURITY_WARNING: 'Do not share OTP, PIN, card details, or passwords. CoBuddy never asks for them.',
  PENDING_STATUS: 'Verification pending',
  CTA_CONTINUE: 'Continue Setup'
} as const;

// ─── CPN-044: UPI Details (P0 REWRITE — see screenContentFixes.ts) ────────────
// Banned: 'customer pays via UPI', 'backup payment', 'UPI payment from customer'

export const UPIDetailsContent = {
  SECTION_BADGE: 'Phase 3 of 4  ·  Financial Setup',
  HEADLINE: 'UPI for Payout Disbursement',
  SUBHEADLINE: 'Add a UPI ID where CoBuddy can send your verified companion earnings securely after payout approval.',
  OPTIONAL_NOTE: 'UPI is optional if you have already added a verified bank account.',
  DISCLAIMER: 'Your UPI ID is used only for receiving payouts from CoBuddy. Customers do not pay you directly through UPI.',
  FIELD_LABEL: 'UPI ID (for receiving payouts)',
  FIELD_PLACEHOLDER: 'yourname@upi',
  CONFIRM_LABEL: 'Confirm UPI ID',
  NAME_LABEL: 'Account holder name',
  NAME_HINT: 'Name matches your KYC documentation. Required for secure payouts.',
  PAYOUT_LABEL: 'Payout label (optional)',
  PAYOUT_LABEL_PLACEHOLDER: 'e.g. My primary UPI',
  PRIMARY_TOGGLE: 'Set as primary payout method',
  SECURITY_RULES_TITLE: 'Security Rules',
  SECURITY_RULES: [
  { icon: 'gpp-maybe', text: 'UPI ID changes are subject to a 24-hour security cooldown before payouts can resume.' },
  { icon: 'policy', text: 'Only one active UPI ID is permitted per user to prevent fraudulent activities.' }],

  PRIVACY_NOTE: 'UPI details are encrypted and used only for payouts.',
  CTA_PRIMARY: 'Submit for Verification',
  CTA_EDIT: 'Edit Details',
  CTA_CANCEL: 'Cancel'
} as const;

// ─── CPN-036: Verification Hub ───────────────────────────────────────────────

export const VerificationHubContent = {
  HEADLINE: 'Verify Your Identity',
  SUBHEADLINE: 'Complete all verification steps to unlock your companion profile.',
  SECTION_BADGE: 'Identity \u0026 Documents',
  START_HINT: 'Tap a step below to begin or resume. Completed steps are locked.',
  PRIVACY_NOTE: 'Your documents are encrypted and used only for verification. They are never shared with customers.',
  BOTTOM_NOTE: 'Verification typically takes 1–3 business days after all steps are complete.',
  CTA_START: 'Begin Verification',
  CTA_SAVE_LATER: 'Save & Continue Later',
  CTA_PRIMARY: 'Continue',
  CTA_SECONDARY: 'Come Back Later'
} as const;

// ✨ CPN-045: Profile Setup Intro ✨

export const ProfileSetupIntroContent = {
  HEADLINE: 'Build Your Companion Profile',

  SUBHEADLINE: 'Complete the following steps to create your companion profile.',

  SETUP_BADGE: 'Phase 1 of 4 · Profile Setup',

  SECTION_BADGE: 'Phase 1 of 4 · Profile Setup',

  SETUP_JOURNEY_TITLE: 'Your Profile Journey',

  SETUP_JOURNEY_NOTE: 'Complete each step to build a complete and professional companion profile.',
  SETUP_STEPS: [
  {
    label: i18next.t("content.content.applicationKycContent.basic_details"),
    icon: 'person',
    description: i18next.t("content.content.applicationKycContent.add_your_personal_and_profile_informatio")
  },
  {
    label: i18next.t("content.content.applicationKycContent.identity_verification"),
    icon: 'badge',
    description: i18next.t("content.content.applicationKycContent.verify_your_identity_and_required_docume")
  },
  {
    label: i18next.t("content.content.applicationKycContent.financial_setup"),
    icon: 'account-balance',
    description: i18next.t("content.content.applicationKycContent.configure_pricing_and_payout_details")
  },
  {
    label: i18next.t("content.content.applicationKycContent.review_submit"),
    icon: 'workspace-premium',
    description: i18next.t("content.content.applicationKycContent.review_your_application_before_final_sub")
  }],

  REVIEW_NOTE: 'You can save your progress at any time and continue later.',

  STANDARDS_NOTE: 'Providing complete and accurate information helps speed up the review process.',
  CTA_START: 'Start Profile Setup',
  CTA_PRIMARY: 'Continue',
  CTA_LATER: 'Save & Continue Later',
  LATER_NOTE: 'Your progress is saved. You can return and submit at any time.'
} as const;

// ✨ CPN-046: Profile Completion Checklist ✨

export const ProfileCompletionChecklistContent = {
  HEADLINE: 'Application Checklist',
  SUBHEADLINE: 'All items must be complete before you can submit.',
  SECTION_BADGE: 'Phase 4 of 4  ·  Review & Submit',
  CTA_PRIMARY: 'Submit for Review',
  CTA_SECONDARY: 'Continue Editing'
} as const;

// ✨ Application Saved Draft ✨

export const ApplicationSavedDraftContent = {
  HEADLINE: 'Progress Saved',
  SUBHEADLINE: 'Your application has been saved. You can return and continue any time.',
  SECTION_BADGE: 'Phase 4 of 4  ·  Review & Submit',
  SAVE_BADGE: 'Draft Saved',
  PROGRESS_TITLE: 'Completed Steps',
  NEXT_STEP_TITLE: 'Next Step',
  NEXT_STEP_DESC: 'Complete any remaining steps and submit your application for CoBuddy review.',
  SECURITY_NOTE: 'Your application data is encrypted and securely stored until you submit.',
  SENSITIVE_UPLOAD_NOTE: 'Sensitive documents (ID, selfie) are held in a secure encrypted vault and deleted if not submitted within 30 days.',
  CLOSE_NOTE: 'You can safely close this screen. Your progress is saved.',
  CTA_CONTINUE: 'Continue Application',
  CTA_CLOSE: 'Close',
  CTA_PRIMARY: 'Continue Application',
  CTA_SECONDARY: 'Go to Dashboard'
} as const;

// ✨ Application Progress ✨

export const ApplicationProgressContent = {
  HEADLINE: 'Your Application',
  SUBHEADLINE: 'Track your progress across all application phases.',
  STEP_LABEL: 'Phase 4 of 4  ·  Review & Submit',
  SECTION_BADGE: 'Phase 4 of 4  ·  Review & Submit',
  PROGRESS_TITLE: 'Application Progress',
  NEXT_STEP_NOTE: 'Complete all required sections before you can submit your profile for review.',
  COMPLETED_TITLE: 'Completed Sections',
  COMPLETED_STEPS: [
  { label: i18next.t("content.content.applicationKycContent.eligibility_confirmed"), icon: 'check-circle' },
  { label: i18next.t("content.content.applicationKycContent.identity_documents"), icon: 'badge' },
  { label: i18next.t("content.content.applicationKycContent.safety_declaration"), icon: 'shield' },
  { label: i18next.t("content.content.applicationKycContent.experience_preferences"), icon: 'interests' },
  { label: i18next.t("content.content.applicationKycContent.financial_setup"), icon: 'account-balance' },
  { label: i18next.t("content.content.applicationKycContent.profile_photo_bio"), icon: 'face' }],

  CTA_CONTINUE: 'Continue Application',
  CTA_SAVE_EXIT: 'Save & Exit'
} as const;

// ✨ Application Review Info ✨

export const ApplicationReviewInfoContent = {
  HEADLINE: 'What Happens Next',
  SUBHEADLINE: 'Your application will be reviewed by the CoBuddy team within 3–5 business days.',
  STEP_LABEL: 'Phase 4 of 4  ·  Review & Submit',
  SECTION_BADGE: 'Phase 4 of 4  ·  Review & Submit',
  REVIEW_TITLE: 'Review Checklist',
  REVIEW_ITEMS: [
  { label: i18next.t("content.content.applicationKycContent.identity_documents"), icon: 'badge', description: i18next.t("content.content.applicationKycContent.government_id_selfie_match_and_address_h") },
  { label: i18next.t("content.content.applicationKycContent.profile_content"), icon: 'person', description: i18next.t("content.content.applicationKycContent.photo_bio_and_languages_meet_cobuddy_qua") },
  { label: i18next.t("content.content.applicationKycContent.safety_background"), icon: 'shield', description: i18next.t("content.content.applicationKycContent.background_declaration_and_preferences_a") },
  { label: i18next.t("content.content.applicationKycContent.financial_details"), icon: 'account-balance', description: i18next.t("content.content.applicationKycContent.bank_account_and_upi_are_verified_for_pa") },
  { label: i18next.t("content.content.applicationKycContent.pricing_confirmed"), icon: 'payments', description: i18next.t("content.content.applicationKycContent.session_pricing_has_been_set_and_saved") }],

  PRIVACY_NOTE: 'All submitted data is encrypted. Documents are used only for verification and never shared with clients.',
  CTA_BEGIN: 'Submit for Review',
  CTA_REVIEW: 'Review Application'
} as const;

// ✨ Submit Profile For Approval ✨

export const SubmitProfileForApprovalContent = {
  HEADLINE: 'Submit Your Application',
  SUBHEADLINE: 'By submitting, you confirm that all information provided is accurate and complete.',
  STEP_LABEL: 'Phase 4 of 4  ·  Review & Submit',
  SECTION_BADGE: 'Phase 4 of 4  ·  Review & Submit',
  SUMMARY_TITLE: 'Application Summary',
  CHECKLIST_TITLE: 'Pre-submission Checklist',
  CHECKLIST_ITEMS: [
  'Identity verified',
  'Selfie & liveness passed',
  'Address proof uploaded',
  'Bank account verified',
  'Session pricing set'],

  REVIEW_NOTICE: 'Once submitted, you cannot edit your application until the review is complete.',
  CONFIRM_LABEL: 'I confirm all information is accurate and I accept the CoBuddy Companion Terms.',
  SUPPORT_NOTE: 'Questions before submitting? Contact our companion support team.',
  POST_SUBMIT_NOTE: 'You will receive a notification once your application has been reviewed.',
  LEGAL_NOTE: 'Submitting false information may result in permanent account suspension.',
  CTA_SUBMIT: 'Submit Application',
  CTA_BACK_PREVIEW: 'Preview Profile',
  CTA_PRIMARY: 'Submit Application'
} as const;

// ─── Resubmit Verification ────────────────────────────────────────────────

export const ResubmitVerificationContent = {
  HEADLINE: 'Resubmit Your Documents',
  SUBHEADLINE: 'Your previous submission was rejected. Please upload updated documents.',
  ACTION_BADGE: 'Action Required',
  REASON_TITLE: 'Rejection Reason',
  REASON_DEFAULT: 'Documents did not meet quality requirements. Please upload clearer images.',
  REQUIRED_TITLE: 'Required Documents',
  REQUIRED_ITEMS: [
  { icon: 'badge', label: i18next.t("content.content.applicationKycContent.government_id_front"), required: true },
  { icon: 'flip-camera-android', label: i18next.t("content.content.applicationKycContent.government_id_back"), required: true },
  { icon: 'face', label: i18next.t("content.content.applicationKycContent.selfie_photo"), required: false }],

  UPLOAD_FRONT: 'ID Front',
  UPLOAD_FRONT_HINT: 'Upload a clear image of the front of your government-issued ID.',
  UPLOAD_BACK: 'ID Back',
  UPLOAD_BACK_HINT: 'Upload a clear image of the back of your government-issued ID.',
  NAME_LABEL: 'Legal Name (as on ID)',
  SUPPORT_NOTE: 'If you believe this rejection is an error, please contact our support team.',
  CONFIRM_LABEL: 'I confirm these documents are valid and accurately represent my identity.',
  WARNING: 'Submitting fraudulent documents will result in permanent account suspension.',
  CTA_RESUBMIT: 'Submit Updated Documents',
  CTA_SUPPORT: 'Contact Support'
} as const;

export const VerificationApprovedContent = {
  STATUS_BADGE: 'Identity Verified',
  HEADLINE: 'Verification Approved',
  SUBHEADLINE: 'Your identity has been successfully verified.',
  APPROVED_ITEMS: [
  'Government ID verified',
  'Selfie & liveness passed',
  'Address confirmed',
  'PAN / Tax details verified'],

  NEXT_STEP_TITLE: 'What Happens Now',
  NEXT_STEP_DESC: 'Your identity is verified. CoBuddy will now review your complete companion profile before it goes live.',
  REVIEW_NOTE: 'Your profile will be reviewed by CoBuddy before going live.',
  POST_APPROVAL_NOTE: 'Identity verification is complete. Your profile review is now in progress.',
  CTA_CONTINUE_REVIEW: 'Continue to Profile Review',
  CTA_VIEW_SUMMARY: 'View Verification Summary'
} as const;

export const VerificationPendingContent = {
  STATUS_BADGE: 'Under Review',
  HEADLINE: 'Verification In Progress',
  SUBHEADLINE: 'Your documents have been submitted and are being reviewed. This typically takes 1–3 business days.',
  SUBMITTED_TITLE: 'Submitted Steps',
  SUBMITTED_STEPS: [
  'Government ID uploaded',
  'Selfie & liveness recorded',
  'Address proof submitted',
  'PAN / tax details provided'],

  NEXT_STEPS_NOTE: 'You will receive a notification once verification is complete.',
  DO_NOT_RESUBMIT: 'Do not resubmit documents unless specifically requested.',
  CTA_VIEW_DETAILS: 'View Submission Details'
} as const;

export const VerificationProcessingContent = {
  STATUS_BADGE: 'Processing',
  HEADLINE: 'Documents Being Processed',
  SUBHEADLINE: 'Our system is running automated checks on your submission.',
  CHECKING_ITEMS: [
  { label: i18next.t("content.content.applicationKycContent.document_authenticity_check"), icon: 'verified-user', status: 'Checking' },
  { label: i18next.t("content.content.applicationKycContent.liveness_selfie_match"), icon: 'face', status: 'Checking' },
  { label: i18next.t("content.content.applicationKycContent.address_data_extraction"), icon: 'home', status: 'Checking' },
  { label: i18next.t("content.content.applicationKycContent.compliance_screening"), icon: 'security', status: 'Checking' }],

  NEXT_STEPS: [
  { label: i18next.t("content.content.applicationKycContent.automated_checks_complete"), icon: 'check-circle' },
  { label: i18next.t("content.content.applicationKycContent.manual_review_if_needed"), icon: 'manage-accounts' },
  { label: i18next.t("content.content.applicationKycContent.decision_notification_sent"), icon: 'notifications' }],

  SCHEDULE_NOTE: 'Processing time is typically under 5 minutes.',
  DO_NOT_DUPLICATE: 'Do not submit duplicate applications during processing.',
  CTA_VIEW_STATUS: 'View Submission Status',
  CTA_CLOSE: 'Close'
} as const;

export const VerificationRejectedContent = {
  HEADLINE: 'Verification Rejected',
  SUBHEADLINE: 'We were unable to verify your identity. Please review and resubmit.',
  RESULT_TITLE: 'Review Result',
  RESULT_BADGE: 'Rejected',
  RESULT_DESC: 'Documents did not meet verification standards. Common reasons: blurry images, expired ID, mismatched information.',
  UPDATE_TITLE: 'Required Updates',
  REQUIRED_UPDATES: [
  { label: i18next.t("content.content.applicationKycContent.image_quality"), icon: 'photo-camera', action: 'Retake', description: i18next.t("content.content.applicationKycContent.upload_clearer_high_resolution_images_of") },
  { label: i18next.t("content.content.applicationKycContent.document_expiry"), icon: 'event', action: 'Update', description: i18next.t("content.content.applicationKycContent.ensure_all_submitted_documents_are_not_e") },
  { label: i18next.t("content.content.applicationKycContent.name_mismatch"), icon: 'person', action: 'Correct', description: i18next.t("content.content.applicationKycContent.name_must_match_consistently_across_all") },
  { label: i18next.t("content.content.applicationKycContent.selfie_quality"), icon: 'face', action: 'Retake', description: i18next.t("content.content.applicationKycContent.retake_selfie_in_good_lighting_with_face") }],

  RESUBMIT_NOTE: 'Update your documents and resubmit for a new review.',
  SUPPORT_NOTE: 'If you believe this is an error, contact support with your case reference.',
  WARNING: 'Repeated fraudulent submissions will result in permanent suspension.',
  CTA_RESUBMIT: 'Resubmit Documents',
  CTA_SUPPORT: 'Contact Support'
} as const;

// ─── Profile Approved & Published ────────────────────────────────────────────

export const ProfileApprovedPublishedContent = {
  STATUS_BADGE: 'Profile Live',
  HEADLINE: 'Congratulations!',
  SUBHEADLINE: 'Your companion profile is now live on CoBuddy and visible to potential clients.',
  STATUS_TITLE: 'Profile Status',
  STATUS_ITEMS: [
  { label: i18next.t("content.content.applicationKycContent.identity_verified"), icon: 'badge', status: 'Active' },
  { label: i18next.t("content.content.applicationKycContent.profile_published"), icon: 'workspace-premium', status: 'Live' },
  { label: i18next.t("content.content.applicationKycContent.payouts_enabled"), icon: 'account-balance', status: 'Ready' },
  { label: i18next.t("content.content.applicationKycContent.session_bookings_open"), icon: 'event-available', status: 'Open' }],

  NEXT_STEPS_TITLE: 'What You Can Do Now',
  NEXT_STEPS: [
  { label: i18next.t("content.content.applicationKycContent.view_your_public_profile"), icon: 'person', description: i18next.t("content.content.applicationKycContent.see_exactly_how_clients_discover_and_vie") },
  { label: i18next.t("content.content.applicationKycContent.set_availability"), icon: 'event-available', description: i18next.t("content.content.applicationKycContent.update_when_you_are_available_for_compan") },
  { label: i18next.t("content.content.applicationKycContent.review_safety_guidelines"), icon: 'shield', description: i18next.t("content.content.applicationKycContent.re_read_cobuddy_guidelines_before_your_f") },
  { label: i18next.t("content.content.applicationKycContent.track_your_earnings"), icon: 'payments', description: i18next.t("content.content.applicationKycContent.monitor_payout_history_and_upcoming_earn") }],

  SAFETY_TITLE: 'Session Safety Reminders',
  SAFETY_RULES: [
  'Always meet clients in pre-approved public venues.',
  'Never share personal contact details outside the CoBuddy app.',
  'Report any inappropriate requests immediately via the app.',
  'Ensure sessions are logged and confirmed in the app before meeting.'],

  CTA_DASHBOARD: 'Go to Dashboard',
  CTA_PREVIEW: 'Preview My Profile'
} as const;

// ─── Profile Edit Rejected ────────────────────────────────────────────────────

export const ProfileEditRejectedContent = {
  STEP_LABEL: 'Profile Status',
  RESULT_BADGE: 'Edit Rejected',
  HEADLINE: 'Profile Update Rejected',
  SUBHEADLINE: 'Your recent profile edit was not approved. Your original approved profile remains live.',
  REVIEW_TITLE: 'Edit Review Summary',
  REVIEW_SUMMARY: [
  { label: i18next.t("content.content.applicationKycContent.bio_introduction"), icon: 'person', status: 'Update required' },
  { label: i18next.t("content.content.applicationKycContent.profile_photo"), icon: 'face', status: 'Update required' },
  { label: i18next.t("content.content.applicationKycContent.identity_documents_1"), icon: 'badge', status: 'Completed' },
  { label: i18next.t("content.content.applicationKycContent.pricing_payouts"), icon: 'payments', status: 'Completed' }],

  REQUIRED_TITLE: 'Required Updates',
  REQUIRED_SUBTITLE: 'Please correct the following before resubmitting.',
  REQUIRED_UPDATES: [
  { label: i18next.t("content.content.applicationKycContent.bio_content"), icon: 'edit-note', description: i18next.t("content.content.applicationKycContent.update_bio_to_meet_cobuddy_content_guide") },
  { label: i18next.t("content.content.applicationKycContent.profile_photo"), icon: 'photo-camera', description: i18next.t("content.content.applicationKycContent.upload_a_clear_professional_photo_face_m") }],

  CURRENT_STATUS_TITLE: 'Current Approved Profile',
  CURRENT_STATUS_NOTE: 'Your original approved profile is still live while you correct the rejected edit.',
  STATUS_ITEMS: [
  { label: i18next.t("content.content.applicationKycContent.profile_is_live_and_bookable"), icon: 'check-circle' },
  { label: i18next.t("content.content.applicationKycContent.original_content_serving"), icon: 'workspace-premium' },
  { label: i18next.t("content.content.applicationKycContent.earnings_not_affected"), icon: 'account-balance' }],

  SUPPORT_NOTE: 'If you believe this rejection is incorrect, contact our companion support team with the reference number above.',
  WARNING: 'Multiple rejected edits may trigger a profile review that could temporarily suspend bookings.',
  CTA_UPDATE: 'Correct & Resubmit',
  CTA_SUPPORT: 'Contact Support'
} as const;

// ─── Profile Review Pending ───────────────────────────────────────────────────

export const ProfileReviewPendingContent = {
  STEP_LABEL: 'Review',
  STATUS_BADGE: 'Under Review',
  HEADLINE: 'Profile Under Review',
  SUBHEADLINE: 'Your companion profile has been submitted and is being reviewed by the CoBuddy team.',
  STATUS_TITLE: 'Submission Status',
  STATUS_LABEL: 'Current Status',
  STATUS_DESC: 'CoBuddy is reviewing your profile for quality, safety, and accuracy.',
  STATUS_ITEMS: [
  { label: i18next.t("content.content.applicationKycContent.application_submitted"), status: 'Done', detail: 'Received and queued for review' },
  { label: i18next.t("content.content.applicationKycContent.under_manual_review"), status: 'In Progress', detail: 'CoBuddy team reviewing your profile' },
  { label: i18next.t("content.content.applicationKycContent.decision_notification"), status: 'Pending', detail: 'You will be notified within 3-5 business days' }],

  REVIEW_TITLE: 'What CoBuddy Reviews',
  REVIEW_ITEMS: [
  { label: i18next.t("content.content.applicationKycContent.identity_documents"), icon: 'badge', description: i18next.t("content.content.applicationKycContent.government_id_selfie_match_and_address_v") },
  { label: i18next.t("content.content.applicationKycContent.profile_photo_bio"), icon: 'person', description: i18next.t("content.content.applicationKycContent.photo_quality_bio_content_and_guideline") },
  { label: i18next.t("content.content.applicationKycContent.safety_background"), icon: 'shield', description: i18next.t("content.content.applicationKycContent.background_declaration_and_safety_prefer") },
  { label: i18next.t("content.content.applicationKycContent.pricing_payout_setup"), icon: 'account-balance', description: i18next.t("content.content.applicationKycContent.bank_account_upi_and_session_pricing_ver") }],

  TIMELINE_STEPS: [
  'Submitted',
  'In Review',
  'Decision'],

  EDITING_NOTE: 'Profile editing is disabled during review. You can resume editing once a decision is made.',
  NOT_PUBLIC_NOTE: 'Your profile is not visible to clients until CoBuddy approval is complete.',
  CTA_CHECK_STATUS: 'Check Review Status',
  CTA_SUPPORT: 'Contact Support'
} as const;