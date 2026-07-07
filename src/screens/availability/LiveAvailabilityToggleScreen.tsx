import i18next from "i18next"; /**
* LiveAvailabilityToggleScreen (CPN-077)
* isLive is now sourced from useAvailabilityStore — synced with
* AvailabilityCalendarScreen's status bar.
*/
import React from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useAvailabilityStore } from '../../store/slices/availabilityStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

const RADIUS_OPTIONS = ["5 km", "10 km", "20 km"] as any[];

export function LiveAvailabilityToggleScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const isLive = useAvailabilityStore((s) => s.isAvailable);
  const setLiveAvailable = useAvailabilityStore((s) => s.setLiveAvailable);

  // liveRadius is UI-only preference (no backend yet) — local state acceptable
  const [liveRadius, setLiveRadius] = React.useState('5 km');

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('availability.go_live_now')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Hero toggle block */}
        <View style={[s.heroCard, isLive && s.heroCardLive]}>
          {/* Big status icon */}
          <View style={[s.heroIconCircle, isLive && s.heroIconCircleLive]}>
            <Icon name={isLive ? 'wifi-tethering' : 'wifi-tethering-off'} size={48}
            color={isLive ? colors.safetyGreen : colors.textMuted} />
          </View>
          <Text style={[s.heroStatus, isLive && s.heroStatusLive]}>
             {t('availability.currently')} {isLive ? t("content.availability.LiveAvailabilityToggleScreen.live") : t("content.availability.LiveAvailabilityToggleScreen.offline")}
          </Text>
          <Text style={s.heroSub}>
            {isLive ? t("content.availability.LiveAvailabilityToggleScreen.you_are_visible_on_the_live_map_customer") : t("content.availability.LiveAvailabilityToggleScreen.toggle_on_to_appear_on_the_live_map_for")

            }
          </Text>

          {/* Big switch — writes to store */}
          <Switch
            value={isLive}
            onValueChange={setLiveAvailable}
            trackColor={{ false: colors.elevatedSurface, true: 'rgba(109,214,165,0.40)' }}
            thumbColor={isLive ? colors.safetyGreen : colors.border}
            style={s.bigSwitch} />
          
        </View>

        {/* Info banner */}
        <View style={s.infoBanner}>
          <Icon name="info-outline" size={16} color={colors.gold} style={{ flexShrink: 0 }} />
          <Text style={s.infoText}>
             {t('availability.turn_this_on_to_appear_on_the_live_map_customers_within')} {' '}
            <Text style={s.infoHighlight}>{liveRadius}</Text>
            {' '} {t('availability.can_book_you_instantly')} </Text>
        </View>

        {/* Settings card */}
        <Text style={s.sectionLabel}> {t('availability.settings')} </Text>
        <View style={[s.settingsCard, !isLive && s.settingsCardDisabled]}>
          <Text style={s.settingTitle}> {t('availability.live_radius')} </Text>
          <Text style={s.settingSub}> {t('availability.how_far_away_customers_can_see_you')} </Text>
          <View style={s.radiusPills}>
            {RADIUS_OPTIONS.map((r) =>
            <TouchableOpacity accessibilityRole="button"
              key={r}
              disabled={!isLive}
              style={[s.radiusPill, liveRadius === r && s.radiusPillActive, !isLive && s.radiusPillDisabled]}
              onPress={() => setLiveRadius(r)}
              activeOpacity={0.75}>
                <Text style={[s.radiusPillText, liveRadius === r && s.radiusPillTextActive, !isLive && s.radiusPillTextDisabled]}>
                  {r}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Stats when live */}
        {isLive &&
        <View style={s.statsRow}>
            {[
          { icon: 'people', label: t("content.availability.LiveAvailabilityToggleScreen.nearby_customers"), value: '—' },
          { icon: 'flash-on', label: t("content.availability.LiveAvailabilityToggleScreen.avg_response"), value: '—' }].
          map((st) =>
          <View key={t(st.label)} style={s.statCard}>
                <Icon name={st.icon as any} size={18} color={colors.gold} />
                <Text style={s.statValue}>{st.value}</Text>
                <Text style={s.statLabel}>{t(st.label)}</Text>
              </View>
          )}
          </View>
        }

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default LiveAvailabilityToggleScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  heroCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
    padding: spacing.xl, alignItems: 'center', marginBottom: spacing.md },
  heroCardLive: { borderColor: 'rgba(109,214,165,0.35)', backgroundColor: 'rgba(109,214,165,0.04)' },
  heroIconCircle: { width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  heroIconCircleLive: { backgroundColor: 'rgba(109,214,165,0.10)', borderColor: 'rgba(109,214,165,0.35)' },
  heroStatus: { fontFamily: fontFamily.playfairBold, fontSize: 24, color: colors.textMuted, marginBottom: spacing.sm },
  heroStatusLive: { color: colors.safetyGreen },
  heroSub: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted,
    textAlign: 'center', lineHeight: 19, marginBottom: spacing.lg },
  bigSwitch: { transform: [{ scaleX: 1.6 }, { scaleY: 1.6 }] },
  infoBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.08)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    padding: spacing.md, marginBottom: spacing.md },
  infoText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    flex: 1, lineHeight: 19 },
  infoHighlight: { fontFamily: fontFamily.interBold, color: colors.gold },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  settingsCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.lg, marginBottom: spacing.md },
  settingsCardDisabled: { opacity: 0.45 },
  settingTitle: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary, marginBottom: 3 },
  settingSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginBottom: spacing.md },
  radiusPills: { flexDirection: 'row', gap: spacing.sm },
  radiusPill: { flex: 1, alignItems: 'center', paddingVertical: 10,
    borderRadius: radius.full, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: colors.elevatedSurface },
  radiusPillActive: { borderColor: colors.safetyGreen, backgroundColor: 'rgba(109,214,165,0.10)' },
  radiusPillDisabled: { opacity: 0.5 },
  radiusPillText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textMuted },
  radiusPillTextActive: { color: colors.safetyGreen },
  radiusPillTextDisabled: { color: colors.textMuted },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statCard: { flex: 1, alignItems: 'center', gap: 5, backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(109,214,165,0.18)', padding: spacing.md },
  statValue: { fontFamily: fontFamily.playfairBold, fontSize: 20, color: colors.textPrimary },
  statLabel: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, textAlign: 'center' }
});