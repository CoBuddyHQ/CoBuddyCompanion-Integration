/**
 * ForceUpdateScreen (CPN-206)
 * Full-screen takeover — shown when app version is below minimum required.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

const NEW_FEATURES = [
{ icon: 'bar-chart', text: 'New Earnings Dashboard with detailed analytics' },
{ icon: 'bolt', text: 'Faster booking requests — 2× faster response' },
{ icon: 'shield', text: 'Enhanced Trust & Safety for companions' },
{ icon: 'build-circle', text: 'Bug fixes & performance improvements' }];


export function ForceUpdateScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <View style={s.body}>

        {/* Hero */}
        <View style={s.heroCircle}>
          <Icon name="system-update" size={64} color={colors.safetyGreen} />
        </View>

        {/* Version badge */}
        <View style={s.versionRow}>
          <View style={s.versionChip}>
            <Text style={s.versionOld}> {t('system.v2_4_1')} </Text>
          </View>
          <Icon name="arrow-forward" size={16} color={colors.textMuted} />
          <View style={[s.versionChip, s.versionChipNew]}>
            <Text style={s.versionNew}> {t('system.v2_5_0')} </Text>
          </View>
        </View>

        <Text style={s.title}> {t('system.update_required')} </Text>
        <Text style={s.message}>
           {t('system.a_new_version_of_cobuddy_companion_is_available_please_update_to_continue_accepting_bookings_and_accessing_new_features')} </Text>

        {/* What's new */}
        <View style={s.featuresCard}>
          <View style={s.featuresHeader}>
            <Icon name="auto-awesome" size={15} color={colors.gold} />
            <Text style={s.featuresTitle}> {t('system.what_s_new_in_v2_5_0')} </Text>
          </View>
          {NEW_FEATURES.map((feat) =>
          <View key={t(feat.text)} style={s.featureRow}>
              <View style={s.featureIconWrap}>
                <Icon name={feat.icon as any} size={14} color={colors.safetyGreen} />
              </View>
              <Text style={s.featureText}>{t(feat.text)}</Text>
            </View>
          )}
        </View>

        {/* CTA */}
        <TouchableOpacity style={s.updateBtn} activeOpacity={0.85}
        onPress={() => Alert.alert(t("alerts.redirecting"), t("alerts.opening_app_store_google_play_store_to_u"))}>
          <Icon name="system-update" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.updateBtnText}> {t('system.update_now')} </Text>
        </TouchableOpacity>

        <Text style={s.footerNote}>
           {t('system.update_size_18_mb_free_no_data_will_be_lost')} </Text>
      </View>
    </SafeAreaView>);

}
export default ForceUpdateScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  heroCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(109,214,165,0.10)', borderWidth: 1.5, borderColor: 'rgba(109,214,165,0.28)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  versionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  versionChip: { backgroundColor: colors.elevatedSurface, borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 12, paddingVertical: 4 },
  versionChipNew: { backgroundColor: 'rgba(109,214,165,0.10)', borderColor: 'rgba(109,214,165,0.30)' },
  versionOld: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textMuted },
  versionNew: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.safetyGreen },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 26, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  message: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  featuresCard: { width: '100%', backgroundColor: colors.cardSurface, borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', padding: spacing.lg, marginBottom: spacing.xl },
  featuresHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md },
  featuresTitle: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.gold },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, paddingVertical: 5 },
  featureIconWrap: { width: 28, height: 28, borderRadius: radius.sm, backgroundColor: 'rgba(109,214,165,0.10)', borderWidth: 1, borderColor: 'rgba(109,214,165,0.22)', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  featureText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 19 },
  updateBtn: { width: '100%', height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.gold, borderRadius: radius.md, marginBottom: spacing.sm },
  updateBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  footerNote: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, textAlign: 'center' }
});