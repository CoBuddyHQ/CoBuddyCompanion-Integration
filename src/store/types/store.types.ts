/**
 * CoBuddy Companion App — Shared Store Types
 * Typed interfaces used across multiple store slices.
 * PRIVACY: No raw PII stored in any type — masked values only.
 */

// ─── Companion Profile ────────────────────────────────────────────────────────

export type VerificationStatus =
  | 'not_started'
  | 'in_progress'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'resubmit_required';

export type ProfileStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'published'
  | 'edit_rejected';

export type TrustLevel = 'new' | 'building' | 'trusted' | 'highly_trusted';

export interface CompanionProfile {
  companionId: string;
  displayName: string;           // Public display name — first name only
  tagline?: string;
  maskedPhone: string;           // e.g. "+91 ••••••7890"
  city: string;
  serviceAreas: string[];        // e.g. ["MP Nagar", "Bhopal Old City"]
  categories: string[];          // e.g. ["Café Conversations", "City Walks"]
  languages: string[];           // e.g. ["Hindi", "English"]
  bio: string;
  hourlyRate: number;            // INR
  sessionDurations?: number[];   // e.g. [60, 90, 120]
  profileStatus: ProfileStatus;
  verificationStatus: VerificationStatus;
  trustScore: number;            // 0–100
  trustLevel: TrustLevel;
  rating: number;                // 0–5
  totalReviews: number;
  totalSessions: number;
  isAvailable: boolean;
  isOnline: boolean;
  photoUrl: string | null;       // Approved profile photo URL
  galleryPhotos: string[];       // Up to 9 gallery image refs
  joinedAt: string;              // ISO date string
  interestTags?: string[];
  interests?: string[];
  email?: string;
  gender?: string;
  dateOfBirth?: string;
  boundariesAccepted?: boolean;
  termsAccepted?: boolean;
  workPreference?: any;
  commActivity?: any;
  venuePreferences?: string[];
}

// ─── Session ─────────────────────────────────────────────────────────────────

export type SessionStatus =
  | 'upcoming'
  | 'pre_arrival'
  | 'checked_in'
  | 'active'
  | 'extending'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'disputed';

export type ExperienceCategory =
  | 'cafe_conversation'
  | 'city_walk'
  | 'art_culture'
  | 'food_experience'
  | 'shopping_assistance'
  | 'events'
  | 'business_networking'
  | 'bookstore'
  | 'wellness_walk'
  | 'movies';

export interface CustomerSummary {
  customerId: string;
  displayInitials: string;       // e.g. "A.R." — NEVER full name
  trustScore: number;
  isVerified: boolean;
  totalSessionsWithCompanion: number;
  sessionCountOverall: number;
  safetyConsent: boolean;
  identityVerified: boolean;
}

export interface VenueDetail {
  venueId: string;
  name: string;
  area: string;                  // e.g. "MP Nagar"
  city: string;
  isApproved: boolean;
  venueType: string;             // e.g. "Public Café", "Park", "Gallery"
  meetingPoint: string;          // e.g. "Main entrance seating area"
  landmark: string;
}

export interface Session {
  sessionId: string;
  status: SessionStatus;
  category: ExperienceCategory;
  customer: CustomerSummary;
  venue: VenueDetail;
  scheduledStart: string;        // ISO datetime
  scheduledEnd: string;          // ISO datetime
  durationMinutes: number;
  language: string;
  baseEarning: number;           // INR
  bonusEarning: number;          // INR — safety bonus etc.
  estimatedTotal: number;        // INR
  confirmedEarning: number | null; // Null until session complete + reviewed
  checkInTime: string | null;    // ISO datetime
  checkOutTime: string | null;   // ISO datetime
  sessionPassCode: string | null; // e.g. "AR-642"
  safetyTimerActive: boolean;
  notes: string | null;          // Internal post-session notes
  createdAt: string;
}

// ─── Booking Request ──────────────────────────────────────────────────────────

export type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'expired'
  | 'counter_proposed'
  | 'cancelled';

export interface BookingRequest {
  requestId: string;
  status: RequestStatus;
  category: ExperienceCategory;
  customer: CustomerSummary;
  venue: VenueDetail;
  proposedStart: string;         // ISO datetime
  proposedEnd: string;           // ISO datetime
  durationMinutes: number;
  language: string;
  estimatedEarning: number;      // INR
  matchScore: number;            // 0–100
  expiresAt: string;             // ISO datetime
  customerNote: string | null;   // Customer's session context note
  receivedAt: string;            // ISO datetime
}

// ─── Earnings ─────────────────────────────────────────────────────────────────

export type TransactionType =
  | 'session_earning'
  | 'extension_earning'
  | 'safety_bonus'
  | 'platform_fee'
  | 'refund_deduction'
  | 'cancellation_penalty'
  | 'payout_transfer';

export type TransactionStatus =
  | 'pending_review'
  | 'approved'
  | 'payout_eligible'
  | 'paid'
  | 'deducted'
  | 'on_hold';

export interface Transaction {
  transactionId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;                // Positive = credit, negative = debit (INR)
  sessionId: string | null;
  customerInitials: string | null; // e.g. "A.R."
  description: string;
  createdAt: string;             // ISO datetime
  payoutEligibleAt: string | null;
}

export type PayoutStatus =
  | 'idle'
  | 'requested'
  | 'processing'
  | 'completed'
  | 'failed';

export interface PayoutRecord {
  payoutId: string;
  status: PayoutStatus;
  amount: number;                // INR net transfer
  platformFee: number;
  maskedBank: string;            // e.g. "•••• 4821"
  utrNumber: string | null;      // e.g. "•••• 9021" — masked
  requestedAt: string;
  completedAt: string | null;
  failureReason: string | null;
}

export interface EarningsSummary {
  availableBalance: number;      // INR — ready to payout
  pendingBalance: number;        // INR — under review
  totalEarnedAllTime: number;    // INR
  totalEarnedThisMonth: number;  // INR
  totalSessionsThisMonth: number;
  nextPayoutCycleDate: string;   // e.g. "2026-06-21"
  safetyHoldAmount: number;      // INR — on hold due to incident/review
}

// ─── Safety ───────────────────────────────────────────────────────────────────

export type SafetyTimerStatus = 'idle' | 'active' | 'expired' | 'cancelled';

export interface TrustedContact {
  contactId: string;
  name: string;
  maskedPhone: string;           // e.g. "+91 ••••••1234"
  relationship: string;          // e.g. "Friend", "Family"
  isEmergencyContact: boolean;
}

export interface SafetyTimerState {
  status: SafetyTimerStatus;
  durationMinutes: number;
  startedAt: string | null;      // ISO datetime
  expiresAt: string | null;      // ISO datetime
  sessionId: string | null;      // Linked session if active
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationCategory =
  | 'request'
  | 'session'
  | 'safety'
  | 'payout'
  | 'support'
  | 'policy'
  | 'training'
  | 'system';

export type NotificationPriority = 'critical' | 'high' | 'normal' | 'low';

export interface AppNotification {
  notificationId: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  body: string;
  isRead: boolean;
  actionRoute: string | null;    // Route to navigate to on tap
  actionParams: Record<string, string> | null;
  createdAt: string;             // ISO datetime
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface CompanionReview {
  reviewId: string;
  sessionId: string;
  customerInitials: string;      // e.g. "A.R."
  rating: number;                // 1–5
  isPublic: boolean;
  highlights: string[];          // e.g. ["Respectful", "Punctual"]
  comment: string | null;
  sessionCategory: ExperienceCategory;
  sessionDate: string;           // ISO date
  createdAt: string;
}

// ─── Support ──────────────────────────────────────────────────────────────────

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketCategory =
  | 'earnings_payout'
  | 'session_issue'
  | 'verification'
  | 'safety_incident'
  | 'account_access'
  | 'dispute'
  | 'general';

export interface SupportTicket {
  ticketId: string;
  category: TicketCategory;
  status: TicketStatus;
  subject: string;
  description: string;
  sessionId: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface OnboardingStatus {
  profile: CompanionProfile;
  completedModules: string[];
  pendingModules: string[];
  completedSteps: string[];
  currentStep: string;
  nextStep: string;
  profileCompletion: number;
  resumeScreen: string;
  resumeRoute: string;
  draftStatus: string;
  verificationStatus: string;
  applicationStatus: string;
  lastUpdated: string;
  hasStarted: boolean;          // true when completedModules.length > 0
}
