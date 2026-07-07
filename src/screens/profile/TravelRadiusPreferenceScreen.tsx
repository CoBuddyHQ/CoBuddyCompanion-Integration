import i18next from "i18next"; /**
* TravelRadiusPreferenceScreen (CPN-185)
*/
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

// Note: travelRadius is not currently in CompanionProfile type.
// Save is a no-op until backend / store type is extended.

const QUICK = [{ label: "content.profile.TravelRadiusPreferenceScreen.quick.0.label", v: "content.profile.TravelRadiusPreferenceScreen.quick.0.v" }, { label: "content.profile.TravelRadiusPreferenceScreen.quick.1.label", v: "content.profile.TravelRadiusPreferenceScreen.quick.1.v" }, { label: "content.profile.TravelRadiusPreferenceScreen.quick.2.label", v: "content.profile.TravelRadiusPreferenceScreen.quick.2.v" }] as any[];

export function TravelRadiusPreferenceScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [km, setKm] = useState(10);

  // travelRadius not yet in CompanionProfile type — API-ready stub
  const handleSave = () => {
    // TODO: updateProfile({travelRadius: km}) once type is extended
    navigation.canGoBack() ? navigation.goBack() : undefined;
  };

  const pct = (km - 1) / 24;
  const boost = km >= 20 ? '40%' : km >= 10 ? '20%' : '10%';

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <View style={s.header}>
        <TouchableOpacity accessibilityRole="button" onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
        style={s.hBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.hTitle}> {t('profile.travel_radius')} </Text>
        <TouchableOpacity accessibilityRole="button" onPress={handleSave} style={s.hBtn}>
          <Text style={s.saveText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      <View style={s.content}>
        {/* Info banner */}
        <View style={s.banner}>
          <Icon name="info-outline" size={16} color={colors.gold} style={{ flexShrink: 0 }} />
          <Text style={s.bannerText}>
             {t('profile.a_larger_radius_means')} {' '}
            <Text style={s.bannerBold}>{boost}  {t('profile.more_bookings')} </Text>
            {', '} {t('profile.but_requires_more_travel_time')} </Text>
        </View>

        {/* Big km display */}
        <View style={s.kmWrap}>
          <Text style={s.kmVal}>{km}</Text>
          <Text style={s.kmUnit}> {t('profile.km')} </Text>
        </View>
        <Text style={s.kmSub}> {t('profile.from_your_home_location')} </Text>

        {/* Visual slider (touch the track to move) */}
        <View style={s.sliderContainer}>
          <View style={s.track}>
            <View style={[s.fill, { width: `${pct * 100}%` }]} />
          </View>
          <View style={[s.thumb, { left: `${pct * 100}%` as any, marginLeft: -14 }]}>
            <View style={s.thumbCore} />
          </View>
          <View style={s.trackLabels}>
            <Text style={s.trackEdge}> {t('profile.1_km')} </Text>
            <Text style={s.trackEdge}> {t('profile.25_km')} </Text>
          </View>
        </View>

        {/* Quick-select pills */}
        <View style={s.pills}>
          {QUICK.map((o) =>
          <TouchableOpacity accessibilityRole="button" key={o.v} style={[s.pill, km === o.v && s.pillOn]}
          onPress={() => setKm(o.v)} activeOpacity={0.75}>
              <Text style={[s.pillTxt, km === o.v && s.pillTxtOn]}>{t(o.label)}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats card */}
        <View style={s.card}>
          {[
          { icon: 'directions-walk', label: t("content.profile.TravelRadiusPreferenceScreen.approx_travel_time"), value: `~${Math.round(km * 4)} mins` },
          { icon: 'people', label: t("content.profile.TravelRadiusPreferenceScreen.customers_who_see_you"), value: `${km * 12}+ nearby` }].
          map((r) =>
          <View key={t(r.label)} style={s.cardRow}>
              <View style={s.cardIcon}>
                <Icon name={r.icon as any} size={16} color={colors.gold} />
              </View>
              <Text style={s.cardLabel}>{t(r.label)}</Text>
              <Text style={s.cardVal}>{r.value}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>);

}
export default TravelRadiusPreferenceScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  hBtn: { minWidth: 48, alignItems: 'center' },
  hTitle: { fontFamily: fontFamily.interBold, fontSize: 17, color: colors.textPrimary },
  saveText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  banner: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.08)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)', padding: spacing.md, marginBottom: spacing.xl },
  bannerText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 20 },
  bannerBold: { fontFamily: fontFamily.interBold, color: colors.gold },
  kmWrap: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 4 },
  kmVal: { fontFamily: fontFamily.playfairBold, fontSize: 80, color: colors.gold, lineHeight: 88 },
  kmUnit: { fontFamily: fontFamily.interBold, fontSize: 24, color: colors.textMuted, paddingBottom: 14, marginLeft: 8 },
  kmSub: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted,
    textAlign: 'center', marginBottom: spacing.xl },
  sliderContainer: { height: 56, justifyContent: 'center', marginBottom: spacing.sm, position: 'relative' },
  track: { height: 6, backgroundColor: colors.elevatedSurface, borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: colors.gold, borderRadius: 3 },
  thumb: { position: 'absolute', top: 14, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.gold, shadowOpacity: 0.5, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
  thumbCore: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.rootBg },
  trackLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  trackEdge: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },
  pills: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.xl },
  pill: { flex: 1, alignItems: 'center', paddingVertical: 10,
    backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  pillOn: { backgroundColor: 'rgba(214,168,79,0.12)', borderColor: colors.gold },
  pillTxt: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  pillTxtOn: { color: colors.gold },
  card: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: spacing.md, gap: spacing.sm },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(214,168,79,0.10)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1 },
  cardVal: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textPrimary }
});