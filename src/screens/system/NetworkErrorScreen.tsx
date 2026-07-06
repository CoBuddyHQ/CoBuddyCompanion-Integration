/**
 * NetworkErrorScreen (CPN-204)
 * Full-screen takeover — shown when the device loses connectivity.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

export function NetworkErrorScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const [retrying, setRetrying] = useState(false);
  const spinValue = React.useRef(new Animated.Value(0)).current;

  const handleRetry = () => {
    setRetrying(true);
    Animated.loop(
      Animated.timing(spinValue, { toValue: 1, duration: 900, useNativeDriver: true })
    ).start();
    setTimeout(() => {
      setRetrying(false);
      spinValue.stopAnimation();
      Alert.alert(t("alerts.still_offline"), t("alerts.could_not_reach_cobuddy_servers_please_c"), [{ text: t("alerts.ok") }]);
    }, 2000);
  };

  const rotate = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <View style={s.body}>

        {/* Hero */}
        <View style={s.heroCircle}>
          <Icon name="wifi-off" size={64} color={colors.softWarning} />
        </View>
        <Text style={s.title}> {t('system.connection_lost')} </Text>
        <Text style={s.message}>
           {t('system.please_check_your_internet_connection_and_try_again_cobuddy_needs_an_active_connection_to_function')} </Text>

        {/* Status chips */}
        <View style={s.chipsRow}>
          {[
          { icon: 'cloud-off', label: t("content.system.NetworkErrorScreen.server_unreachable") },
          { icon: 'signal-wifi-off', label: t("content.system.NetworkErrorScreen.no_internet") }].
          map((chip) =>
          <View key={t(chip.label)} style={s.chip}>
              <Icon name={chip.icon as any} size={14} color={colors.softWarning} />
              <Text style={s.chipText}>{t(chip.label)}</Text>
            </View>
          )}
        </View>

        {/* Tip */}
        <View style={s.tipCard}>
          <Icon name="tips-and-updates" size={14} color={colors.gold} style={{ flexShrink: 0 }} />
          <Text style={s.tipText}>
             {t('system.try_toggling_airplane_mode_switching_between_wi_fi_and_mobile_data_or_restarting_the_app')} </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity style={[s.retryBtn, retrying && s.retryBtnLoading]}
        onPress={handleRetry} disabled={retrying} activeOpacity={0.85}>
          {retrying ?
          <Animated.View style={{ transform: [{ rotate }], marginRight: 8 }}>
              <Icon name="refresh" size={18} color={colors.rootBg} />
            </Animated.View> :

          <Icon name="refresh" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          }
          <Text style={s.retryBtnText}>{retrying ? t("content.system.NetworkErrorScreen.checking") : t("content.system.NetworkErrorScreen.retry_connection")}</Text>
        </TouchableOpacity>

        <Text style={s.footerNote}> {t('system.if_the_problem_persists_contact_support_cobuddy_in')} </Text>
      </View>
    </SafeAreaView>);

}
export default NetworkErrorScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  heroCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(245,166,35,0.10)', borderWidth: 1.5, borderColor: 'rgba(245,166,35,0.30)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 28, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  message: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  chipsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md, flexWrap: 'wrap', justifyContent: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(245,166,35,0.08)', borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(245,166,35,0.22)', paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.softWarning },
  tipCard: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.lg, borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)', padding: spacing.md, marginBottom: spacing.xl },
  tipText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 19 },
  retryBtn: { width: '100%', height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.gold, borderRadius: radius.md, marginBottom: spacing.md },
  retryBtnLoading: { opacity: 0.75 },
  retryBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  footerNote: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, textAlign: 'center' }
});