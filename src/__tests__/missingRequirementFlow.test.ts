/**
 * __tests__/missingRequirementFlow.test.ts
 *
 * Unit tests for the missing-requirement fix flow:
 *   - Zustand store state transitions (logic only, no actual store)
 *   - applicationReadinessSelector completeness for every requirement key
 *   - Route mapping verification
 *   - selfie_liveness dual-flag logic
 *   - background_declaration all-false logic
 *
 * Run: npm test
 */

import {getApplicationReadiness} from '../store/selectors/applicationReadinessSelector';
import type {ReadinessSelectorInput} from '../store/selectors/applicationReadinessSelector';
import {Routes} from '../navigation/routes';
import type {MandatoryRequirementKey} from '../navigation/missingRequirementNavigation';

// ─── Base complete state ──────────────────────────────────────────────────────

const COMPLETE_STATE: ReadinessSelectorInput = {
  basicDetails: {
    legalName: 'Test User',
    displayName: 'Tester',
    dateOfBirth: '1990-01-01',
    gender: 'male',
  },
  professionalBio: 'A'.repeat(50),
  interestTags: ['hiking'],
  experienceCategories: ['social'],
  spokenLanguages: ['English'],
  profilePhotoComplete: true,
  backgroundDeclaration: {criminalRecord: false, drugAbuse: false, sexualMisconduct: false},
  workPreference: {durations: ['1hr'], days: ['Mon'], timeRanges: ['morning']},
  city: 'Mumbai',
  broadAreas: ['Bandra'],
  commActivityPrefs: {commStyle: 'casual', activityPace: 'medium', groupPreference: 'one-on-one'},
  venuePreferences: ['cafe'],
  boundariesAccepted: true,
  selectedIdType: 'passport',
  idSubmittedForReview: true,
  selfieCaptureComplete: true,
  livenessComplete: true,
  addressDetailsComplete: true,
  addressProofSubmitted: false,
  sessionRateINR: 1500,
  panConfirmed: true,
  bankVerified: true,
  upiVerified: false,
};

function withOverride(overrides: Partial<ReadinessSelectorInput>): ReadinessSelectorInput {
  return {...COMPLETE_STATE, ...overrides};
}

// ─── 1. Complete state ────────────────────────────────────────────────────────

describe('getApplicationReadiness — complete state', () => {
  it('returns ready=true when all mandatory fields complete', () => {
    const result = getApplicationReadiness(COMPLETE_STATE);
    expect(result.ready).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it('optional items (address_proof, upi) do not block readiness', () => {
    const state = withOverride({addressProofSubmitted: false, upiVerified: false});
    const result = getApplicationReadiness(state);
    expect(result.ready).toBe(true);
    expect(result.missing.map(m => m.key)).not.toContain('address_proof');
    expect(result.missing.map(m => m.key)).not.toContain('upi');
  });

  it('percentage is 100 when complete', () => {
    const result = getApplicationReadiness(COMPLETE_STATE);
    expect(result.percentage).toBe(100);
  });
});

// ─── 2. Each key marks as missing when its condition fails ────────────────────

const MISSING_CASES: Array<{key: MandatoryRequirementKey; override: Partial<ReadinessSelectorInput>}> = [
  {key: 'basic_details',           override: {basicDetails: {legalName: '', displayName: '', dateOfBirth: '', gender: ''}}},
  {key: 'bio',                     override: {professionalBio: 'short'}},
  {key: 'interests',               override: {interestTags: []}},
  {key: 'experience',              override: {experienceCategories: []}},
  {key: 'languages',               override: {spokenLanguages: []}},
  {key: 'profile_photo',           override: {profilePhotoComplete: false}},
  {key: 'background_declaration',  override: {backgroundDeclaration: {criminalRecord: true, drugAbuse: false, sexualMisconduct: false}}},
  {key: 'work_preference',         override: {workPreference: {durations: [], days: [], timeRanges: []}}},
  {key: 'city',                    override: {city: ''}},
  {key: 'comm_activity',           override: {commActivityPrefs: {commStyle: '', activityPace: '', groupPreference: ''}}},
  {key: 'venue_preference',        override: {venuePreferences: []}},
  {key: 'boundaries',              override: {boundariesAccepted: false}},
  {key: 'id_type',                 override: {selectedIdType: ''}},
  {key: 'id_submitted',            override: {idSubmittedForReview: false}},
  {key: 'selfie_liveness',         override: {selfieCaptureComplete: false, livenessComplete: false}},
  {key: 'address_details',         override: {addressDetailsComplete: false}},
  {key: 'pricing',                 override: {sessionRateINR: 0}},
  {key: 'pan',                     override: {panConfirmed: false}},
  {key: 'bank',                    override: {bankVerified: false}},
];

describe('getApplicationReadiness — each key marks missing', () => {
  for (const {key, override} of MISSING_CASES) {
    it(`'${key}' appears in missing[] when incomplete`, () => {
      const result = getApplicationReadiness(withOverride(override));
      expect(result.missing.map(m => m.key)).toContain(key);
    });
  }
});

// ─── 3. selfie_liveness dual-flag logic ──────────────────────────────────────

describe('selfie_liveness requires both flags', () => {
  it('missing when only selfie done', () => {
    const result = getApplicationReadiness(withOverride({selfieCaptureComplete: true, livenessComplete: false}));
    expect(result.missing.map(m => m.key)).toContain('selfie_liveness');
  });

  it('missing when only liveness done', () => {
    const result = getApplicationReadiness(withOverride({selfieCaptureComplete: false, livenessComplete: true}));
    expect(result.missing.map(m => m.key)).toContain('selfie_liveness');
  });

  it('not missing when both done', () => {
    const result = getApplicationReadiness(withOverride({selfieCaptureComplete: true, livenessComplete: true}));
    expect(result.missing.map(m => m.key)).not.toContain('selfie_liveness');
  });
});

// ─── 4. background_declaration requires ALL values false ─────────────────────

describe('background_declaration completeness', () => {
  it('missing when any field is true', () => {
    const cases = [
      {criminalRecord: true,  drugAbuse: false, sexualMisconduct: false},
      {criminalRecord: false, drugAbuse: true,  sexualMisconduct: false},
      {criminalRecord: false, drugAbuse: false, sexualMisconduct: true},
    ];
    for (const backgroundDeclaration of cases) {
      const result = getApplicationReadiness(withOverride({backgroundDeclaration}));
      expect(result.missing.map(m => m.key)).toContain('background_declaration');
    }
  });

  it('not missing when all fields are false', () => {
    const result = getApplicationReadiness(withOverride({
      backgroundDeclaration: {criminalRecord: false, drugAbuse: false, sexualMisconduct: false},
    }));
    expect(result.missing.map(m => m.key)).not.toContain('background_declaration');
  });
});

// ─── 5. Route mapping for every key ──────────────────────────────────────────

describe('MandatoryItemResult.route matches expected route constant', () => {
  const EXPECTED_ROUTES: Partial<Record<MandatoryRequirementKey, string>> = {
    basic_details:          Routes.BASIC_DETAILS,
    bio:                    Routes.BIO_INTRODUCTION,
    interests:              Routes.INTERESTS_PERSONALITY,
    experience:             Routes.EXPERIENCE_CATEGORIES,
    languages:              Routes.LANGUAGES_SELECTION,
    profile_photo:          Routes.PROFILE_PHOTO_UPLOAD,
    background_declaration: Routes.BACKGROUND_DECLARATION,
    work_preference:        Routes.WORK_PREFERENCE,
    city:                   Routes.CITY_SERVICE_AREA,
    comm_activity:          Routes.SERVICE_STYLE_PREFERENCES,
    venue_preference:       Routes.PUBLIC_VENUE_PREFERENCE,
    boundaries:             Routes.BOUNDARIES_SAFETY,
    id_type:                Routes.GOVERNMENT_ID_TYPE,
    id_submitted:           Routes.GOVERNMENT_ID_UPLOAD,
    selfie_liveness:        Routes.SELFIE_CAPTURE,
    address_details:        Routes.ADDRESS_VERIFICATION,
    address_proof:          Routes.ADDRESS_VERIFICATION,
    pricing:                Routes.COMPANION_PRICING,
    pan:                    Routes.PAN_TAX_DETAILS,
    bank:                   Routes.BANK_ACCOUNT_VERIFICATION,
    upi:                    Routes.UPI_DETAILS,
  };

  it('all item routes match expected route constants', () => {
    // Make everything missing so all items appear in results
    const allMissing = withOverride({
      basicDetails: {legalName: '', displayName: '', dateOfBirth: '', gender: ''},
      professionalBio: '',
      interestTags: [],
      experienceCategories: [],
      spokenLanguages: [],
      profilePhotoComplete: false,
      backgroundDeclaration: {criminalRecord: true, drugAbuse: false, sexualMisconduct: false},
      workPreference: {durations: [], days: [], timeRanges: []},
      city: '',
      broadAreas: [],
      commActivityPrefs: {commStyle: '', activityPace: '', groupPreference: ''},
      venuePreferences: [],
      boundariesAccepted: false,
      selectedIdType: '',
      idSubmittedForReview: false,
      selfieCaptureComplete: false,
      livenessComplete: false,
      addressDetailsComplete: false,
      addressProofSubmitted: false,
      sessionRateINR: 0,
      panConfirmed: false,
      bankVerified: false,
      upiVerified: false,
    });

    const result = getApplicationReadiness(allMissing);
    const allItems = [
      ...result.modules.profile.items,
      ...result.modules.safetyService.items,
      ...result.modules.identity.items,
      ...result.modules.financial.items,
    ];

    for (const item of allItems) {
      const expected = EXPECTED_ROUTES[item.key as MandatoryRequirementKey];
      if (expected !== undefined) {
        expect(item.route).toBe(expected);
      }
    }
  });
});

// ─── 6. Fix context state machine (pure logic) ────────────────────────────────

import type {
  MissingRequirementFixContext,
  MissingRequirementSource,
  MissingRequirementReturnRoute,
} from '../store/slices/applicationStore';

describe('fix context state transitions (pure logic)', () => {
  const DEFAULT: MissingRequirementFixContext = {
    isActive: false,
    source: null,
    requirementKey: null,
    returnRoute: null,
  };

  const start = (ctx: {
    source: MissingRequirementSource;
    requirementKey: MandatoryRequirementKey;
    returnRoute: MissingRequirementReturnRoute;
  }): MissingRequirementFixContext => ({isActive: true, ...ctx});

  const complete = (): MissingRequirementFixContext => ({...DEFAULT});
  const clear = (): MissingRequirementFixContext => ({...DEFAULT});

  it('start sets isActive=true and stores all fields', () => {
    const ctx = start({source: 'verification_hub', requirementKey: 'selfie_liveness', returnRoute: Routes.VERIFICATION_HUB});
    expect(ctx.isActive).toBe(true);
    expect(ctx.source).toBe('verification_hub');
    expect(ctx.requirementKey).toBe('selfie_liveness');
    expect(ctx.returnRoute).toBe(Routes.VERIFICATION_HUB);
  });

  it('complete returns isActive=false with all nulls', () => {
    const ctx = complete();
    expect(ctx.isActive).toBe(false);
    expect(ctx.requirementKey).toBeNull();
    expect(ctx.returnRoute).toBeNull();
  });

  it('clear returns isActive=false with all nulls', () => {
    const ctx = clear();
    expect(ctx.isActive).toBe(false);
    expect(ctx.requirementKey).toBeNull();
  });

  it('second start overwrites first (no double-active)', () => {
    const first = start({source: 'application_progress', requirementKey: 'bio', returnRoute: Routes.APPLICATION_PROGRESS});
    void first;
    const second = start({source: 'verification_hub', requirementKey: 'pan', returnRoute: Routes.VERIFICATION_HUB});
    expect(second.requirementKey).toBe('pan');
    expect(second.source).toBe('verification_hub');
  });

  it('all 4 source returnRoutes are valid', () => {
    const validRoutes: MissingRequirementReturnRoute[] = [
      Routes.APPLICATION_PROGRESS,
      Routes.APPLICATION_REVIEW_INFO,
      Routes.SUBMIT_PROFILE_FOR_APPROVAL,
      Routes.VERIFICATION_HUB,
    ];
    for (const returnRoute of validRoutes) {
      const ctx = start({source: 'application_progress', requirementKey: 'bio', returnRoute});
      expect(ctx.returnRoute).toBe(returnRoute);
    }
  });
});


// ─── 7. Percentage calculation ────────────────────────────────────────────────

describe('percentage calculation', () => {
  it('is 0 when nothing complete', () => {
    const state = withOverride({
      basicDetails: {legalName: '', displayName: '', dateOfBirth: '', gender: ''},
      professionalBio: '',
      interestTags: [],
      experienceCategories: [],
      spokenLanguages: [],
      profilePhotoComplete: false,
      backgroundDeclaration: {criminalRecord: true, drugAbuse: false, sexualMisconduct: false},
      workPreference: {durations: [], days: [], timeRanges: []},
      city: '',
      broadAreas: [],
      commActivityPrefs: {commStyle: '', activityPace: '', groupPreference: ''},
      venuePreferences: [],
      boundariesAccepted: false,
      selectedIdType: '',
      idSubmittedForReview: false,
      selfieCaptureComplete: false,
      livenessComplete: false,
      addressDetailsComplete: false,
      sessionRateINR: 0,
      panConfirmed: false,
      bankVerified: false,
    });
    const result = getApplicationReadiness(state);
    expect(result.percentage).toBe(0);
    expect(result.ready).toBe(false);
  });

  it('is 100 when all complete', () => {
    expect(getApplicationReadiness(COMPLETE_STATE).percentage).toBe(100);
  });
});
