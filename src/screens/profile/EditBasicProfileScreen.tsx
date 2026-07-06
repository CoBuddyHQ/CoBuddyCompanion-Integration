/**
 * CPN-151 — Edit Basic Profile Screen
 * Lets the companion update their name, tagline, bio, and language preferences.
 */
import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../../components/layout/AppHeader';
import { useProfileStore } from '../../store/slices/profileStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name.
  split(' ').
  filter(Boolean).
  slice(0, 2).
  map((n) => n[0].toUpperCase()).
  join('');
}

// ─── Labelled Input ───────────────────────────────────────────────────────────

interface InputProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  hint?: string;
}

const LabelledInput: React.FC<InputProps> = ({
  label, value, onChangeText, placeholder, multiline, maxLength, hint
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={inputStyles.wrap}>
      <Text style={inputStyles.label}>{label}</Text>
      <View style={[inputStyles.inputWrap, focused && inputStyles.inputWrapFocused]}>
        <TextInput
          style={[inputStyles.input, multiline && inputStyles.inputMulti]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={colors.gold} />
        
      </View>
      <View style={inputStyles.hintRow}>
        {hint ? <Text style={inputStyles.hint}>{hint}</Text> : <View />}
        {maxLength &&
        <Text style={inputStyles.charCount}>{value.length}/{maxLength}</Text>
        }
      </View>
    </View>);

};

const inputStyles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textSecondary, marginBottom: 7 },
  inputWrap: {
    backgroundColor: '#0D1B2E',
    borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border,
    paddingHorizontal: spacing.md
  },
  inputWrapFocused: { borderColor: colors.gold },
  input: {
    fontFamily: fontFamily.interRegular, fontSize: 14,
    color: colors.textPrimary, paddingVertical: 13, minHeight: 48
  },
  inputMulti: { minHeight: 120, paddingTop: 13 },
  hintRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  hint: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },
  charCount: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted }
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export function EditBasicProfileScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  // Local editable state — seeded from store or mock fallbacks
  const [name, setName] = useState(profile?.displayName ?? '');
  const [tagline, setTagline] = useState('Explorer & Food Enthusiast');
  const [bio, setBio] = useState(
    profile?.bio ??
    "Hi! I love showing people around the city's hidden gems, trying new cafes, and having deep conversations about tech and life. Let's explore together!"
  );
  const [city, setCity] = useState(profile?.city ?? 'Bhopal');
  const [loading, setLoading] = useState(false);

  const languages = profile?.languages ?? ['Hindi', 'English'];
  const initials = getInitials(name);

  // Dirty flag — any field changed?
  const isDirty =
  name !== (profile?.displayName ?? '') ||
  bio !== (profile?.bio ?? '') ||
  city !== (profile?.city ?? '');

  const handleSave = () => {
    if (loading) {return;}
    setLoading(true);
    // Merge back into store
    updateProfile({ displayName: name.trim(), bio: bio.trim(), city: city.trim() });
    setTimeout(() => {
      setLoading(false);
      navigation.canGoBack() ? navigation.goBack() : undefined;
    }, 800);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        title={t('profile.edit_profile')}
        showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* ══════════════════════════════════════════
                   AVATAR SECTION
                ══════════════════════════════════════════ */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              {/* Online dot */}
              <View style={styles.onlineDot} />
            </View>
            <TouchableOpacity style={styles.editPhotoBtn} activeOpacity={0.7}>
              <Icon name="camera-alt" size={14} color={colors.gold} />
              <Text style={styles.editPhotoText}> {t('profile.edit_photo')} </Text>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>
               {t('profile.your_profile_photo_must_comply_with_cobuddy_guidelines')} </Text>
          </View>

          {/* ══════════════════════════════════════════
                   FORM
                ══════════════════════════════════════════ */}
          <View style={styles.formSection}>
            <LabelledInput
              label={t('profile.display_name')}
              value={name}
              onChangeText={setName}
              placeholder={t('profile.your_public_display_name')}
              maxLength={30}
              hint={t("content.profile.EditBasicProfileScreen.first_name_or_nickname_only")} />
            

            <LabelledInput
              label={t('profile.tagline')}
              value={tagline}
              onChangeText={setTagline}
              placeholder={t('profile.e_g_explorer_food_enthusiast')}
              maxLength={60}
              hint={t("content.profile.EditBasicProfileScreen.shown_on_your_public_profile")} />
            

            <LabelledInput
              label={t('profile.about_me')}
              value={bio}
              onChangeText={setBio}
              placeholder={t('profile.tell_customers_a_little_about_yourself')}
              multiline
              maxLength={300} />
            

            <LabelledInput
              label={t('profile.city')}
              value={city}
              onChangeText={setCity}
              placeholder={t('profile.your_primary_city')}
              maxLength={40} />
            

            {/* ── Languages (static display + edit link) ── */}
            <View style={styles.staticField}>
              <View style={styles.staticFieldHeader}>
                <Text style={inputStyles.label}> {t('profile.spoken_languages')} </Text>
                <TouchableOpacity activeOpacity={0.7}
                onPress={() => navigation.navigate(Routes.EDIT_LANGUAGES)}>
                  <Text style={styles.staticFieldLink}> {t('profile.edit')} </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.languageChips}>
                {languages.map((lang) =>
                <View key={lang} style={styles.langChip}>
                    <Icon name="translate" size={12} color={colors.gold} />
                    <Text style={styles.langChipText}>{lang}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* ── Change phone (read-only hint) ── */}
            <TouchableOpacity style={[styles.staticField, { borderTopWidth: 0 }]}
            onPress={() => Alert.alert(t("alerts.security_restriction"), t("alerts.to_change_your_registered_mobile_number"),


            [{ text: t("alerts.ok") }]
            )} activeOpacity={0.75}>
              <Text style={inputStyles.label}> {t('profile.phone_number')} </Text>
              <View style={styles.phoneRow}>
                <Icon name="lock" size={14} color={colors.textMuted} style={{ marginRight: 6 }} />
                <Text style={styles.phoneText}>
                  {profile?.maskedPhone ?? '+91 ••••••7890'}
                </Text>
                <Icon name="info-outline" size={14} color={colors.gold} style={{ marginLeft: 8 }} />
              </View>
              <Text style={styles.phoneHint}> {t('profile.tap_to_learn_how_to_change_your_number')} </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ══════════════════════════════════════════
               STICKY SAVE BAR
            ══════════════════════════════════════════ */}
      <View style={styles.stickyBar}>
        {isDirty && !loading &&
        <Text style={styles.unsavedHint}> {t('profile.you_have_unsaved_changes')} </Text>
        }
        <TouchableOpacity
          style={[styles.saveBtn, !isDirty && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.85}
          accessibilityLabel={t("accessibility.save_changes")}>
          {loading ?
          <ActivityIndicator size="small" color={colors.rootBg} /> :

          <>
              <Icon name="check" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}> {t('profile.save_changes')} </Text>
            </>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}

export default EditBasicProfileScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  // Avatar
  avatarSection: {
    alignItems: 'center', paddingVertical: spacing.xl, marginBottom: spacing.md
  },
  avatarWrap: { position: 'relative', marginBottom: spacing.md },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#1A2540',
    borderWidth: 3, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.gold, shadowOpacity: 0.25,
    shadowRadius: 10, shadowOffset: { width: 0, height: 0 }
  },
  avatarText: { fontFamily: fontFamily.interBold, fontSize: 28, color: colors.gold },
  onlineDot: {
    position: 'absolute', bottom: 4, right: 4,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: colors.safetyGreen,
    borderWidth: 2, borderColor: colors.rootBg
  },
  editPhotoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 6,
    backgroundColor: 'rgba(214,168,79,0.10)',
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(214,168,79,0.28)',
    marginBottom: spacing.sm
  },
  editPhotoText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold },
  avatarHint: {
    fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted,
    textAlign: 'center', maxWidth: 240
  },

  // Form
  formSection: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xxl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)'
  },

  // Static fields
  staticField: {
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)'
  },
  staticFieldHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.sm
  },
  staticFieldLink: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold },
  languageChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(214,168,79,0.10)',
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)',
    paddingHorizontal: 10, paddingVertical: 4
  },
  langChipText: { fontFamily: fontFamily.interMedium, fontSize: 12, color: colors.gold },

  // Phone
  phoneRow: { flexDirection: 'row', alignItems: 'center' },
  phoneText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textSecondary },
  phoneHint: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },

  // Sticky save bar
  stickyBar: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  unsavedHint: {
    fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.gold,
    textAlign: 'center', marginBottom: spacing.sm
  },
  saveBtn: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold
  },
  saveBtnDisabled: { opacity: 0.55 },
  saveBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});