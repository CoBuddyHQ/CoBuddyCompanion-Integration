/**
 * EditBioScreen (CPN-137)
 */
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useProfileStore } from '../../store/slices/profileStore';
import { useApplicationStore } from '../../store/slices/applicationStore';
import { useTranslation } from "react-i18next";

const MAX_CHARS = 500;
const PLACEHOLDER = 'Tell customers about yourself — your hobbies, interests, what makes you a great companion...';

export function EditBioScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const applicationBio = useApplicationStore((s) => s.professionalBio);

  const [bio, setBio] = useState(profile?.bio || applicationBio || '');
  const [focused, setFocused] = useState(false);

  const handleSave = () => {
    updateProfile({ bio: bio.trim() });
    useApplicationStore.getState().setProfessionalBio(bio.trim());
    navigation.canGoBack() ? navigation.goBack() : undefined;
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      {/* Custom header */}
      <View style={s.header}>
        <TouchableOpacity accessibilityRole="button" onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
        style={s.headerBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}> {t('profile.edit_bio')} </Text>
        <TouchableOpacity accessibilityRole="button" onPress={handleSave} style={s.headerBtn}>
          <Text style={s.saveText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Info banner */}
          <View style={s.infoBanner}>
            <Icon name="emoji-events" size={16} color={colors.gold} style={{ flexShrink: 0 }} />
            <Text style={s.infoText}> {t('profile.a_great_bio_helps_you_get_3_more_bookings')} </Text>
          </View>

          {/* TextInput */}
          <View style={[s.inputWrap, focused && s.inputWrapFocused]}>
            <TextInput
              style={s.input}
              value={bio}
              onChangeText={(t) => setBio(t.slice(0, MAX_CHARS))}
              placeholder={PLACEHOLDER}
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              selectionColor={colors.gold} />
            
          </View>

          {/* Character counter */}
          <Text style={s.counter}>{bio.length}/{MAX_CHARS}</Text>

          {/* Tips */}
          <Text style={s.tipsTitle}> {t('profile.writing_tips')} </Text>
          <View style={s.tipsCard}>
            {[t("content.profile.EditBioScreen.mention_2_3_specific_interests_e_g_love"), t("content.profile.EditBioScreen.state_what_kind_of_activities_you_enjoy"), t("content.profile.EditBioScreen.keep_it_warm_and_personal_avoid_generic")].



            map((tip, i) =>
            <View key={i} style={s.tipRow}>
                <Icon name="lightbulb-outline" size={14} color={colors.gold} style={{ flexShrink: 0, marginTop: 2 }} />
                <Text style={s.tipText}>{tip}</Text>
              </View>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>);

}
export default EditBioScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  headerBtn: { minWidth: 48, alignItems: 'center' },
  headerTitle: { fontFamily: fontFamily.interBold, fontSize: 17, color: colors.textPrimary },
  saveText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  infoBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.08)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)', padding: spacing.md, marginBottom: spacing.md },
  infoText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold, flex: 1 },
  inputWrap: { backgroundColor: '#0D1525', borderRadius: radius.xl,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.08)', padding: spacing.md, marginBottom: 6 },
  inputWrapFocused: { borderColor: colors.gold },
  input: { fontFamily: fontFamily.interRegular, fontSize: 15, color: colors.textPrimary,
    lineHeight: 23, minHeight: 180 },
  counter: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted,
    textAlign: 'right', marginBottom: spacing.lg },
  tipsTitle: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  tipsCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: spacing.lg, gap: spacing.sm },
  tipRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  tipText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 19 }
});