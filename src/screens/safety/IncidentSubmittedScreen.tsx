/**
 * IncidentSubmittedScreen (CPN-136)
 * Confirmation screen after an incident/report is submitted.
 * gestureEnabled: false — no back swipe.
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

const NEXT_STEPS = [
{ icon: 'schedule', text: 'Safety team reviews within 24 hours' },
{ icon: 'phone', text: 'We may contact you for details' },
{ icon: 'gavel', text: 'Action taken against violations' }];


export function IncidentSubmittedScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const handleGoHome = () => {
    navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <View style={s.body}>
        {/* Hero icon */}
        <View style={s.heroWrap}>
          <Icon name="verified-user" size={64} color={colors.safetyGreen} />
        </View>

        {/* Heading */}
        <Text style={s.title}> {t('safety.report_submitted')} </Text>
        <Text style={s.subtitle}> {t('safety.thank_you_for_helping_keep_cobuddy_safe')} </Text>

        {/* Reference card */}
        <View style={s.refCard}>
          <Icon name="confirmation-number" size={16} color={colors.textMuted} />
          <Text style={s.refText}> {t('safety.report_id')} </Text>
          <Text style={s.refId}> {t('safety.rpt_2024_001')} </Text>
        </View>

        {/* What happens next */}
        <Text style={s.sectionLabel}> {t('safety.what_happens_next')} </Text>
        <View style={s.stepsCard}>
          {NEXT_STEPS.map((step, i) =>
          <View key={t(step.text)}>
              <View style={s.stepRow}>
                <View style={s.stepNum}>
                  <Text style={s.stepNumText}>{i + 1}</Text>
                </View>
                <Icon name={step.icon as any} size={18} color={colors.textMuted} />
                <Text style={s.stepText}>{t(step.text)}</Text>
              </View>
              {i < NEXT_STEPS.length - 1 && <View style={s.divider} />}
            </View>
          )}
        </View>

        {/* Support link */}
        <TouchableOpacity style={s.supportRow}
        onPress={() => navigation.navigate(Routes.SUPPORT_CENTER)}
        activeOpacity={0.7}>
          <Icon name="headset-mic" size={16} color={colors.gold} />
          <Text style={s.supportText}> {t('safety.need_immediate_help')} </Text>
          <Icon name="chevron-right" size={16} color={colors.gold} />
        </TouchableOpacity>
      </View>

      {/* Return home */}
      <View style={s.bar}>
        <TouchableOpacity style={s.btnHome} onPress={handleGoHome} activeOpacity={0.85}>
          <Icon name="home" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnHomeText}> {t('safety.return_to_home')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default IncidentSubmittedScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, alignItems: 'center' },
  heroWrap: { width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(109,214,165,0.10)',
    borderWidth: 2, borderColor: 'rgba(109,214,165,0.25)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 28, color: colors.gold,
    marginBottom: spacing.sm, textAlign: 'center' },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 21, marginBottom: spacing.lg },
  refCard: { flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, marginBottom: spacing.xl },
  refText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  refId: { fontFamily: 'Courier New', fontSize: 13, color: colors.gold, fontWeight: '700' },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm, alignSelf: 'flex-start' },
  stepsCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md, width: '100%', marginBottom: spacing.lg },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(214,168,79,0.15)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.30)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNumText: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.gold },
  stepText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 19 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 2 },
  supportRow: { flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md, width: '100%' },
  supportText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold, flex: 1 },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btnHome: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnHomeText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});