/**
 * CoBuddy Companion — Profile API Service
 * Wraps all /companion/profile/* endpoints.
 */

import { apiGet, apiPost, apiPut } from '../client';
import { Endpoints } from '../endpoints';
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
    apiGet<CompanionProfile>(Endpoints.PROFILE.GET),

  /** PUT /companion/profile/basic */
  updateBasic: (dto: UpdateBasicDto) =>
    apiPut(Endpoints.PROFILE.UPDATE_BASIC, dto),

  /** PUT /companion/profile/bio */
  updateBio: (dto: UpdateBioDto) =>
    apiPut(Endpoints.PROFILE.UPDATE_BIO, dto),

  /** PUT /companion/profile/categories */
  updateCategories: (dto: UpdateCategoriesDto) =>
    apiPut(Endpoints.PROFILE.UPDATE_CATEGORIES, dto),

  /** PUT /companion/profile/languages */
  updateLanguages: (dto: UpdateLanguagesDto) =>
    apiPut(Endpoints.PROFILE.UPDATE_LANGUAGES, dto),

  /** PUT /companion/profile/service-areas */
  updateAreas: (dto: UpdateAreasDto) =>
    apiPut(Endpoints.PROFILE.UPDATE_AREAS, dto),

  /** PUT /companion/profile/pricing */
  updatePricing: (dto: UpdatePricingDto) =>
    apiPut(Endpoints.PROFILE.UPDATE_PRICING, dto),

  /** PUT /companion/profile/photos */
  updatePhotos: (dto: UpdatePhotosDto) =>
    apiPut(Endpoints.PROFILE.UPDATE_PHOTOS, dto),

  /** PUT /companion/profile/photos/reorder */
  reorderPhotos: (photoUrls: string[]) =>
    apiPut(Endpoints.PROFILE.REORDER_PHOTOS, { photoUrls }),

  /** PUT /companion/profile/availability — toggle live status */
  toggleAvailability: (isAvailable: boolean) =>
    apiPut(Endpoints.PROFILE.UPDATE_AVAILABILITY_TOGGLE, { isAvailable }),

  /** PUT /companion/profile/work-preference */
  updateWorkPreference: (dto: Record<string, unknown>) =>
    apiPut(Endpoints.PROFILE.UPDATE_WORK_PREF, dto),

  /** PUT /companion/profile/boundaries */
  updateBoundaries: (dto: Record<string, unknown>) =>
    apiPut(Endpoints.PROFILE.UPDATE_BOUNDARIES, dto),

  /** POST /companion/profile/setup-bulk — onboarding bulk save */
  setupBulk: (dto: SetupBulkDto) =>
    apiPost(Endpoints.PROFILE.SETUP_BULK, dto),

  /** POST /companion/profile/submit — submit for review */
  submitForReview: () =>
    apiPost(Endpoints.PROFILE.SUBMIT_FOR_REVIEW, {}),

  /** GET /companion/profile/preview */
  getPreview: () =>
    apiGet(Endpoints.PROFILE.PREVIEW),

  /** GET /companion/profile/trust */
  getTrust: () =>
    apiGet(Endpoints.PROFILE.GET_TRUST),
};
