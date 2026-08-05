/**
 * missingRequirementNavigation.ts
 *
 * Shared helpers for the missing-requirement fix flow.
 *
 * ALL cross-stack navigation is consolidated here in a single exhaustive switch.
 * Every call site uses these helpers — ZERO "as any" remain at call sites.
 *
 * Return routes span two navigators:
 *   ApplicationStackParamList  — APPLICATION_PROGRESS, APPLICATION_REVIEW_INFO, SUBMIT_PROFILE_FOR_APPROVAL
 *   VerificationStackParamList — VERIFICATION_HUB, VERIFICATION_PENDING, VERIFICATION_PROCESSING
 *
 * The single unavoidable cross-stack cast is confined to navigateToMissingRequirementReturn.
 */

import type {StackNavigationProp} from '@react-navigation/stack';
import type {ParamListBase} from '@react-navigation/native';
import {Routes} from './routes';
import type {MissingRequirementReturnRoute} from '../store/slices/applicationStore';

// Convenience alias: any screen's navigation prop
type AnyStackNav = StackNavigationProp<ParamListBase>;

// ─── Utility ────────────────────────────────────────────────────────────────

export function assertNever(value: never): never {
  throw new Error(
    `[assertNever] Unhandled MissingRequirementReturnRoute: ${String(value)}`,
  );
}

// ─── Canonical requirement keys ─────────────────────────────────────────────
// Values MUST match MandatoryItemResult.key in applicationReadinessSelector.ts exactly.

export type MandatoryRequirementKey =
  | 'basic_details'
  | 'bio'
  | 'interests'
  | 'experience'
  | 'languages'
  | 'profile_photo'
  | 'background_declaration'
  | 'work_preference'
  | 'city'
  | 'comm_activity'
  | 'venue_preference'
  | 'boundaries'
  | 'id_type'
  | 'id_submitted'
  | 'selfie_liveness'
  | 'address_details'
  | 'address_proof'
  | 'pricing'
  | 'pan'
  | 'bank'
  | 'upi';

// ─── Return-route navigation ─────────────────────────────────────────────────

// Internal typed-replace helper: StackNavigationProp<ParamListBase>.replace
// accepts any string key — the cast is needed because TypeScript cannot
// resolve cross-navigator routes from a single navigation prop.
 
function _replace(navigation: AnyStackNav, route: string): void {
  (navigation as any).replace(route);
}
 

/**
 * navigateToMissingRequirementReturn
 *
 * Replaces the current screen with the hub that launched the fix flow.
 * Uses replace() so Back cannot return to the completed fix screen.
 *
 * THIS IS THE ONLY PLACE in the codebase that performs a cross-stack cast.
 * All call sites use this typed helper — no "as any" at call sites.
 */
export function navigateToMissingRequirementReturn(
  navigation: AnyStackNav,
  returnRoute: MissingRequirementReturnRoute,
): void {
  switch (returnRoute) {
    case Routes.APPLICATION_PROGRESS:
      _replace(navigation, Routes.APPLICATION_PROGRESS);
      return;
    case Routes.APPLICATION_REVIEW_INFO:
      _replace(navigation, Routes.APPLICATION_REVIEW_INFO);
      return;
    case Routes.SUBMIT_PROFILE_FOR_APPROVAL:
      _replace(navigation, Routes.SUBMIT_PROFILE_FOR_APPROVAL);
      return;
    case Routes.VERIFICATION_HUB:
      _replace(navigation, Routes.VERIFICATION_HUB);
      return;
    case Routes.VERIFICATION_PENDING:
      _replace(navigation, Routes.VERIFICATION_PENDING);
      return;
    case Routes.VERIFICATION_PROCESSING:
      _replace(navigation, Routes.VERIFICATION_PROCESSING);
      return;
    default:
      assertNever(returnRoute);
  }
}

/**
 * navigateToRequirementFixScreen
 *
 * Navigates from a source hub to a fix target screen.
 * Used by ApplicationProgressScreen, ApplicationReviewInfoScreen,
 * SubmitProfileForApprovalScreen, and VerificationHubScreen.
 *
 * The route comes from MandatoryItemResult.route (a string constant).
 * The cast is required because navigate() expects a literal key.
 */
 
export function navigateToRequirementFixScreen(
  navigation: AnyStackNav,
  route: string,
): void {
  (navigation as any).navigate(route);
}
 

/**
 * cancelMissingRequirementFixAndReturn
 *
 * Called when the user presses Back/Cancel from a fix screen.
 * Clears fix context WITHOUT completing the requirement, then returns to source hub.
 * When no fix context is active, falls back to navigation.goBack().
 */
export function cancelMissingRequirementFixAndReturn(
  navigation: AnyStackNav,
  isActive: boolean,
  returnRoute: MissingRequirementReturnRoute | null,
  clearMissingRequirementFix: () => void,
): void {
  if (!isActive || !returnRoute) {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
    return;
  }
  clearMissingRequirementFix();
  navigateToMissingRequirementReturn(navigation, returnRoute);
}
