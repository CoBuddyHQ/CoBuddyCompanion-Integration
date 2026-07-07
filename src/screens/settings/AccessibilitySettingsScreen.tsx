/**
 * AccessibilitySettingsScreen (CPN-146)
 * textSize & highContrast persist to uiStore.
 * Preview card reads real companion data from useProfileStore.
 */
import React from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useUIStore, TextSize } from '../../store/slices/uiStore';
import { useProfileStore } from '../../store/slices/profileStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

const FONT_MAP: Record<TextSize, number> = { Small: 12, Default: 15, Large: 19 };

export function AccessibilitySettingsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  // UI preferences from uiStore
  const textSize = useUIStore((s) => s.textSize);
  const highContrast = useUIStore((s) => s.highContrast);
  const setTextSize = useUIStore((s) => s.setTextSize);
  const setHighContrast = useUIStore((s) => s.setHighContrast);

  // Real companion data for preview card
  const profile = useProfileStore((s) => s.profile);
  const previewName = profile?.displayName ?? 'Companion';
  const previewRating = profile?.rating ?? 0;
  const previewSessions = profile?.totalSessions ?? 0;
  const previewReviews = profile?.totalReviews ?? 0;

  const previewFontSize = FONT_MAP[textSize];

  const handleSave = () => {
    // textSize and highContrast already persisted via setters on each interaction
    navigation.canGoBack() ? navigation.goBack() : undefined;
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <View style={s.header}>
        <TouchableOpacity accessibilityRole="button" onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
        style={s.hBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.hTitle}> {t('settings.accessibility')} </Text>
        <TouchableOpacity accessibilityRole="button" onPress={handleSave} style={s.hBtn}>
          <Text style={s.saveText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Text Size */}
        <Text style={s.sectionLabel}> {t('settings.text_size')} </Text>
        <View style={s.pillsRow}>
          {(['Small', 'Default', 'Large'] as TextSize[]).map((size) =>
          <TouchableOpacity accessibilityRole="button" key={size} style={[s.pill, textSize === size && s.pillActive]}
          onPress={() => setTextSize(size)} activeOpacity={0.75}>
              <Text style={[s.pillText, textSize === size && s.pillTextActive]}>{size}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Preview card — uses real profile data */}
        <View style={s.previewCard}>
          <Text style={s.previewLabel}> {t('settings.preview')} </Text>
          <Text style={[s.previewHeading, { fontSize: previewFontSize + 4 }]}>{previewName}</Text>
          <Text style={[s.previewBody, { fontSize: previewFontSize }]}>
            {profile?.city ?? 'Your City'}  {t('settings.cobuddy_companion')} </Text>
          <Text style={[s.previewMuted, { fontSize: previewFontSize - 2 }]}>
            {previewRating.toFixed(1)}{t("content.settings.AccessibilitySettingsScreen.text")}{previewReviews}  {t('settings.reviews')} {previewSessions}  {t('settings.sessions')} </Text>
        </View>

        {/* Contrast */}
        <Text style={[s.sectionLabel, { marginTop: spacing.lg }]}> {t('settings.contrast')} </Text>
        <View style={s.card}>
          <View style={s.row}>
            <View style={s.rowText}>
              <Text style={s.rowLabel}> {t('settings.high_contrast_mode')} </Text>
              <Text style={s.rowSub}> {t('settings.increases_text_contrast_for_better_readability')} </Text>
            </View>
            <Switch value={highContrast} onValueChange={setHighContrast}
            trackColor={{ false: colors.elevatedSurface, true: 'rgba(214,168,79,0.45)' }}
            thumbColor={highContrast ? colors.gold : colors.textMuted} />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default AccessibilitySettingsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  hBtn: { minWidth: 48, alignItems: 'center' },
  hTitle: { fontFamily: fontFamily.interBold, fontSize: 17, color: colors.textPrimary },
  saveText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  pillsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  pill: { flex: 1, alignItems: 'center', paddingVertical: 11,
    backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  pillActive: { backgroundColor: 'rgba(214,168,79,0.12)', borderColor: colors.gold },
  pillText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textSecondary },
  pillTextActive: { color: colors.gold },
  previewCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: spacing.lg, gap: 6 },
  previewLabel: { fontFamily: fontFamily.interBold, fontSize: 10, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.6 },
  previewHeading: { fontFamily: fontFamily.interBold, color: colors.textPrimary },
  previewBody: { fontFamily: fontFamily.interRegular, color: colors.textSecondary },
  previewMuted: { fontFamily: fontFamily.interRegular, color: colors.textMuted },
  card: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  rowText: { flex: 1 },
  rowLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary, marginBottom: 2 },
  rowSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, lineHeight: 17 }
});