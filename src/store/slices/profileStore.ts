/**
 * CoBuddy Companion App — Profile Store (Zustand)
 * Manages the companion's own profile, verification status, and settings.
 * PRIVACY: maskedPhone stored only. Raw phone never persisted.
 */

import {create} from 'zustand';
import type {
  CompanionProfile,
  VerificationStatus,
  ProfileStatus,
} from '../types/store.types';

// ─── Dev Seed Data ────────────────────────────────────────────────────────────
// Provides realistic initial state during development so all profile screens
// display real-looking data without a backend call.
// In production, setProfile() is called after a successful auth/fetch response.

const DEV_PROFILE: CompanionProfile = {
  companionId:         'CPN-DEV-001',
  displayName:         'Arjun S.',
  maskedPhone:         '+91 ••••••7890',
  city:                'Bhopal',
  serviceAreas:        ['MP Nagar', 'Arera Colony', 'New Market'],
  categories:          ['coffee', 'dining', 'music'],
  languages:           ['Hindi', 'English'],
  bio:                 "Hi! I love showing people around the city's hidden gems, trying new cafés, and having real conversations about life, tech, and culture. Let's explore together!",
  hourlyRate:          500,
  profileStatus:       'published',
  verificationStatus:  'approved',
  trustScore:          88,
  trustLevel:          'trusted',
  rating:              4.8,
  totalReviews:        24,
  totalSessions:       47,
  isAvailable:         true,
  isOnline:            true,
  photoUrl:            null,
  galleryPhotos:       [],
  joinedAt:            '2025-09-01T00:00:00Z',
};

// ─── Store Interface ──────────────────────────────────────────────────────────

interface ProfileState {
  profile: CompanionProfile | null;
  isLoading: boolean;
  error: string | null;

  // Granular update actions
  setProfile: (profile: CompanionProfile) => void;
  updateVerificationStatus: (status: VerificationStatus) => void;
  updateProfileStatus: (status: ProfileStatus) => void;
  updateAvailability: (isAvailable: boolean) => void;
  updateOnlineStatus: (isOnline: boolean) => void;
  updateTrustScore: (score: number) => void;
  updateRating: (rating: number, totalReviews: number) => void;
  updateProfile: (updates: Partial<CompanionProfile>) => void;
  incrementSessionCount: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProfile: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useProfileStore = create<ProfileState>(set => ({
  // Seed with DEV_PROFILE so all screens show real data during development.
  // Replace with `profile: null` once auth flow calls setProfile() on login.
  profile:   __DEV__ ? DEV_PROFILE : null,
  isLoading: false,
  error:     null,

  setProfile: profile => set({profile, error: null}),

  updateVerificationStatus: status =>
    set(state =>
      state.profile
        ? {profile: {...state.profile, verificationStatus: status}}
        : state,
    ),

  updateProfileStatus: status =>
    set(state =>
      state.profile
        ? {profile: {...state.profile, profileStatus: status}}
        : state,
    ),

  updateAvailability: isAvailable =>
    set(state =>
      state.profile
        ? {profile: {...state.profile, isAvailable}}
        : state,
    ),

  updateOnlineStatus: isOnline =>
    set(state =>
      state.profile
        ? {profile: {...state.profile, isOnline}}
        : state,
    ),

  updateTrustScore: score =>
    set(state =>
      state.profile
        ? {profile: {...state.profile, trustScore: score}}
        : state,
    ),

  updateRating: (rating, totalReviews) =>
    set(state =>
      state.profile
        ? {profile: {...state.profile, rating, totalReviews}}
        : state,
    ),

  // updateProfile: safe merge — works whether profile is loaded or null.
  // If profile is null (non-dev / pre-login), the update is applied as-is.
  updateProfile: updates =>
    set(state => ({
      profile: state.profile
        ? {...state.profile, ...updates}
        : (updates as CompanionProfile),
    })),

  incrementSessionCount: () =>
    set(state =>
      state.profile
        ? {profile: {...state.profile, totalSessions: state.profile.totalSessions + 1}}
        : state,
    ),

  setLoading: loading => set({isLoading: loading}),
  setError:   error   => set({error}),
  clearProfile: ()    => set({profile: null, error: null}),
}));
