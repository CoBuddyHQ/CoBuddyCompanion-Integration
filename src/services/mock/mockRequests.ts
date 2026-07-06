/**
 * CoBuddy Companion App — Mock Booking Requests
 * Covers pending, expiring, and expired request states.
 * PRIVACY: Customer names as initials only.
 * CONTENT RULE: Public venues only. Match score, trust signals visible.
 */

import type {BookingRequest} from '../../store/types/store.types';
import {
  MOCK_CUSTOMER_AR,
  MOCK_CUSTOMER_PR,
  MOCK_CUSTOMER_SK,
  MOCK_VENUE_CAFE_MP_NAGAR,
  MOCK_VENUE_PARK_ARERA,
  MOCK_VENUE_GALLERY_NEW_MARKET,
} from './mockSessions';

/**
 * HIGH PRIORITY — Expiring in 18 minutes, high match score
 */
export const MOCK_REQUEST_EXPIRING: BookingRequest = {
  requestId: 'REQ-CB-5501',
  status: 'pending',
  category: 'cafe_conversation',
  customer: MOCK_CUSTOMER_AR,
  venue: MOCK_VENUE_CAFE_MP_NAGAR,
  proposedStart: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  proposedEnd:   new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(),
  durationMinutes: 90,
  language: 'Hindi + English',
  estimatedEarning: 1650,
  matchScore: 92,
  expiresAt: new Date(Date.now() + 18 * 60 * 1000).toISOString(),   // 18 min
  customerNote: 'Looking for a relaxed public café conversation about career and city life.',
  receivedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
};

/**
 * STANDARD — New request with ample response time
 */
export const MOCK_REQUEST_NEW: BookingRequest = {
  requestId: 'REQ-CB-5502',
  status: 'pending',
  category: 'city_walk',
  customer: MOCK_CUSTOMER_SK,
  venue: MOCK_VENUE_PARK_ARERA,
  proposedStart: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // Tomorrow
  proposedEnd:   new Date(Date.now() + 27.5 * 60 * 60 * 1000).toISOString(),
  durationMinutes: 90,
  language: 'English',
  estimatedEarning: 1300,
  matchScore: 78,
  expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),  // 4 hrs
  customerNote: 'Interested in exploring the Arera Hills trail and discussing photography.',
  receivedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
};

/**
 * LOWER MATCH — Art & Culture request
 */
export const MOCK_REQUEST_ART: BookingRequest = {
  requestId: 'REQ-CB-5503',
  status: 'pending',
  category: 'art_culture',
  customer: MOCK_CUSTOMER_PR,
  venue: MOCK_VENUE_GALLERY_NEW_MARKET,
  proposedStart: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after
  proposedEnd:   new Date(Date.now() + 49.5 * 60 * 60 * 1000).toISOString(),
  durationMinutes: 90,
  language: 'English',
  estimatedEarning: 1350,
  matchScore: 65,
  expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),  // 6 hrs
  customerNote: 'Visiting the gallery for the contemporary art section. Prefer calm and thoughtful conversation.',
  receivedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
};

/**
 * EXPIRED — Past the response window
 */
export const MOCK_REQUEST_EXPIRED: BookingRequest = {
  requestId: 'REQ-CB-5499',
  status: 'expired',
  category: 'cafe_conversation',
  customer: MOCK_CUSTOMER_AR,
  venue: MOCK_VENUE_CAFE_MP_NAGAR,
  proposedStart: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  proposedEnd:   new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
  durationMinutes: 90,
  language: 'Hindi + English',
  estimatedEarning: 1650,
  matchScore: 88,
  expiresAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  customerNote: null,
  receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
};

export const MOCK_PENDING_REQUESTS: BookingRequest[] = [
  MOCK_REQUEST_EXPIRING,
  MOCK_REQUEST_NEW,
  MOCK_REQUEST_ART,
];

export const MOCK_REVIEWED_REQUESTS: BookingRequest[] = [MOCK_REQUEST_EXPIRED];
