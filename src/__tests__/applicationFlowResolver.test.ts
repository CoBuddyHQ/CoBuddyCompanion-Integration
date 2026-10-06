import {
  getNextApplicationStep,
  navigateToNextApplicationStep,
  CANONICAL_APPLICATION_STEPS,
} from '../navigation/applicationFlowResolver';
import { Routes } from '../navigation/routes';
import { useApplicationStore } from '../store/slices/applicationStore';

describe('applicationFlowResolver', () => {
  beforeEach(() => {
    useApplicationStore.getState().resetApplication();
  });

  describe('CANONICAL_APPLICATION_STEPS', () => {
    it('has unique routes in defined sequential order', () => {
      const routes = CANONICAL_APPLICATION_STEPS.map((s) => s.route);
      const uniqueRoutes = new Set(routes);
      expect(uniqueRoutes.size).toBe(routes.length);
      expect(routes[0]).toBe(Routes.ELIGIBILITY_CONFIRMATION);
      expect(routes[1]).toBe(Routes.BASIC_DETAILS);
    });
  });

  describe('getNextApplicationStep', () => {
    it('resolves the immediate next step if uncompleted', () => {
      const next = getNextApplicationStep(Routes.ELIGIBILITY_CONFIRMATION);
      expect(next.route).toBe(Routes.BASIC_DETAILS);
    });

    it('skips completed steps and resolves first incomplete step', () => {
      useApplicationStore.setState({
        basicDetails: {
          legalName: 'Avinash',
          displayName: 'Avi',
          email: 'avi@test.com',
          dateOfBirth: '1995-05-15',
          gender: 'male',
        },
        professionalBio: 'This is a professional bio that is long enough to pass validation easily.',
      });

      // From ELIGIBILITY_CONFIRMATION, both BASIC_DETAILS and BIO_INTRODUCTION are complete
      // So it should advance to INTERESTS_PERSONALITY
      const next = getNextApplicationStep(Routes.ELIGIBILITY_CONFIRMATION);
      expect(next.route).toBe(Routes.INTERESTS_PERSONALITY);
    });

    it('skips completed ID upload and advances to selfie', () => {
      useApplicationStore.setState({
        idSubmittedForReview: true,
      });

      const next = getNextApplicationStep(Routes.BOUNDARIES_SAFETY);
      // GOVERNMENT_ID_TYPE and GOVERNMENT_ID_UPLOAD are satisfied by idSubmittedForReview
      expect(next.route).toBe(Routes.SELFIE_CAPTURE);
    });

    it('returns APPLICATION_REVIEW_INFO when all steps are completed', () => {
      useApplicationStore.setState({
        onboardingStatus: {
          completedModules: [
            'eligibility',
            'basic_details',
            'bio',
            'interests',
            'categories',
            'languages',
            'photo',
            'declaration',
            'work_preference',
            'service_area',
            'service_style',
            'public_venue',
            'boundaries',
            'government_id',
            'selfie',
            'address',
            'pricing',
            'pan',
            'bank',
            'upi',
          ],
        } as any,
        profilePhotoComplete: true,
        boundariesAccepted: true,
        idSubmittedForReview: true,
        selfieCaptureComplete: true,
        livenessComplete: true,
        addressDetailsComplete: true,
        sessionRateINR: 500,
        panConfirmed: true,
        bankVerified: true,
      });

      const next = getNextApplicationStep(Routes.BANK_ACCOUNT_VERIFICATION);
      expect(next.route).toBe(Routes.APPLICATION_REVIEW_INFO);
    });
  });

  describe('navigateToNextApplicationStep', () => {
    it('handles Profile Correction context by returning to checklist with mode correction', () => {
      const mockNavigation = {
        navigate: jest.fn(),
        replace: jest.fn(),
      };

      useApplicationStore.setState({
        profileCorrectionContext: {
          isActive: true,
          returnRoute: Routes.PROFILE_COMPLETION_CHECKLIST,
          section: 'bio',
        },
      });

      navigateToNextApplicationStep(mockNavigation, Routes.BIO_INTRODUCTION, {
        correctionSection: 'bio',
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith(
        Routes.PROFILE_COMPLETION_CHECKLIST,
        { mode: 'correction' },
      );
      expect(useApplicationStore.getState().correctedSections.bio).toBe(true);
    });

    it('handles Missing Requirement Fix context by returning to the caller hub', () => {
      const mockNavigation = {
        navigate: jest.fn(),
        replace: jest.fn(),
      };

      useApplicationStore.setState({
        missingRequirementFixContext: {
          isActive: true,
          source: 'application_progress',
          requirementKey: 'basic_details',
          returnRoute: Routes.APPLICATION_PROGRESS,
        },
      });

      navigateToNextApplicationStep(mockNavigation, Routes.BASIC_DETAILS, {
        missingRequirementKey: 'basic_details',
      });

      expect(mockNavigation.replace).toHaveBeenCalledWith(Routes.APPLICATION_PROGRESS);
    });

    it('navigates forward to first incomplete step in normal flow', () => {
      const mockNavigation = {
        navigate: jest.fn(),
        replace: jest.fn(),
      };

      navigateToNextApplicationStep(mockNavigation, Routes.ELIGIBILITY_CONFIRMATION);
      expect(mockNavigation.navigate).toHaveBeenCalledWith(Routes.BASIC_DETAILS);
    });
  });
});
