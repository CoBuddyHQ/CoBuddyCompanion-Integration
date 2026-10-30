/**
 * Step Tracking & Phase Progress Registry for CoBuddy Companion
 * Provides exact dynamic phase, step counter, and badge label per screen.
 */

import { Routes } from '../navigation/routes';

export interface StepInfo {
  phaseNumber: number;        // 1 to 4 (or 0 for un-phased screens)
  totalPhases: number;        // 4
  phaseName: string;          // 'Profile Setup' | 'Identity & Documents' | 'Financial Setup' | 'Review & Submit' | 'Overview'
  stepNumber: number;         // 1-based step index within the phase
  totalStepsInPhase: number;  // total steps in this phase
  stepTitle: string;          // human-readable step title
  badgeText: string;          // complete badge text for pill
}

export const STEP_TRACKING_CONFIG: Record<string, StepInfo> = {
  // ── Overview / Eligibility
  [Routes.JOURNEY_INTRO]: {
    phaseNumber: 1,
    totalPhases: 4,
    phaseName: 'Overview',
    stepNumber: 0,
    totalStepsInPhase: 10,
    stepTitle: 'Application Overview',
    badgeText: 'Phase 1 of 4 · Profile Setup',
  },
  [Routes.ELIGIBILITY_CONFIRMATION]: {
    phaseNumber: 1,
    totalPhases: 4,
    phaseName: 'Eligibility',
    stepNumber: 0,
    totalStepsInPhase: 10,
    stepTitle: 'Eligibility Check',
    badgeText: 'Phase 1 of 4 · Eligibility Check',
  },

  // ── Phase 1: Profile Setup (10 steps)
  [Routes.BASIC_DETAILS]: {
    phaseNumber: 1,
    totalPhases: 4,
    phaseName: 'Profile Setup',
    stepNumber: 1,
    totalStepsInPhase: 10,
    stepTitle: 'Basic Details',
    badgeText: 'Phase 1 of 4 · Step 1 of 10 · Basic Details',
  },
  [Routes.BIO_INTRODUCTION]: {
    phaseNumber: 1,
    totalPhases: 4,
    phaseName: 'Profile Setup',
    stepNumber: 2,
    totalStepsInPhase: 10,
    stepTitle: 'Bio Introduction',
    badgeText: 'Phase 1 of 4 · Step 2 of 10 · Bio Introduction',
  },
  [Routes.BACKGROUND_DECLARATION]: {
    phaseNumber: 1,
    totalPhases: 4,
    phaseName: 'Profile Setup',
    stepNumber: 3,
    totalStepsInPhase: 10,
    stepTitle: 'Professional Declaration',
    badgeText: 'Phase 1 of 4 · Step 3 of 10 · Professional Declaration',
  },
  [Routes.EXPERIENCE_CATEGORIES]: {
    phaseNumber: 1,
    totalPhases: 4,
    phaseName: 'Profile Setup',
    stepNumber: 4,
    totalStepsInPhase: 10,
    stepTitle: 'Experience Categories',
    badgeText: 'Phase 1 of 4 · Step 4 of 10 · Experience Categories',
  },
  [Routes.INTERESTS_PERSONALITY]: {
    phaseNumber: 1,
    totalPhases: 4,
    phaseName: 'Profile Setup',
    stepNumber: 5,
    totalStepsInPhase: 10,
    stepTitle: 'Interests & Personality',
    badgeText: 'Phase 1 of 4 · Step 5 of 10 · Interests & Personality',
  },
  [Routes.LANGUAGES_SELECTION]: {
    phaseNumber: 1,
    totalPhases: 4,
    phaseName: 'Profile Setup',
    stepNumber: 6,
    totalStepsInPhase: 10,
    stepTitle: 'Languages',
    badgeText: 'Phase 1 of 4 · Step 6 of 10 · Languages',
  },
  [Routes.WORK_PREFERENCE]: {
    phaseNumber: 1,
    totalPhases: 4,
    phaseName: 'Profile Setup',
    stepNumber: 7,
    totalStepsInPhase: 10,
    stepTitle: 'Work Preferences',
    badgeText: 'Phase 1 of 4 · Step 7 of 10 · Work Preferences',
  },
  [Routes.CITY_SERVICE_AREA]: {
    phaseNumber: 1,
    totalPhases: 4,
    phaseName: 'Profile Setup',
    stepNumber: 8,
    totalStepsInPhase: 10,
    stepTitle: 'City & Service Area',
    badgeText: 'Phase 1 of 4 · Step 8 of 10 · City & Service Area',
  },
  [Routes.SERVICE_STYLE_PREFERENCES]: {
    phaseNumber: 1,
    totalPhases: 4,
    phaseName: 'Profile Setup',
    stepNumber: 9,
    totalStepsInPhase: 10,
    stepTitle: 'Communication & Activity',
    badgeText: 'Phase 1 of 4 · Step 9 of 10 · Communication & Activity',
  },
  [Routes.PUBLIC_VENUE_PREFERENCE]: {
    phaseNumber: 1,
    totalPhases: 4,
    phaseName: 'Profile Setup',
    stepNumber: 10,
    totalStepsInPhase: 10,
    stepTitle: 'Public Venues',
    badgeText: 'Phase 1 of 4 · Step 10 of 10 · Public Venues',
  },
  [Routes.BOUNDARIES_SAFETY]: {
    phaseNumber: 1,
    totalPhases: 4,
    phaseName: 'Profile Setup',
    stepNumber: 10,
    totalStepsInPhase: 10,
    stepTitle: 'Boundaries & Safety',
    badgeText: 'Phase 1 of 4 · Boundaries & Safety',
  },
  [Routes.PROFILE_PHOTO_UPLOAD]: {
    phaseNumber: 1,
    totalPhases: 4,
    phaseName: 'Profile Setup',
    stepNumber: 10,
    totalStepsInPhase: 10,
    stepTitle: 'Profile Photo',
    badgeText: 'Phase 1 of 4 · Profile Photo Upload',
  },

  // ── Phase 2: Identity & Documents (5 steps)
  [Routes.GOVERNMENT_ID_TYPE]: {
    phaseNumber: 2,
    totalPhases: 4,
    phaseName: 'Identity & Documents',
    stepNumber: 1,
    totalStepsInPhase: 5,
    stepTitle: 'Government ID Type',
    badgeText: 'Phase 2 of 4 · Step 1 of 5 · Government ID Type',
  },
  [Routes.GOVERNMENT_ID_UPLOAD]: {
    phaseNumber: 2,
    totalPhases: 4,
    phaseName: 'Identity & Documents',
    stepNumber: 2,
    totalStepsInPhase: 5,
    stepTitle: 'ID Document Upload',
    badgeText: 'Phase 2 of 4 · Step 2 of 5 · ID Document Upload',
  },
  [Routes.SELFIE_CAPTURE]: {
    phaseNumber: 2,
    totalPhases: 4,
    phaseName: 'Identity & Documents',
    stepNumber: 3,
    totalStepsInPhase: 5,
    stepTitle: 'Selfie Capture',
    badgeText: 'Phase 2 of 4 · Step 3 of 5 · Selfie Capture',
  },
  [Routes.LIVENESS_DETECTION]: {
    phaseNumber: 2,
    totalPhases: 4,
    phaseName: 'Identity & Documents',
    stepNumber: 4,
    totalStepsInPhase: 5,
    stepTitle: 'Liveness Check',
    badgeText: 'Phase 2 of 4 · Step 4 of 5 · Liveness Check',
  },
  [Routes.ADDRESS_VERIFICATION]: {
    phaseNumber: 2,
    totalPhases: 4,
    phaseName: 'Identity & Documents',
    stepNumber: 5,
    totalStepsInPhase: 5,
    stepTitle: 'Address Verification',
    badgeText: 'Phase 2 of 4 · Step 5 of 5 · Address Verification',
  },
  [Routes.PAN_TAX_DETAILS]: {
    phaseNumber: 2,
    totalPhases: 4,
    phaseName: 'Identity & Documents',
    stepNumber: 5,
    totalStepsInPhase: 5,
    stepTitle: 'PAN & Tax Details',
    badgeText: 'Phase 2 of 4 · PAN & Tax Details',
  },
  [Routes.VERIFICATION_HUB]: {
    phaseNumber: 2,
    totalPhases: 4,
    phaseName: 'Identity & Documents',
    stepNumber: 0,
    totalStepsInPhase: 5,
    stepTitle: 'Identity & Documents Hub',
    badgeText: 'Phase 2 of 4 · Identity & Documents',
  },

  // ── Phase 3: Financial Setup (4 steps)
  [Routes.COMPANION_PRICING]: {
    phaseNumber: 3,
    totalPhases: 4,
    phaseName: 'Financial Setup',
    stepNumber: 1,
    totalStepsInPhase: 4,
    stepTitle: 'Session Rate & Pricing',
    badgeText: 'Phase 3 of 4 · Step 1 of 4 · Companion Pricing',
  },
  [Routes.ADD_BANK_ACCOUNT]: {
    phaseNumber: 3,
    totalPhases: 4,
    phaseName: 'Financial Setup',
    stepNumber: 2,
    totalStepsInPhase: 4,
    stepTitle: 'Add Bank Account',
    badgeText: 'Phase 3 of 4 · Step 2 of 4 · Add Bank Account',
  },
  [Routes.BANK_ACCOUNT_VERIFICATION]: {
    phaseNumber: 3,
    totalPhases: 4,
    phaseName: 'Financial Setup',
    stepNumber: 3,
    totalStepsInPhase: 4,
    stepTitle: 'Bank Account Verification',
    badgeText: 'Phase 3 of 4 · Step 3 of 4 · Bank Verification',
  },
  [Routes.UPI_DETAILS]: {
    phaseNumber: 3,
    totalPhases: 4,
    phaseName: 'Financial Setup',
    stepNumber: 4,
    totalStepsInPhase: 4,
    stepTitle: 'UPI Payout Details',
    badgeText: 'Phase 3 of 4 · Step 4 of 4 · UPI Payout Details',
  },

  // ── Phase 4: Review & Submit (2 steps)
  [Routes.APPLICATION_REVIEW_INFO]: {
    phaseNumber: 4,
    totalPhases: 4,
    phaseName: 'Review & Submit',
    stepNumber: 1,
    totalStepsInPhase: 2,
    stepTitle: 'Application Review',
    badgeText: 'Phase 4 of 4 · Step 1 of 2 · Application Review',
  },
  [Routes.PROFILE_COMPLETION_CHECKLIST]: {
    phaseNumber: 4,
    totalPhases: 4,
    phaseName: 'Review & Submit',
    stepNumber: 2,
    totalStepsInPhase: 2,
    stepTitle: 'Review Checklist',
    badgeText: 'Phase 4 of 4 · Step 2 of 2 · Application Checklist',
  },
  [Routes.SUBMIT_PROFILE_FOR_APPROVAL]: {
    phaseNumber: 4,
    totalPhases: 4,
    phaseName: 'Review & Submit',
    stepNumber: 2,
    totalStepsInPhase: 2,
    stepTitle: 'Submit Profile',
    badgeText: 'Phase 4 of 4 · Step 2 of 2 · Submit for Approval',
  },

  // ── Other States
  [Routes.PROFILE_SETUP_INTRO]: {
    phaseNumber: 1,
    totalPhases: 4,
    phaseName: 'Profile Setup',
    stepNumber: 0,
    totalStepsInPhase: 10,
    stepTitle: 'Profile Setup Intro',
    badgeText: 'Phase 1 of 4 · Profile Setup',
  },
  [Routes.APPLICATION_SAVED_DRAFT]: {
    phaseNumber: 0,
    totalPhases: 4,
    phaseName: 'Saved Draft',
    stepNumber: 0,
    totalStepsInPhase: 0,
    stepTitle: 'Application Draft',
    badgeText: 'CoBuddy Companion · Saved Application Draft',
  },
};

export function getApplicationStepInfo(route: string): StepInfo {
  return (
    STEP_TRACKING_CONFIG[route] || {
      phaseNumber: 1,
      totalPhases: 4,
      phaseName: 'Profile Setup',
      stepNumber: 1,
      totalStepsInPhase: 10,
      stepTitle: 'Profile Setup',
      badgeText: 'Phase 1 of 4 · Profile Setup',
    }
  );
}

