import { useTranslation } from 'react-i18next';
/**
 * BookingRequestEmptyStateScreen (CPN-090)
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';

export function BookingRequestEmptyStateScreen(): React.JSX.Element {const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t("application.booking_requests")} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <View style={s.body}>
        {/* Hero */}
        <View style={s.iconCircle}>
          <Icon name="inbox" size={56} color={colors.textMuted} />
        </View>

        <Text style={s.title}>{t("application.no_pending_requests")}</Text>
        <Text style={s.desc}>{t("application.you_have_caught_up_on_all_your_booking_r")}

        </Text>

        {/* Suggestions */}
        <View style={s.suggestCard}>
          <Text style={s.suggestTitle}>{t("application.while_you_wait")}</Text>
          {[
          { icon: 'wifi-tethering', label: t("content.requests.BookingRequestEmptyStateScreen.go_live_for_instant_bookings"), color: colors.safetyGreen },
          { icon: 'event-available', label: t("content.requests.BookingRequestEmptyStateScreen.update_your_availability_calendar"), color: colors.gold },
          { icon: 'star-rate', label: t("content.requests.BookingRequestEmptyStateScreen.check_your_reviews_and_ratings"), color: colors.gold }].
          map((row) =>
          <View key={t(row.label)} style={s.suggestRow}>
              <Icon name={row.icon as any} size={16} color={row.color} />
              <Text style={s.suggestText}>{t(row.label)}</Text>
            </View>
          )}
        </View>

        {/* Primary CTA */}
        <TouchableOpacity accessibilityRole="button" style={s.liveBtn} activeOpacity={0.85}
        onPress={() => navigation.navigate(Routes.LIVE_AVAILABILITY_TOGGLE)}>
          <Icon name="wifi-tethering" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.liveBtnText}>{t("application.go_live_for_instant_bookings")}</Text>
        </TouchableOpacity>

        {/* Secondary */}
        <TouchableOpacity accessibilityRole="button" style={s.calBtn} activeOpacity={0.8}
        onPress={() => navigation.navigate(Routes.AVAILABILITY_CALENDAR)}>
          <Icon name="event" size={16} color={colors.gold} style={{ marginRight: 8 }} />
          <Text style={s.calBtnText}>{t("application.manage_availability")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default BookingRequestEmptyStateScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, alignItems: 'center' },
  iconCircle: { width: 104, height: 104, borderRadius: 52,
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 24, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  desc: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 21, marginBottom: spacing.xl },
  suggestCard: { width: '100%', backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', padding: spacing.lg, marginBottom: spacing.lg },
  suggestTitle: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textSecondary, marginBottom: spacing.md },
  suggestRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 6 },
  suggestText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  liveBtn: { width: '100%', height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.safetyGreen, borderRadius: radius.md, marginBottom: spacing.sm },
  liveBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  calBtn: { width: '100%', height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.40)',
    backgroundColor: 'rgba(214,168,79,0.06)' },
  calBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold }
});