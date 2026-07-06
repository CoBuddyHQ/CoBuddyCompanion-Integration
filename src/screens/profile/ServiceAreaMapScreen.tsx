/**
 * ServiceAreaMapScreen (CPN-186)
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

export function ServiceAreaMapScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#1A2D45" />

      {/* Header overlays the map */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
        style={s.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Icon name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.hTitle}> {t('profile.service_map')} </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Map mockup */}
      <View style={s.mapArea}>
        {/* Grid lines simulating a map */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
        <View key={`h${i}`} style={[s.gridLineH, { top: `${i * 14 + 2}%` as any }]} />
        )}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
        <View key={`v${i}`} style={[s.gridLineV, { left: `${i * 14 + 2}%` as any }]} />
        )}

        {/* Coverage circle */}
        <View style={s.coverageRing2} />
        <View style={s.coverageRing1} />
        <View style={s.coverageCircle} />

        {/* Center pin */}
        <View style={s.pinWrap}>
          <Icon name="location-on" size={52} color="#E74C3C" />
          <View style={s.pinShadow} />
        </View>

        {/* Area labels */}
        {[
        { label: t("content.profile.ServiceAreaMapScreen.bandra"), top: '22%', left: '55%' },
        { label: t("content.profile.ServiceAreaMapScreen.andheri"), top: '18%', left: '28%' },
        { label: t("content.profile.ServiceAreaMapScreen.juhu"), top: '35%', left: '20%' },
        { label: t("content.profile.ServiceAreaMapScreen.powai"), top: '30%', left: '70%' },
        { label: t("content.profile.ServiceAreaMapScreen.colaba"), top: '68%', left: '52%' }].
        map(({ label, top, left }) =>
        <View key={label} style={[s.areaLabel, { top: top as any, left: left as any }]}>
            <Text style={s.areaLabelText}>{label}</Text>
          </View>
        )}
      </View>

      {/* Bottom card */}
      <View style={s.bottomCard}>
        <View style={s.radiusRow}>
          <View style={s.radiusIconWrap}>
            <Icon name="radio-button-checked" size={20} color={colors.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.radiusLabel}> {t('profile.current_coverage_radius')} </Text>
            <Text style={s.radiusValue}> {t('profile.10_km')} </Text>
          </View>
          <View style={s.areasBadge}>
            <Text style={s.areasBadgeText}> {t('profile.3_areas')} </Text>
          </View>
        </View>

        <TouchableOpacity style={s.adjustBtn}
        onPress={() => navigation.navigate(Routes.TRAVEL_RADIUS_PREFERENCE)}
        activeOpacity={0.85}>
          <Icon name="tune" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.adjustBtnText}> {t('profile.adjust_radius')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default ServiceAreaMapScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A2D45' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    position: 'absolute', top: 44, left: 0, right: 0, zIndex: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.40)', alignItems: 'center', justifyContent: 'center' },
  hTitle: { fontFamily: fontFamily.interBold, fontSize: 17, color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  mapArea: { flex: 1, backgroundColor: '#1E3050', position: 'relative',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  gridLineH: { position: 'absolute', left: 0, right: 0, height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)' },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)' },
  coverageRing2: { position: 'absolute', width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(214,168,79,0.04)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.12)' },
  coverageRing1: { position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(214,168,79,0.07)',
    borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.20)' },
  coverageCircle: { position: 'absolute', width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(214,168,79,0.14)',
    borderWidth: 2, borderColor: 'rgba(214,168,79,0.35)' },
  pinWrap: { alignItems: 'center', zIndex: 5 },
  pinShadow: { width: 20, height: 6, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.30)', marginTop: -8 },
  areaLabel: { position: 'absolute', backgroundColor: 'rgba(10,18,32,0.65)',
    borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  areaLabelText: { fontFamily: fontFamily.interSemiBold, fontSize: 11, color: '#fff' },
  bottomCard: { backgroundColor: colors.cardSurface,
    borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl,
    borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md },
  radiusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  radiusIconWrap: { width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(214,168,79,0.12)', borderWidth: 1,
    borderColor: 'rgba(214,168,79,0.25)', alignItems: 'center', justifyContent: 'center' },
  radiusLabel: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginBottom: 2 },
  radiusValue: { fontFamily: fontFamily.playfairBold, fontSize: 22, color: colors.gold },
  areasBadge: { backgroundColor: 'rgba(109,214,165,0.12)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)', paddingHorizontal: 10, paddingVertical: 4 },
  areasBadgeText: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.safetyGreen },
  adjustBtn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  adjustBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});