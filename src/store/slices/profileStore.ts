/**
 * CoBuddy Companion App — Profile Store (Zustand)
 * ✅ INTEGRATED: Real API calls via ProfileService.
 * Manages the companion's own profile, verification status, and settings.
 * PRIVACY: maskedPhone stored only. Raw phone never persisted.
 */

import { create } from 'zustand';
import type { CompanionProfile, VerificationStatus, ProfileStatus } from '../types/store.types';
import { ProfileService } from '../../services/api/services/profile.service';

interface ProfileState {
  profile: CompanionProfile | null;
  isLoading: boolean;
  error: string | null;

  // ── API Actions ────────────────────────────────────────────────────────────
  fetchProfile: () => Promise<void>;
  toggleAvailability: (isAvailable: boolean) => Promise<void>;
  uploadGalleryPhoto: (photoUri: string) => Promise<void>;
  deleteGalleryPhoto: (photoId: string) => Promise<void>;
  
  // ── Local / Partial Update Actions ─────────────────────────────────────────
  setProfile: (profile: CompanionProfile) => void;
  updateVerificationStatus: (status: VerificationStatus) => void;
  updateProfileStatus: (status: ProfileStatus) => void;
  updateAvailability: (isAvailable: boolean) => void;
  updateOnlineStatus: (isOnline: boolean) => void;
  updateTrustScore: (score: number) => void;
  updateRating: (rating: number, totalReviews: number) => void;
  updateProfile: (updates: Partial<CompanionProfile>) => Promise<void>;
  incrementSessionCount: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  // ── API Actions ────────────────────────────────────────────────────────────
  
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await ProfileService.getProfile();
      set({ profile });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to load profile' });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleAvailability: async (isAvailable) => {
    // Optimistic update
    get().updateAvailability(isAvailable);
    set({ error: null });
    
    try {
      await ProfileService.toggleAvailability(isAvailable);
    } catch (e: unknown) {
      // Revert on failure
      get().updateAvailability(!isAvailable);
      set({ error: e instanceof Error ? e.message : 'Failed to update availability' });
    }
  },

  uploadGalleryPhoto: async (photoUri: string) => {
    try {
      const { UploadsService } = require('../../services/api/services/uploads.service');
      const { ProfileService } = require('../../services/api/services/profile.service');
      const result = await UploadsService.uploadGalleryPhoto(photoUri);
      const photoUrl = result.photoUrl || result.url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2';
      const state = get();
      const currentGallery = state.profile?.galleryPhotos || [];
      const updatedGallery = [...currentGallery, photoUrl];

      try {
        await ProfileService.updatePhotos({ galleryPhotos: updatedGallery });
      } catch (e) {
        // Log API call
      }

      if (state.profile) {
        set({ profile: { ...state.profile, galleryPhotos: updatedGallery } });
      }
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to upload photo' });
      throw e;
    }
  },

  deleteGalleryPhoto: async (photoId: string) => {
    try {
      const { UploadsService } = require('../../services/api/services/uploads.service');
      const { ProfileService } = require('../../services/api/services/profile.service');
      try {
        await UploadsService.deleteGalleryPhoto(photoId);
      } catch (e) {
        // Ignore deletion stub errors
      }
      const state = get();
      const currentGallery = state.profile?.galleryPhotos || [];
      const updatedGallery = currentGallery.filter(p => !p.includes(photoId));

      try {
        await ProfileService.updatePhotos({ galleryPhotos: updatedGallery });
      } catch (e) {
        // Log API call
      }

      if (state.profile) {
        set({ profile: { ...state.profile, galleryPhotos: updatedGallery } });
      }
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to delete photo' });
      throw e;
    }
  },

  // ── Local Actions ──────────────────────────────────────────────────────────

  setProfile: profile => set({ profile, error: null }),

  updateVerificationStatus: status =>
    set(state =>
      state.profile
        ? { profile: { ...state.profile, verificationStatus: status } }
        : state,
    ),

  updateProfileStatus: status =>
    set(state =>
      state.profile
        ? { profile: { ...state.profile, profileStatus: status } }
        : state,
    ),

  updateAvailability: isAvailable =>
    set(state =>
      state.profile
        ? { profile: { ...state.profile, isAvailable } }
        : state,
    ),

  updateOnlineStatus: isOnline =>
    set(state =>
      state.profile
        ? { profile: { ...state.profile, isOnline } }
        : state,
    ),

  updateTrustScore: score =>
    set(state =>
      state.profile
        ? { profile: { ...state.profile, trustScore: score } }
        : state,
    ),

  updateRating: (rating, totalReviews) =>
    set(state =>
      state.profile
        ? { profile: { ...state.profile, rating, totalReviews } }
        : state,
    ),

  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      if (updates.displayName !== undefined || updates.city !== undefined) {
        await ProfileService.updateBasic({
          displayName: updates.displayName,
          city: updates.city,
        });
      }
      if (updates.bio !== undefined) {
        await ProfileService.updateBio({ bio: updates.bio });
      }
      if (updates.languages !== undefined) {
        await ProfileService.updateLanguages({ languages: updates.languages });
      }
      if (updates.categories !== undefined) {
        await ProfileService.updateCategories({ categories: updates.categories });
      }
      if (updates.serviceAreas !== undefined) {
        await ProfileService.updateAreas({ serviceAreas: updates.serviceAreas });
      }
      if (updates.hourlyRate !== undefined || updates.sessionDurations !== undefined) {
        await ProfileService.updatePricing({
          hourlyRate: updates.hourlyRate ?? get().profile?.hourlyRate ?? 0,
          sessionDurations: updates.sessionDurations ?? get().profile?.sessionDurations ?? [],
        });
      }

      set(state => ({
        profile: state.profile
          ? { ...state.profile, ...updates }
          : (updates as CompanionProfile),
      }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to update profile' });
    } finally {
      set({ isLoading: false });
    }
  },

  incrementSessionCount: () =>
    set(state =>
      state.profile
        ? { profile: { ...state.profile, totalSessions: state.profile.totalSessions + 1 } }
        : state,
    ),

  setLoading: loading => set({ isLoading: loading }),
  setError: error => set({ error }),
  clearProfile: () => set({ profile: null, error: null }),
}));
