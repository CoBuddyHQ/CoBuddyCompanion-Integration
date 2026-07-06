/**
 * CoBuddy Companion App — Mock Sessions Data
 * Covers upcoming, active, and completed session states.
 * PRIVACY: Customer names as initials only. No raw customer PII.
 * CONTENT RULE: Public venues only. No home/hotel references.
 */

import type {Session, CustomerSummary, VenueDetail} from '../../store/types/store.types';

// ─── Reusable Customer Summaries ──────────────────────────────────────────────

export const MOCK_CUSTOMER_AR: CustomerSummary = {
  customerId: 'CUST-CB-1001',
  displayInitials: 'A.R.',           // NEVER full name per audit rule
  trustScore: 86,
  isVerified: true,
  totalSessionsWithCompanion: 3,
  sessionCountOverall: 8,
  safetyConsent: true,
  identityVerified: true,
};

export const MOCK_CUSTOMER_PR: CustomerSummary = {
  customerId: 'CUST-CB-1002',
  displayInitials: 'P.R.',
  trustScore: 74,
  isVerified: true,
  totalSessionsWithCompanion: 0,
  sessionCountOverall: 2,
  safetyConsent: true,
  identityVerified: true,
};

export const MOCK_CUSTOMER_SK: CustomerSummary = {
  customerId: 'CUST-CB-1003',
  displayInitials: 'S.K.',
  trustScore: 91,
  isVerified: true,
  totalSessionsWithCompanion: 1,
  sessionCountOverall: 12,
  safetyConsent: true,
  identityVerified: true,
};

// ─── Reusable Venue Details ───────────────────────────────────────────────────

export const MOCK_VENUE_CAFE_MP_NAGAR: VenueDetail = {
  venueId: 'VEN-CB-201',
  name: 'The Artisan Roastery',
  area: 'MP Nagar',
  city: 'Bhopal',
  isApproved: true,
  venueType: 'Public Café',
  meetingPoint: 'Main entrance seating area — right of the host stand',
  landmark: 'Opposite the central fountain',
};

export const MOCK_VENUE_PARK_ARERA: VenueDetail = {
  venueId: 'VEN-CB-202',
  name: 'Arera Hills Walking Trail',
  area: 'Arera Colony',
  city: 'Bhopal',
  isApproved: true,
  venueType: 'Public Park / Walking Trail',
  meetingPoint: 'Main park entrance gate',
  landmark: 'Near the orange banner kiosk',
};

export const MOCK_VENUE_GALLERY_NEW_MARKET: VenueDetail = {
  venueId: 'VEN-CB-203',
  name: 'City Art & Culture Gallery',
  area: 'New Market',
  city: 'Bhopal',
  isApproved: true,
  venueType: 'Public Gallery',
  meetingPoint: 'Gallery reception desk — ground floor',
  landmark: 'Next to the sculpture courtyard',
};

// ─── Session Mock Data ────────────────────────────────────────────────────────

/**
 * UPCOMING — Confirmed, not yet started
 */
export const MOCK_SESSION_UPCOMING: Session = {
  sessionId: 'CB-SE-2048',
  status: 'upcoming',
  category: 'cafe_conversation',
  customer: MOCK_CUSTOMER_AR,
  venue: MOCK_VENUE_CAFE_MP_NAGAR,
  scheduledStart: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // +2 hrs
  scheduledEnd:   new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(), // +3.5 hrs
  durationMinutes: 90,
  language: 'Hindi + English',
  baseEarning: 1500,
  bonusEarning: 150,
  estimatedTotal: 1650,
  confirmedEarning: null,
  checkInTime: null,
  checkOutTime: null,
  sessionPassCode: null,
  safetyTimerActive: false,
  notes: null,
  createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
};

/**
 * ACTIVE — Live session in progress
 */
export const MOCK_SESSION_ACTIVE: Session = {
  sessionId: 'CB-SE-2047',
  status: 'active',
  category: 'city_walk',
  customer: MOCK_CUSTOMER_SK,
  venue: MOCK_VENUE_PARK_ARERA,
  scheduledStart: new Date(Date.now() - 45 * 60 * 1000).toISOString(),    // 45 min ago
  scheduledEnd:   new Date(Date.now() + 45 * 60 * 1000).toISOString(),    // 45 min from now
  durationMinutes: 90,
  language: 'English',
  baseEarning: 1200,
  bonusEarning: 100,
  estimatedTotal: 1300,
  confirmedEarning: null,
  checkInTime: new Date(Date.now() - 47 * 60 * 1000).toISOString(),
  checkOutTime: null,
  sessionPassCode: 'SK-419',
  safetyTimerActive: true,
  notes: null,
  createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
};

/**
 * COMPLETED — Past session with confirmed earning
 */
export const MOCK_SESSION_COMPLETED: Session = {
  sessionId: 'CB-SE-2046',
  status: 'completed',
  category: 'art_culture',
  customer: MOCK_CUSTOMER_PR,
  venue: MOCK_VENUE_GALLERY_NEW_MARKET,
  scheduledStart: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  scheduledEnd:   new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
  durationMinutes: 90,
  language: 'English',
  baseEarning: 1200,
  bonusEarning: 150,
  estimatedTotal: 1350,
  confirmedEarning: 1350,
  checkInTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 5 * 60 * 1000).toISOString(),
  checkOutTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 92 * 60 * 1000).toISOString(),
  sessionPassCode: 'PR-731',
  safetyTimerActive: false,
  notes: 'The session was completed at the approved gallery. Customer was respectful and engaged throughout. We discussed contemporary art and local cultural history. No issues to report.',
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
};

/**
 * Aggregated upcoming sessions list
 */
export const MOCK_UPCOMING_SESSIONS: Session[] = [MOCK_SESSION_UPCOMING];

/**
 * Aggregated session history
 */
export const MOCK_SESSION_HISTORY: Session[] = [MOCK_SESSION_COMPLETED];
