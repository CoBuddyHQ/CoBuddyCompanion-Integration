/**
 * CancellationReviewPendingScreen (CPN-116)
 * Shown after cancellation is submitted — awaiting CoBuddy team review.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

export function CancellationReviewPendingScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <View style={s.body}>
        {/* Icon */}
        <View style={s.iconCircle}>
          <Icon name="hourglass-top" size={48} color={colors.softWarning} />
        </View>

        <Text style={s.title}> {t('sessions.cancellation_under_review')} </Text>
        <Text style={s.subtitle}>
           {t('sessions.our_team_is_reviewing_your_cancellation_request_this_usually_takes')} {' '}<Text style={s.subtitleBold}> {t('sessions.2_4_hours')} </Text>.
        </Text>

        {/* Status card */}
        <View style={s.statusCard}>
          <View style={s.statusRow}>
            <Text style={s.statusLabel}> {t('sessions.session_id')} </Text>
            <Text style={s.statusValue}>{sessionId}</Text>
          </View>
          <View style={s.statusDivider} />
          <View style={s.statusRow}>
            <Text style={s.statusLabel}> {t('sessions.submitted')} </Text>
            <Text style={s.statusValue}> {t('sessions.just_now')} </Text>
          </View>
          <View style={s.statusDivider} />
          <View style={s.statusRow}>
            <Text style={s.statusLabel}> {t('sessions.status')} </Text>
            <View style={s.pendingChip}>
              <View style={s.pendingDot} />
              <Text style={s.pendingChipText}> {t('sessions.pending_review')} </Text>
            </View>
          </View>
        </View>

        {/* Info strip */}
        <View style={s.infoStrip}>
          <Icon name="notifications-none" size={15} color={colors.textMuted} style={{ flexShrink: 0 }} />
          <Text style={s.infoText}>
             {t('sessions.you_ll_receive_a_notification_once_reviewed_no_further_action_needed')} </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={s.btnGold}
        onPress={() => navigation.navigate('MainApp', { screen: 'DashboardTab' })}
        activeOpacity={0.85} accessibilityLabel={t("accessibility.go_to_home")}>
          <Icon name="home" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnGoldText}> {t('sessions.go_to_home')} </Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" style={s.btnOutline}
        onPress={() => navigation.navigate(Routes.SUPPORT_CENTER)}
        activeOpacity={0.75} accessibilityLabel={t("accessibility.contact_support")}>
          <Text style={s.btnOutlineText}> {t('sessions.contact_support')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default CancellationReviewPendingScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },

  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,171,64,0.10)',
    borderWidth: 2, borderColor: 'rgba(255,171,64,0.30)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl
  },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 22, color: colors.softWarning,
    textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 21, marginBottom: spacing.xl },
  subtitleBold: { fontFamily: fontFamily.interBold, color: colors.softWarning },

  statusCard: { width: '100%', backgroundColor: 'rgba(255,171,64,0.07)',
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,171,64,0.22)', marginBottom: spacing.md },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  statusDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 4 },
  statusLabel: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  statusValue: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary },
  pendingChip: { flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,171,64,0.15)', borderRadius: radius.full,
    paddingHorizontal: 8, paddingVertical: 3 },
  pendingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.softWarning },
  pendingChipText: { fontFamily: fontFamily.interSemiBold, fontSize: 11, color: colors.softWarning },

  infoStrip: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    padding: spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', width: '100%' },
  infoText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, flex: 1, lineHeight: 18 },

  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', gap: spacing.sm },
  btnGold: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnGoldText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  btnOutline: { height: 46, alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)' },
  btnOutlineText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textMuted }
});