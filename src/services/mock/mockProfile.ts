/**
 * CoBuddy Companion App — Mock Profile Data
 * Realistic mock data for the companion's own profile.
 * PRIVACY: maskedPhone used. Real phone never stored in mock.
 * CONTENT RULE: Non-dating, public-only, verified social experience framing.
 */

import type {CompanionProfile} from '../../store/types/store.types';

export const MOCK_COMPANION_PROFILE: CompanionProfile = {
  companionId: 'COMP-CB-7821',
  displayName: 'Arjun M.',           // Demo placeholder — first name + initial only
  maskedPhone: '+91 ••••••7890',     // Masked per audit rule
  city: 'Bhopal',
  serviceAreas: ['MP Nagar', 'New Market', 'Bhopal Old City', 'Arera Colony'],
  categories: [
    'Café Conversations',
    'City Walks',
    'Art & Culture',
    'Food Experiences',
    'Business Networking',
  ],
  languages: ['Hindi', 'English'],
  bio:
    'I enjoy exploring cities and sharing calm, thoughtful conversations about travel, culture, and everyday experiences. I specialize in accompanying people to cafés and local art spaces, and I take pride in being a reliable, respectful presence during every session.',
  hourlyRate: 1200,                  // INR
  profileStatus: 'published',
  verificationStatus: 'approved',
  trustScore: 92,
  trustLevel: 'highly_trusted',
  rating: 4.8,
  totalReviews: 34,
  totalSessions: 41,
  isAvailable: true,
  isOnline: true,
  photoUrl: null,                    // Null until real photo uploaded
  galleryPhotos: [],                 // Populated after onboarding
  joinedAt: '2026-01-15T10:00:00Z',
};

/**
 * A companion profile in the "applying" state —
 * used for onboarding/KYC placeholder screens.
 */
export const MOCK_COMPANION_APPLYING: Partial<CompanionProfile> = {
  companionId: 'COMP-CB-DRAFT',
  displayName: 'Arjun M.',           // Demo placeholder
  maskedPhone: '+91 ••••••7890',
  city: 'Bhopal',
  profileStatus: 'draft',
  verificationStatus: 'in_progress',
  trustScore: 0,
  trustLevel: 'new',
  rating: 0,
  totalReviews: 0,
  totalSessions: 0,
  isAvailable: false,
  isOnline: false,
  photoUrl: null,
  joinedAt: '2026-06-01T00:00:00Z',
};
