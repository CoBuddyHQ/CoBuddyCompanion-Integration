import i18next from "i18next";import { useTranslation } from 'react-i18next';
/**
* CPN-035 � Profile Photo Upload Screen
* Phase 4B Visual Consistency Polish
*
* Visual system: matches CPN-021 to CPN-032
*   - ScreenTopBar (shared, consistent)
*   - ApplicationPhaseProgress: "Financial Setup"
*   - Hero circle: 88×88, cardSurface bg, colors.border, gold glow, 44px icon
*   - Headline: textStyles.displayMd (Playfair SemiBold), centered
*   - Cards: GlassCard
*   - Primary CTA: ActionButton variant="primary" (disabled until photoUri set)
*   - Secondary: ActionButton variant="ghost" for Skip (hidden in correction mode)
*
* BUSINESS LOGIC PRESERVED (unchanged):
*   - photoUri stays ONLY in component state (never Zustand � privacy rule)
*   - Skip: navigates forward without photo in normal mode ONLY.
*     In correction mode, Skip is hidden and a required-photo note is shown.
*   - navigation CPN-035 ? CPN-036 (normal) or ? CPN-046 correction (correction mode)
*/

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { launchCamera, launchImageLibrary, MediaType, PhotoQuality } from 'react-native-image-picker';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
  AppState,
  type AppStateStatus,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { useApplicationStore } from '../../store/slices/applicationStore';
import { ProfileService } from '../../services/api/services/profile.service';
import { UploadsService } from '../../services/api/services/uploads.service';


import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { navigateToMissingRequirementReturn, cancelMissingRequirementFixAndReturn } from '../../navigation/missingRequirementNavigation';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.PROFILE_PHOTO_UPLOAD>;

const PHOTO_STANDARDS = [
{ icon: 'face', label: i18next.t("content.application.ProfilePhotoUploadScreen.face_clearly_visible"), body: 'Ensure your face is centered and unobscured.', isError: false },
{ icon: 'light-mode', label: i18next.t("content.application.ProfilePhotoUploadScreen.good_lighting"), body: 'Use natural light or well-lit environments.', isError: false },
{ icon: 'work', label: i18next.t("content.application.ProfilePhotoUploadScreen.professional_presentation"), body: 'Dress appropriately for client interactions.', isError: false },
{ icon: 'block', label: i18next.t("content.application.ProfilePhotoUploadScreen.no_inappropriate_content"), body: 'Avoid filters, sunglasses, or distracting backgrounds.', isError: true }] as
const;

export function ProfilePhotoUploadScreen({ navigation }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const {
    setApplicationResumeTarget, setDraftSaved, setProfileChecklistMode, setProfilePhotoComplete,
    profileCorrectionContext, completeProfileCorrection,
    missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix
  } = useApplicationStore();
  // URI stays ONLY in component state  never written to Zustand (privacy rule)
  const [photoUri, setPhotoUri] = useState<string | null>(null);


  // ─── AppState ref — used to recheck permission after returning from Settings ───
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const pendingPickerMode = useRef<'camera' | 'library' | 'gallery' | null>(null);

  useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState) => {
      // App came back to foreground after being in background (Settings)
      if (appStateRef.current === 'background' && nextState === 'active') {
        const mode = pendingPickerMode.current;
        if (mode) {
          pendingPickerMode.current = null;
          const alreadyGranted = await checkPermission(mode);
          if (alreadyGranted) {
            openPicker(mode);
          }
        }
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, []);

  // ─── Check current permission status (no dialog) ─────────────────────────
  const checkPermission = async (mode: 'camera' | 'library' | 'gallery'): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const perm = getPermissionForMode(mode);
      const result = await PermissionsAndroid.check(perm);
      return result;
    } catch {
      return false;
    }
  };

  // ─── Pick the right Android permission for mode + OS version ─────────────
  const getPermissionForMode = (mode: 'camera' | 'library' | 'gallery') => {
    if (mode === 'camera') return PermissionsAndroid.PERMISSIONS.CAMERA;
    // Android 13+ (API 33+): READ_MEDIA_IMAGES
    // Android 12 and below: READ_EXTERNAL_STORAGE
    return Number(Platform.Version) >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
  };

  // ─── Show "Open Settings" alert ──────────────────────────────────────────
  const showSettingsAlert = (mode: 'camera' | 'library' | 'gallery') => {
    const permName = mode === 'camera' ? 'Camera' : 'Photos/Storage';
    pendingPickerMode.current = mode; // Will recheck when app returns
    Alert.alert(
      `${permName} Permission Required`,
      `CoBuddy needs ${permName} access to add your profile photo. Please enable it in Settings.`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => { pendingPickerMode.current = null; } },
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
      ]
    );
  };

  // ─── Request permission → returns grant result ───────────────────────────
  const requestPermission = async (mode: 'camera' | 'library' | 'gallery'): Promise<'granted' | 'denied' | 'never_ask_again'> => {
    if (Platform.OS !== 'android') return 'granted';
    try {
      const perm = getPermissionForMode(mode);
      const isCamera = mode === 'camera';
      const result = await PermissionsAndroid.request(perm, {
        title: isCamera ? 'Camera Permission' : 'Gallery Permission',
        message: isCamera
          ? 'CoBuddy Companion needs camera access to take your profile photo.'
          : 'CoBuddy Companion needs gallery access to choose your profile photo.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
        buttonNeutral: 'Ask Me Later',
      });
      if (result === PermissionsAndroid.RESULTS.GRANTED) return 'granted';
      if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) return 'never_ask_again';
      return 'denied';
    } catch {
      return 'denied';
    }
  };

  // ─── Actually open camera or gallery ─────────────────────────────────────
  const openPicker = useCallback(async (mode: 'camera' | 'library' | 'gallery') => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as PhotoQuality,
    };
    try {
      const response = mode === 'camera'
        ? await launchCamera(options)
        : await launchImageLibrary(options);

      if (!response) return; // cancelled via back button on some devices
      if (response.didCancel) return; // user tapped Cancel
      if (response.errorCode) {
        Alert.alert(t('alerts.error'), response.errorMessage || 'Image picker error');
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setPhotoUri(asset.uri ?? null);
      }
    } catch (err: any) {
      console.warn('[ImagePicker]', err?.message);
      // Don't show alert on user cancellation
      if (!err?.message?.includes('cancel')) {
        Alert.alert(t('alerts.error'), 'Could not open. Please try again.');
      }
    }
  }, [t]);

  // ─── Main entry point: check → request → open ────────────────────────────
  const handlePickPhoto = useCallback(async (mode: 'camera' | 'library' | 'gallery') => {
    // 1. Check if already granted — skip the dialog
    const already = await checkPermission(mode);
    if (already) {
      openPicker(mode);
      return;
    }

    // 2. Request — shows Android system dialog
    const result = await requestPermission(mode);

    if (result === 'granted') {
      openPicker(mode);
    } else if (result === 'never_ask_again') {
      // Android won't show dialog anymore — send to Settings
      showSettingsAlert(mode);
    } else {
      // Denied this time — offer Settings anyway
      showSettingsAlert(mode);
    }
  }, [openPicker]);

  const showPicker = handlePickPhoto;

  const handleContinue = useCallback(async () => {
    if (!photoUri) return;
    setProfilePhotoComplete(true);

    try {
      if (photoUri.startsWith('http') || photoUri.startsWith('stub://')) {
        await ProfileService.updatePhotos({ photoUrls: [photoUri] });
      } else {
        // Prepare file object for FormData
        const file = {
          uri: photoUri,
          type: 'image/jpeg',
          name: `profile_${Date.now()}.jpg`
        };
        const result = await UploadsService.uploadProfilePhoto(file);
        // Ensure photo is populated correctly in store
        useApplicationStore.getState().hydrateProfileData({ photoUrl: result.photoUrl });
        if (result.onboardingStatus) {
          useApplicationStore.getState().hydrateOnboardingStatus(result.onboardingStatus);
        }
      }
    } catch (e: any) {
      // ApiClient logs request & response
      Alert.alert(t("alerts.error"), e.message || 'Failed to upload photo');
      setProfilePhotoComplete(false); // Revert on failure
      return;
    }

    if (profileCorrectionContext.isActive) {
      completeProfileCorrection('profile_photo');
      navigation.navigate(Routes.PROFILE_COMPLETION_CHECKLIST, { mode: 'correction' });
      return;
    }
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('profile_photo');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    setProfileChecklistMode('profile_setup');
    navigation.navigate(Routes.PROFILE_COMPLETION_CHECKLIST, { mode: 'profile_setup' });
  }, [
    photoUri, setProfilePhotoComplete, setProfileChecklistMode,
    profileCorrectionContext, completeProfileCorrection,
    missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix, navigation, t
  ]);

  const handleSaveFinishLater = useCallback(() => {
    // 'Save & Finish Later' in normal mode: saves draft, navigates to APPLICATION_SAVED_DRAFT.
    // NOT allowed in correction mode (correction requires a real photo submission).
    if (profileCorrectionContext.isActive) {return;}
    setApplicationResumeTarget({ route: Routes.PROFILE_PHOTO_UPLOAD });
    setDraftSaved(new Date().toISOString());
    navigation.navigate(Routes.APPLICATION_SAVED_DRAFT);
  }, [profileCorrectionContext.isActive, setApplicationResumeTarget, setDraftSaved, navigation]);

  const handleSaveDraft = useCallback(() => {
    setApplicationResumeTarget({ route: Routes.PROFILE_PHOTO_UPLOAD });
    setDraftSaved(new Date().toISOString());
    navigation.navigate(Routes.APPLICATION_SAVED_DRAFT);
  }, [setApplicationResumeTarget, setDraftSaved, navigation]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar
        title={t("application.cobuddy_companion")}
        onBack={() => cancelMissingRequirementFixAndReturn(navigation, missingRequirementFixContext.isActive, missingRequirementFixContext.returnRoute, clearMissingRequirementFix)} />
      

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.ProfilePhotoUploadContent.SECTION_BADGE")}</Text>
        </View>

        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon
              name={photoUri ? 'check-circle' : 'add-a-photo'}
              size={44}
              color={photoUri ? colors.safetyGreen : colors.gold} />
            
          </View>
          <View style={styles.heroBadge}>
            <Icon name="verified-user" size={16} color={colors.gold} />
          </View>
        </View>

        {/* ── Headline ── */}
        <Text style={styles.headline}>{t("content.application_kyc.ProfilePhotoUploadContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.ProfilePhotoUploadContent.SUBHEADLINE")}</Text>

        {/* ── Upload Zone Card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("application.profile_photo")}</Text>

          {/* Circular upload zone */}
          <TouchableOpacity accessibilityRole="button"
            style={[styles.uploadZone, photoUri && styles.uploadZoneActive]}
            onPress={() => showPicker('camera')}
            accessibilityLabel={t("accessibility.upload_profile_photo")}
            >
            <Icon
              name={photoUri ? 'check-circle' : 'add-a-photo'}
              size={40}
              color={photoUri ? colors.safetyGreen : colors.gold} />
            
            <Text style={styles.uploadHint}>
              {photoUri ? t("content.application.ProfilePhotoUploadScreen.photo_added_tap_to_retake") : t("content.application.ProfilePhotoUploadScreen.tap_to_upload_profile_photo")}
            </Text>
          </TouchableOpacity>

          {/* Camera / Gallery row */}
          <View style={styles.pickerRow}>
            <TouchableOpacity accessibilityRole="button"
              style={styles.pickerBtn}
              onPress={() => showPicker('camera')}
              accessibilityLabel={t("content.application_kyc.ProfilePhotoUploadContent.CTA_CAMERA")}>
              <Icon name="photo-camera" size={spacing.iconMd} color={colors.textPrimary} />
              <Text style={styles.pickerBtnText}>{t("content.application_kyc.ProfilePhotoUploadContent.CTA_CAMERA")}</Text>
            </TouchableOpacity>
            <TouchableOpacity accessibilityRole="button"
              style={styles.pickerBtn}
              onPress={() => showPicker('gallery')}
              accessibilityLabel={t("accessibility.choose_from_gallery")}>
              <Icon name="photo-library" size={spacing.iconMd} color={colors.textPrimary} />
              <Text style={styles.pickerBtnText}>{t("application.gallery")}</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* ── Photo Standards Card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ProfilePhotoUploadContent.PHOTO_STANDARDS_TITLE").toUpperCase()}</Text>
          <View style={styles.standardsList}>
            {PHOTO_STANDARDS.map((item) =>
            <View key={t(item.label)} style={styles.standardRow}>
                <View style={[styles.standardIconWrap, item.isError && styles.standardIconError]}>
                  <Icon
                  name={item.icon}
                  size={spacing.iconMd}
                  color={item.isError ? colors.softWarning : colors.gold} />
                
                </View>
                <View style={styles.standardText}>
                  <Text style={styles.standardLabel}>{t(item.label)}</Text>
                  <Text style={styles.standardBody}>{item.body}</Text>
                </View>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── Review Note � NOT a verified/approved claim ── */}
        <GlassCard style={styles.card}>
          <View style={styles.reviewRow}>
            <Icon name="admin-panel-settings" size={spacing.iconLg} color={colors.gold} />
            <Text style={styles.reviewText}>{t("content.application_kyc.ProfilePhotoUploadContent.REVIEW_NOTE")}</Text>
          </View>
        </GlassCard>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.ProfilePhotoUploadContent.CTA_PRIMARY")}
          onPress={handleContinue}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          disabled={!photoUri}
          accessibilityLabel={t("accessibility.save_photo_and_continue")} />
        
        {/* Skip � hidden in correction mode (required section cannot be skipped) */}
        {!profileCorrectionContext.isActive ?
        <ActionButton
          label={t("application.save_finish_later")}
          onPress={handleSaveFinishLater}
          variant="ghost"
          style={styles.skipBtn}
          accessibilityLabel={t("accessibility.save_draft_and_finish_later")} /> :


        <Text style={styles.correctionSkipNote}>{t("application.a_valid_profile_photo_is_required_to_com")}

        </Text>
        }
        <ActionButton
          label={t("application.save_draft")}
          onPress={handleSaveDraft}
          variant="ghost"
          style={styles.skipBtn}
          accessibilityLabel={t("accessibility.save_draft_and_continue_later")} />
        
      </View>
    </SafeAreaView>);

}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg
  },

  // Hero
  heroWrap: { alignSelf: 'center', position: 'relative', marginBottom: spacing.sm },
  heroCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.cardSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 6
  },
  heroBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'
  },

  // Headline
  headline: {
    ...textStyles.displayMd,
    color: colors.textPrimary,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-SemiBold'
  },
  subheadline: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center'
  },

  // Cards
  card: { gap: spacing.md },
  cardTitle: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },

  // Upload zone
  uploadZone: {
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.border,
    backgroundColor: colors.elevatedSurface,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
    gap: spacing.sm
  },
  uploadZoneActive: {
    borderStyle: 'solid', borderColor: colors.gold,
    backgroundColor: colors.goldSubtle
  },
  uploadHint: {
    ...textStyles.labelSm,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.lg
  },

  // Picker row
  pickerRow: {
    flexDirection: 'row', gap: spacing.sm
  },
  pickerBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.borderSurface,
    borderRadius: radius.md,
    paddingVertical: spacing.md
  },
  pickerBtnText: { ...textStyles.labelMd, color: colors.textPrimary },

  // Photo standards
  standardsList: { gap: spacing.md },
  standardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  standardIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  standardIconError: {
    backgroundColor: colors.softWarningSubtle,
    borderColor: `${colors.softWarning}30`
  },
  standardText: { flex: 1 },
  standardLabel: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  standardBody: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  // Review note
  reviewRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  reviewText: {
    ...textStyles.bodySm, color: colors.textSecondary, flex: 1, lineHeight: 20
  },

  bottomPad: { height: spacing.xl },

  // CTA footer
  ctaWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.xs
  },
  skipBtn: { marginTop: spacing.xs },
  correctionSkipNote: {
    ...textStyles.bodySm,
    color: colors.warningAmber,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'center',
    backgroundColor: colors.goldSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.huge,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    marginBottom: spacing.xl
  },
  phaseBadgeText: {
    ...textStyles.capsSm,
    color: colors.gold,
    letterSpacing: 1
  }
});