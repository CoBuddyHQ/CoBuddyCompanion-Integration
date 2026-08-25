/**
 * CoBuddy Companion — Profile API Service
 * Wraps all /companion/profile/* endpoints.
 */

import { apiGet, apiPost, apiPut } from '../client';
import { Endpoints } from '../endpoints';
import { queryClient } from '../../serverState';
import type { CompanionProfile } from '../../../store/types/store.types';

export interface UpdateBasicDto {
  displayName?: string;
  city?: string;
  dateOfBirth?: string;  // ISO date
  gender?: string;
}

export interface UpdateBioDto {
  bio: string;
}

export interface UpdateCategoriesDto {
  categories: string[];
}

export interface UpdateLanguagesDto {
  languages: string[];
  primaryLanguage?: string;
}

export interface UpdateAreasDto {
  serviceAreas: string[];
}

export interface UpdatePricingDto {
  hourlyRate: number;
  sessionDurations?: number[];  // minutes e.g. [60, 90, 120]
}

export interface UpdatePhotosDto {
  photoUrls: string[];
}

export interface SetupBulkDto {
  basic?: UpdateBasicDto;
  bio?: UpdateBioDto;
  categories?: UpdateCategoriesDto;
  languages?: UpdateLanguagesDto;
  serviceAreas?: UpdateAreasDto;
  pricing?: UpdatePricingDto;
}

export const ProfileService = {
  /** GET /companion/profile */
  getProfile: (): Promise<CompanionProfile> =>
    queryClient.fetchQuery(
      ['companion', 'profile'],
      () => apiGet<CompanionProfile>(Endpoints.PROFILE.GET),
      { staleTime: 120_000, cacheTime: 1_800_000, persist: true }
    ),

  /** PUT /companion/profile/basic */
  updateBasic: async (dto: UpdateBasicDto) => {
    const res = await apiPut(Endpoints.PROFILE.UPDATE_BASIC, dto);
    queryClient.invalidateQueries(['companion', 'profile']);
    queryClient.invalidateQueries(['companion', 'kyc_status']);
    return res;
  },

  /** PUT /companion/profile/bio */
  updateBio: async (dto: UpdateBioDto) => {
    const res = await apiPut(Endpoints.PROFILE.UPDATE_BIO, dto);
    queryClient.invalidateQueries(['companion', 'profile']);
    queryClient.invalidateQueries(['companion', 'kyc_status']);
    return res;
  },

  /** PUT /companion/profile/categories */
  updateCategories: async (dto: UpdateCategoriesDto) => {
    const res = await apiPut(Endpoints.PROFILE.UPDATE_CATEGORIES, dto);
    queryClient.invalidateQueries(['companion', 'profile']);
    queryClient.invalidateQueries(['companion', 'kyc_status']);
    return res;
  },

  /** PUT /companion/profile/languages */
  updateLanguages: async (dto: UpdateLanguagesDto) => {
    const res = await apiPut(Endpoints.PROFILE.UPDATE_LANGUAGES, dto);
    queryClient.invalidateQueries(['companion', 'profile']);
    queryClient.invalidateQueries(['companion', 'kyc_status']);
    return res;
  },

  /** PUT /companion/profile/service-areas */
  updateAreas: async (dto: UpdateAreasDto) => {
    const res = await apiPut(Endpoints.PROFILE.UPDATE_AREAS, dto);
    queryClient.invalidateQueries(['companion', 'profile']);
    queryClient.invalidateQueries(['companion', 'kyc_status']);
    return res;
  },

  /** PUT /companion/profile/pricing */
  updatePricing: async (dto: UpdatePricingDto) => {
    const res = await apiPut(Endpoints.PROFILE.UPDATE_PRICING, dto);
    queryClient.invalidateQueries(['companion', 'profile']);
    queryClient.invalidateQueries(['companion', 'kyc_status']);
    return res;
  },

  /** PUT /companion/profile/photos */
  updatePhotos: async (dto: UpdatePhotosDto) => {
    const res = await apiPut(Endpoints.PROFILE.UPDATE_PHOTOS, dto);
    queryClient.invalidateQueries(['companion', 'profile']);
    return res;
  },

  /** PUT /companion/profile/photos/reorder */
  reorderPhotos: async (photoUrls: string[]) => {
    const res = await apiPut(Endpoints.PROFILE.REORDER_PHOTOS, { photoUrls });
    queryClient.invalidateQueries(['companion', 'profile']);
    return res;
  },

  /** PUT /companion/profile/availability — toggle live status */
  toggleAvailability: async (isAvailable: boolean) => {
    const res = await apiPut(Endpoints.PROFILE.UPDATE_AVAILABILITY_TOGGLE, { isAvailable });
    queryClient.invalidateQueries(['companion', 'profile']);
    return res;
  },

  /** PUT /companion/profile/work-preference */
  updateWorkPreference: async (dto: Record<string, unknown>) => {
    const res = await apiPut(Endpoints.PROFILE.UPDATE_WORK_PREF, dto);
    queryClient.invalidateQueries(['companion', 'profile']);
    queryClient.invalidateQueries(['companion', 'kyc_status']);
    return res;
  },

  /** PUT /companion/profile/comm-activity */
  updateCommActivity: async (dto: Record<string, unknown>) => {
    const res = await apiPut(Endpoints.PROFILE.UPDATE_COMM_ACTIVITY, dto);
    queryClient.invalidateQueries(['companion', 'profile']);
    queryClient.invalidateQueries(['companion', 'kyc_status']);
    return res;
  },

  /** PUT /companion/profile/interests */
  updateInterests: async (dto: { interestTags?: string[]; interests?: string[] }) => {
    const res = await apiPut(Endpoints.PROFILE.UPDATE_INTERESTS, dto);
    queryClient.invalidateQueries(['companion', 'profile']);
    queryClient.invalidateQueries(['companion', 'kyc_status']);
    return res;
  },

  /** PUT /companion/profile/boundaries */
  updateBoundaries: async (dto: Record<string, unknown>) => {
    const res = await apiPut(Endpoints.PROFILE.UPDATE_BOUNDARIES, dto);
    queryClient.invalidateQueries(['companion', 'profile']);
    queryClient.invalidateQueries(['companion', 'kyc_status']);
    return res;
  },

  /** POST /companion/profile/setup-bulk — onboarding bulk save */
  setupBulk: async (dto: SetupBulkDto) => {
    const res = await apiPost(Endpoints.PROFILE.SETUP_BULK, dto);
    queryClient.invalidateQueries(['companion', 'profile']);
    queryClient.invalidateQueries(['companion', 'kyc_status']);
    return res;
  },

  /** POST /companion/profile/submit — submit for review */
  submitForReview: async () => {
    const res = await apiPost(Endpoints.PROFILE.SUBMIT_FOR_REVIEW, {});
    queryClient.invalidateQueries(['companion', 'profile']);
    queryClient.invalidateQueries(['companion', 'kyc_status']);
    return res;
  },

  /** GET /companion/profile/preview */
  getPreview: () =>
    apiGet(Endpoints.PROFILE.PREVIEW),

  /** GET /companion/profile/trust */
  getTrust: () =>
    queryClient.fetchQuery(
      ['companion', 'trust'],
      () => apiGet(Endpoints.PROFILE.GET_TRUST),
      { staleTime: 300_000, cacheTime: 1_800_000, persist: true }
    ),
};
