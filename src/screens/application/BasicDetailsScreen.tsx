import { useTranslation } from 'react-i18next';
/**
 * CPN-023 — BasicDetailsScreen
 * Stitch ref: basic_details_screen/code.html
 *
 * DOB: Modal drum-scroll selector — no external package.
 *   - Cannot be future date.
 *   - Must be 18+ (validateDateOfBirth from validators.ts).
 *   - Stored as ISO string in applicationStore. No AsyncStorage. No logging.
 *   - Displayed as "21 June 2000" (Indian long format).
 *
 * DOB Scroll Bug Fix (2026-06-22):
 *   ROOT CAUSES REMOVED:
 *   1. scrollToIndex() was called inside onMomentumScrollEnd, causing a
 *      second programmatic scroll immediately after the user stopped.
 *   2. days[] array was recreated inline every render — FlatList received
 *      a new items reference, triggering re-layout and fighting user scroll.
 *   3. initialScrollIndex re-applied on every re-render when selectedIndex
 *      prop changed, snapping list back to the programmatic position.
 *   4. safeDay clamping passed to selectedIndex caused DrumColumn to try
 *      scrolling to a different item than where the user landed.
 *
 *   FIX:
 *   - DrumColumn is fully uncontrolled after mount. It holds its own
 *     scroll position via the FlatList ref. Parent receives values only
 *     through onMomentumScrollEnd.
 *   - initialScrollIndex only used for first mount. No scrollToIndex
 *     ever called in response to state updates.
 *   - days/months/years arrays memoized and stable.
 *   - Draft state (draftDay/draftMonth/draftYear) kept inside DOBModal.
 *     applicationStore updated only on Confirm tap.
 *   - Day clamped silently when month/year reduces days — Day FlatList
 *     scroll position is NOT programmatically reset (user keeps position,
 *     confirm just uses clamped value).
 *
 * Privacy:
 *   "Your date of birth is used for eligibility and identity verification.
 *    It is never shown on your public profile."
 */

import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Modal, FlatList, Pressable, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import FormInput from '../../components/form/FormInput';
import { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { navigateToMissingRequirementReturn, cancelMissingRequirementFixAndReturn } from '../../navigation/missingRequirementNavigation';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useApplicationStore } from '../../store/slices/applicationStore';
import { validateLegalName, validateDisplayName, validateEmail, validateDateOfBirth } from '../../utils/validators';
type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.BASIC_DETAILS>;

// â”€â”€â”€ Constants (module-level, never recreated) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5; // must be odd
const SIDE_ITEMS = Math.floor(VISIBLE_ITEMS / 2); // = 2

const MONTHS: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const TODAY = new Date();
const MAX_YEAR = TODAY.getFullYear() - 18; // 18+ enforcement at data level
const MIN_YEAR = TODAY.getFullYear() - 80;

// Stable year array — descending so index 0 = most recent allowed year
const YEAR_ITEMS: string[] = Array.from({
  length: MAX_YEAR - MIN_YEAR + 1
}, (_, i) => String(MAX_YEAR - i));

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function daysInMonth(monthIdx: number, year: number): number {
  return new Date(year, monthIdx + 1, 0).getDate();
}
function buildDayItems(count: number): string[] {
  return Array.from({
    length: count
  }, (_, i) => String(i + 1).padStart(2, '0'));
}

/** "21 June 2000" */
function formatDOBDisplay(iso: string): string {
  if (!iso) {
    return '';
  }
  const d = new Date(iso);
  if (isNaN(d.getTime())) {
    return '';
  }
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** ISO date string from 1-based day, 0-based month, full year */
function toISO(day: number, monthIdx: number, year: number): string {
  return `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Parse stored ISO → {dayIdx (0-based), monthIdx, yearIdx} */
function parseISO(iso: string): {
  dayIdx: number;
  monthIdx: number;
  yearIdx: number;
} | null {
  if (!iso) {
    return null;
  }
  const d = new Date(iso);
  if (isNaN(d.getTime())) {
    return null;
  }
  const yearIdx = MAX_YEAR - d.getFullYear();
  if (yearIdx < 0 || yearIdx >= YEAR_ITEMS.length) {
    return null;
  }
  return {
    dayIdx: d.getDate() - 1,
    monthIdx: d.getMonth(),
    yearIdx
  };
}

// â”€â”€â”€ DrumColumn â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//
// KEY DESIGN DECISIONS:
//   - Fully uncontrolled after mount. Parent must NOT change selectedIndex
//     in response to scroll events — that would cause the list to jump.
//   - initialScrollIndex used ONLY on first mount (or when `resetKey` changes).
//   - scrollToIndex is NEVER called inside onMomentumScrollEnd.
//   - onSelect fires once per completed fling/snap. Parent stores the draft.
//   - items prop must be STABLE (same reference between renders) to prevent
//     FlatList re-layout from fighting user scroll position.

interface DrumColumnProps {
  items: readonly string[];
  initialIndex: number; // read once on mount / resetKey change
  onSelect: (index: number) => void;
  resetKey: number; // increment to force scroll to new initialIndex
}
const DrumColumn = React.memo<DrumColumnProps>(({
  items,
  initialIndex,
  onSelect,
  resetKey
}) => {
  const listRef = useRef<FlatList>(null);
  // Track whether initial scroll has been applied for this resetKey
  const mountedKey = useRef<number>(-1);
  useEffect(() => {
    // Only scroll programmatically when resetKey changes (i.e. modal reopened)
    if (mountedKey.current === resetKey) {
      return;
    }
    mountedKey.current = resetKey;
    const safeIdx = Math.max(0, Math.min(initialIndex, items.length - 1));
    // Small delay to let the FlatList finish its layout before scrolling
    const timer = setTimeout(() => {
      listRef.current?.scrollToOffset({
        offset: safeIdx * ITEM_HEIGHT,
        animated: false
      });
    }, 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]); // intentionally only depends on resetKey

  const handleMomentumScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const raw = e.nativeEvent.contentOffset.y;
    const idx = Math.round(raw / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    onSelect(clamped);
    // Do NOT call scrollToIndex here — that is what caused the snap-back bug.
  }, [items.length, onSelect]);
  const renderItem = useCallback(({
    item


  }: {item: string;}) => <View style={drumSt.item}>
          <Text style={drumSt.itemText}>{item}</Text>
        </View>, []);
  const keyExtractor = useCallback((item: string) => item, []);
  const getItemLayout = useCallback((_: ArrayLike<string> | null | undefined, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index
  }), []);
  return <View style={drumSt.column}>
        {/* Selection highlight overlay */}
        <View style={drumSt.selectionBar} pointerEvents="none" />

        <FlatList ref={listRef} data={items as string[]} keyExtractor={keyExtractor} renderItem={renderItem} getItemLayout={getItemLayout} snapToInterval={ITEM_HEIGHT} decelerationRate="fast" disableIntervalMomentum showsVerticalScrollIndicator={false} nestedScrollEnabled
    // Padding so first/last item can reach centre
    ListHeaderComponent={<View style={{
      height: ITEM_HEIGHT * SIDE_ITEMS
    }} />} ListFooterComponent={<View style={{
      height: ITEM_HEIGHT * SIDE_ITEMS
    }} />} onMomentumScrollEnd={handleMomentumScrollEnd}
    // Do NOT set initialScrollIndex — we control scroll via scrollToOffset
    // in the effect above to avoid the FlatList internal initialScrollIndex
    // re-application bug on Android.
    />
      </View>;
});
const drumSt = StyleSheet.create({
  column: {
    flex: 1,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
    position: 'relative'
  },
  selectionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: ITEM_HEIGHT * SIDE_ITEMS,
    height: ITEM_HEIGHT,
    backgroundColor: `${colors.gold}18`,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    zIndex: 2,
    pointerEvents: 'none'
  } as const,
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemText: {
    ...textStyles.bodyMd,
    color: colors.textSecondary
  }
});

// â”€â”€â”€ DOBModal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//
// KEY DESIGN DECISIONS:
//   - All scroll state is kept as refs (draftDayIdx, draftMonthIdx, draftYearIdx).
//     Using refs (not useState) means DrumColumn does NOT re-render when the user
//     scrolls, which prevents the parent from issuing new scroll commands.
//   - resetKey is incremented each time the modal opens to trigger the one-time
//     initialIndex scroll in each DrumColumn.
//   - applicationStore is updated ONLY when the user taps Confirm.
//   - Day clamping on month/year change is applied silently at Confirm time only.

interface DOBModalProps {
  visible: boolean;
  storedISO: string;
  onConfirm: (isoString: string) => void;
  onClose: () => void;
}
const DOBModal: React.FC<DOBModalProps> = ({
  visible,
  storedISO,
  onConfirm,
  onClose
}) => {
  const {
    t
  } = useTranslation();
  const insets = useSafeAreaInsets();

  // resetKey increments each time the modal becomes visible → DrumColumns
  // fire their initialIndex scroll exactly once per open session.
  const [resetKey, setResetKey] = useState(0);

  // Initial indices derived from storedISO (updated each open)
  const [initDayIdx, setInitDayIdx] = useState(0);
  const [initMonthIdx, setInitMonthIdx] = useState(0);
  const [initYearIdx, setInitYearIdx] = useState(0);

  // Draft indices kept as refs so DrumColumn doesn't re-render during scroll
  const draftDayIdx = useRef(0);
  const draftMonthIdx = useRef(0);
  const draftYearIdx = useRef(0);

  // Sync init indices when modal opens
  useEffect(() => {
    if (!visible) {
      return;
    }
    const parsed = parseISO(storedISO);
    const dayIdx = parsed?.dayIdx ?? 0;
    const monthIdx = parsed?.monthIdx ?? 0;
    const yearIdx = parsed?.yearIdx ?? 0;
    setInitDayIdx(dayIdx);
    setInitMonthIdx(monthIdx);
    setInitYearIdx(yearIdx);
    draftDayIdx.current = dayIdx;
    draftMonthIdx.current = monthIdx;
    draftYearIdx.current = yearIdx;

    // Bump resetKey to trigger DrumColumn scroll-to-initial
    setResetKey((k) => k + 1);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stable memoized day items for the currently selected month/year.
  // We compute this based on initMonthIdx/initYearIdx (which are set on open)
  // NOT on the draft refs (which change on scroll) — this keeps the items
  // array stable during a scroll session.
  // When the user confirms, we clamp the day to valid range at that moment.
  const dayItems = useMemo(() => {
    const year = parseInt(YEAR_ITEMS[initYearIdx] ?? String(MAX_YEAR), 10);
    const count = daysInMonth(initMonthIdx, year);
    return buildDayItems(count);
  }, [initMonthIdx, initYearIdx]);
  const handleConfirm = () => {
    const yearStr = YEAR_ITEMS[draftYearIdx.current] ?? String(MAX_YEAR);
    const year = parseInt(yearStr, 10);
    const monthIdx = draftMonthIdx.current;
    const maxDay = daysInMonth(monthIdx, year);
    const dayIdx = Math.min(draftDayIdx.current, maxDay - 1); // clamp silently
    const iso = toISO(dayIdx + 1, monthIdx, year);
    // Do NOT log iso
    onConfirm(iso);
    onClose();
  };
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={modalSt.backdrop} onPress={onClose} />
      <View style={[modalSt.sheet, {
      paddingBottom: insets.bottom + spacing.lg
    }]}>

        {/* Handle */}
        <View style={modalSt.handle} />
        <Text style={modalSt.title}>{t("content.application_kyc.BasicDetailsContent.DOB_LABEL")}</Text>
        <Text style={modalSt.sub}>{t("content.application_kyc.BasicDetailsContent.DOB_MODAL_SUB")}</Text>

        {/* Column headers */}
        <View style={modalSt.colHeaders}>
          <Text style={modalSt.colHeader}>{t("content.application_kyc.BasicDetailsContent.DOB_MODAL_DAY")}</Text>
          <Text style={modalSt.colHeader}>{t("content.application_kyc.BasicDetailsContent.DOB_MODAL_MONTH")}</Text>
          <Text style={modalSt.colHeader}>{t("content.application_kyc.BasicDetailsContent.DOB_MODAL_YEAR")}</Text>
        </View>

        {/* Drum */}
        <View style={modalSt.drum}>
          <DrumColumn items={dayItems} initialIndex={initDayIdx} onSelect={(idx) => {
          draftDayIdx.current = idx;
        }} resetKey={resetKey} />
          
          <View style={modalSt.divider} />
          <DrumColumn items={MONTHS} initialIndex={initMonthIdx} onSelect={(idx) => {
          draftMonthIdx.current = idx;
        }} resetKey={resetKey} />
          
          <View style={modalSt.divider} />
          <DrumColumn items={YEAR_ITEMS} initialIndex={initYearIdx} onSelect={(idx) => {
          draftYearIdx.current = idx;
        }} resetKey={resetKey} />
          
        </View>

        {/* Actions */}
        <View style={modalSt.btnRow}>
          <TouchableOpacity style={modalSt.cancelBtn} onPress={onClose} activeOpacity={0.75}>
            <Text style={modalSt.cancelText}>{t("content.application_kyc.BasicDetailsContent.DOB_MODAL_CANCEL")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={modalSt.confirmBtn} onPress={handleConfirm} activeOpacity={0.8}>
            <Text style={modalSt.confirmText}>{t("content.application_kyc.BasicDetailsContent.DOB_MODAL_CONFIRM")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>;
};
const modalSt = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay
  },
  sheet: {
    backgroundColor: colors.secondaryBg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md
  },
  title: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center'
  },
  sub: {
    ...textStyles.bodySm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.md
  },
  colHeaders: {
    flexDirection: 'row',
    marginBottom: spacing.xs
  },
  colHeader: {
    flex: 1,
    ...textStyles.labelSm,
    color: colors.textMuted,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 10
  },
  drum: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.cardSurface,
    overflow: 'hidden',
    marginBottom: spacing.lg
  },
  divider: {
    width: 1,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    backgroundColor: colors.border
  },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.md
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  cancelText: {
    ...textStyles.labelMd,
    color: colors.textSecondary
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.gold,
    alignItems: 'center'
  },
  confirmText: {
    ...textStyles.labelMd,
    color: colors.rootBg,
    fontWeight: '700'
  }
});

// â”€â”€â”€ Main screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const BasicDetailsScreen: React.FC<Props> = ({
  navigation
}) => {
  const {
    t
  } = useTranslation();
  const {
    basicDetails,
    updateBasicDetails,
    setCurrentStage,
    profileCorrectionContext,
    completeProfileCorrection,
    missingRequirementFixContext,
    completeMissingRequirementFix,
    clearMissingRequirementFix
  } = useApplicationStore();
  const [legalNameError, setLegalNameError] = useState<string | null>(null);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState(basicDetails.gender);
  const [dobModalVisible, setDobModalVisible] = useState(false);
  const dobDisplay = basicDetails.dateOfBirth ? formatDOBDisplay(basicDetails.dateOfBirth) : '';
  const validateDOB = useCallback((iso: string): string | null => {
    if (!iso) {
      return 'Date of birth is required.';
    }
    const d = new Date(iso);
    if (isNaN(d.getTime())) {
      return 'Please select a valid date of birth.';
    }
    if (d > TODAY) {
      return 'Date of birth cannot be in the future.';
    }
    return validateDateOfBirth(d);
  }, []);
  const handleDOBConfirm = useCallback((iso: string) => {
    // DO NOT log ISO date
    updateBasicDetails({
      dateOfBirth: iso
    });
    setDobError(validateDOB(iso));
  }, [updateBasicDetails, validateDOB]);
  const canContinue = basicDetails.legalName.trim().length > 1 && basicDetails.displayName.trim().length > 1 && basicDetails.email.trim().length > 3 && !!basicDetails.dateOfBirth && !legalNameError && !displayNameError && !emailError && !dobError;
  const handleContinue = () => {
    const le = validateLegalName(basicDetails.legalName);
    const de = validateDisplayName(basicDetails.displayName);
    const ee = validateEmail(basicDetails.email);
    const dobe = validateDOB(basicDetails.dateOfBirth);
    setLegalNameError(le);
    setDisplayNameError(de);
    setEmailError(ee);
    setDobError(dobe);
    if (le || de || ee || dobe) {
      return;
    }
    setCurrentStage('basic_details');
    if (profileCorrectionContext.isActive) {
      completeProfileCorrection('basic_details');
      navigation.navigate(Routes.PROFILE_COMPLETION_CHECKLIST, {
        mode: 'correction'
      });
      return;
    }
    // Missing-requirement fix return: navigate back to source hub.
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('basic_details');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.BIO_INTRODUCTION);
  };
  return <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => cancelMissingRequirementFixAndReturn(navigation, missingRequirementFixContext.isActive, missingRequirementFixContext.returnRoute, clearMissingRequirementFix)} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Phase badge */}
          <View style={styles.phaseBadge}>
            <Icon name="person" size={13} color={colors.gold} />
            <Text style={styles.phaseBadgeText}>{t("content.application_kyc.BasicDetailsContent.SECTION_BADGE")}</Text>
          </View>

          {/* Hero */}
          <View style={styles.heroWrap}>
            <View style={styles.heroCircle}>
              <Icon name="person" size={44} color={colors.gold} />
            </View>
          </View>

          <Text style={styles.headline}>{t("content.application_kyc.BasicDetailsContent.HEADLINE")}</Text>
          <Text style={styles.subheadline}>{t("content.application_kyc.BasicDetailsContent.SUBHEADLINE")}</Text>

          {/* Identity card */}
          <GlassCard style={styles.card}>
            <Text style={styles.fieldSection}>{t("content.application_kyc.BasicDetailsContent.SECTION_IDENTITY_TITLE")}</Text>
            <Text style={styles.fieldSectionSub}>{t("content.application_kyc.BasicDetailsContent.SECTION_IDENTITY_SUB")}</Text>

            <FormInput label={t("content.application_kyc.BasicDetailsContent.LEGAL_NAME_LABEL")} value={basicDetails.legalName} onChangeText={(v: string) => {
            updateBasicDetails({
              legalName: v
            });
            if (legalNameError) {
              setLegalNameError(validateLegalName(v));
            }
          }} onBlur={() => setLegalNameError(validateLegalName(basicDetails.legalName))} placeholder={t("content.application_kyc.BasicDetailsContent.LEGAL_NAME_PLACEHOLDER")} error={legalNameError ?? undefined} autoCapitalize="words" returnKeyType="next" accessibilityLabel={t("content.application_kyc.BasicDetailsContent.ACCESSIBILITY_LEGAL_NAME")} />
            
            <Text style={styles.fieldHint}>{t("content.application_kyc.BasicDetailsContent.LEGAL_NAME_HINT")}</Text>

            <FormInput label={t("content.application_kyc.BasicDetailsContent.DISPLAY_NAME_LABEL")} value={basicDetails.displayName} onChangeText={(v: string) => {
            updateBasicDetails({
              displayName: v
            });
            if (displayNameError) {
              setDisplayNameError(validateDisplayName(v));
            }
          }} onBlur={() => setDisplayNameError(validateDisplayName(basicDetails.displayName))} placeholder={t("content.application_kyc.BasicDetailsContent.DISPLAY_NAME_PLACEHOLDER")} error={displayNameError ?? undefined} autoCapitalize="words" returnKeyType="next" accessibilityLabel={t("content.application_kyc.BasicDetailsContent.ACCESSIBILITY_DISPLAY_NAME")} />
            
            <Text style={styles.fieldHint}>{t("content.application_kyc.BasicDetailsContent.DISPLAY_NAME_HINT")}</Text>
          </GlassCard>

          {/* Contact & DOB card */}
          <GlassCard style={styles.card}>
            <Text style={styles.fieldSection}>{t("content.application_kyc.BasicDetailsContent.SECTION_CONTACT_TITLE")}</Text>
            <Text style={styles.fieldSectionSub}>{t("content.application_kyc.BasicDetailsContent.SECTION_CONTACT_SUB")}</Text>

            <FormInput label={t("content.application_kyc.BasicDetailsContent.EMAIL_LABEL")} value={basicDetails.email} onChangeText={(v: string) => {
            updateBasicDetails({
              email: v
            });
            if (emailError) {
              setEmailError(validateEmail(v));
            }
          }} onBlur={() => setEmailError(validateEmail(basicDetails.email))} placeholder={t("content.application_kyc.BasicDetailsContent.EMAIL_PLACEHOLDER")} error={emailError ?? undefined} keyboardType="email-address" autoCapitalize="none" returnKeyType="next" accessibilityLabel={t("content.application_kyc.BasicDetailsContent.ACCESSIBILITY_EMAIL")} />
            
            <Text style={styles.fieldHint}>{t("content.application_kyc.BasicDetailsContent.EMAIL_HINT")}</Text>

            {/* DOB trigger button */}
            <Text style={styles.dobLabel}>{t("content.application_kyc.BasicDetailsContent.DOB_LABEL")} *</Text>
            <TouchableOpacity style={[styles.dobButton, dobDisplay ? styles.dobButtonFilled : null, dobError ? styles.dobButtonError : null]} onPress={() => setDobModalVisible(true)} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={dobDisplay ? `Date of birth: ${dobDisplay}. Tap to change.` : t("content.application.BasicDetailsScreen.select_date_of_birth")}>
              <Icon name="cake" size={20} color={dobDisplay ? colors.gold : colors.textMuted} />
              <Text style={[styles.dobButtonText, !!dobDisplay && styles.dobButtonTextFilled]}>
                {dobDisplay || t("content.application_kyc.BasicDetailsContent.DOB_PLACEHOLDER")}
              </Text>
              <Icon name="arrow-drop-down" size={22} color={colors.textMuted} />
            </TouchableOpacity>

            {dobError ? <Text style={styles.dobErrorText}>{dobError}</Text> : null}

            {/* DOB privacy note */}
            <View style={styles.dobPrivacyRow}>
              <Icon name="lock" size={13} color={colors.textMuted} />
              <Text style={styles.dobPrivacyText}>{t("content.application_kyc.BasicDetailsContent.DOB_PRIVACY_NOTE")}</Text>
            </View>
          </GlassCard>

          {/* Gender card */}
          <GlassCard style={styles.card}>
            <Text style={styles.fieldSection}>{t("content.application_kyc.BasicDetailsContent.GENDER_LABEL")}</Text>
            <Text style={styles.fieldSectionSub}>{t("content.application_kyc.BasicDetailsContent.GENDER_HINT")}</Text>
            <View style={styles.genderGrid}>
              {((Array.isArray(t("content.application_kyc.BasicDetailsContent.GENDER_OPTIONS", { returnObjects: true })) ? (t("content.application_kyc.BasicDetailsContent.GENDER_OPTIONS", { returnObjects: true }) as any[]) : [])).map((g, index) => <TouchableOpacity key={`ui-opt-${index}-${g}`} style={[styles.genderChip, selectedGender === g && styles.genderChipSelected]} onPress={() => {
              const next = selectedGender === g ? '' : g;
              setSelectedGender(next);
              updateBasicDetails({
                gender: next
              });
            }} accessibilityRole="radio" accessibilityState={{
              selected: selectedGender === g
            }}>
                  <Text style={[styles.genderChipText, selectedGender === g && styles.genderChipTextSelected]}>
                    {g}
                  </Text>
                </TouchableOpacity>)}
            </View>
          </GlassCard>

          {/* Privacy note */}
          <GlassCard style={styles.privacyCard}>
            <View style={styles.privacyRow}>
              <Icon name="lock" size={16} color={colors.gold} />
              <Text style={styles.privacyText}>{t("content.application_kyc.BasicDetailsContent.PRIVACY_NOTE")}</Text>
            </View>
          </GlassCard>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        <ActionButton label={t("content.application_kyc.BasicDetailsContent.CTA_PRIMARY")} onPress={handleContinue} variant="primary" disabled={!canContinue} rightIcon={t("application.arrow_forward")} accessibilityLabel={t("content.application_kyc.BasicDetailsContent.ACCESSIBILITY_SAVE")} />
        
      </View>

      {/* DOB picker modal */}
      <DOBModal visible={dobModalVisible} storedISO={basicDetails.dateOfBirth} onConfirm={handleDOBConfirm} onClose={() => setDobModalVisible(false)} />
      
    </SafeAreaView>;
};

// â”€â”€â”€ Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.rootBg
  },
  flex: {
    flex: 1
  },
  scroll: {
    flex: 1
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1,
    borderColor: colors.border
  },
  phaseBadgeText: {
    ...textStyles.labelSm,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  heroWrap: {
    alignSelf: 'center'
  },
  heroCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4
  },
  headline: {
    ...textStyles.displaySm,
    color: colors.textPrimary,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-SemiBold'
  },
  subheadline: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center'
  },
  card: {
    gap: spacing.sm
  },
  fieldSection: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  fieldSectionSub: {
    ...textStyles.bodySm,
    color: colors.textMuted,
    marginBottom: spacing.xs
  },
  fieldHint: {
    ...textStyles.bodySm,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: -spacing.xs
  },
  dobLabel: {
    ...textStyles.labelSm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: 4
  },
  dobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border
  },
  dobButtonFilled: {
    borderColor: colors.border
  },
  dobButtonError: {
    borderColor: colors.softWarning
  },
  dobButtonText: {
    ...textStyles.bodyMd,
    color: colors.textMuted,
    flex: 1
  },
  dobButtonTextFilled: {
    color: colors.textPrimary
  },
  dobErrorText: {
    ...textStyles.bodySm,
    color: colors.softWarning,
    lineHeight: 18
  },
  dobPrivacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: spacing.xs
  },
  dobPrivacyText: {
    ...textStyles.bodySm,
    color: colors.textMuted,
    flex: 1,
    lineHeight: 18
  },
  genderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  genderChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border
  },
  genderChipSelected: {
    backgroundColor: `${colors.gold}18`,
    borderColor: colors.gold
  },
  genderChipText: {
    ...textStyles.labelSm,
    color: colors.textSecondary
  },
  genderChipTextSelected: {
    color: colors.gold
  },
  privacyCard: {},
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm
  },
  privacyText: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20
  },
  ctaWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1,
    borderTopColor: colors.border
  }
});
export default BasicDetailsScreen;