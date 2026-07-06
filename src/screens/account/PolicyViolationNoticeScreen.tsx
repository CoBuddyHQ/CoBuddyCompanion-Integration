/**
 * PolicyViolationNoticeScreen (CPN-200)
 * Takeover notice — companion must acknowledge before continuing.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

export function PolicyViolationNoticeScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();
  const [acknowledged, setAcknowledged] = useState(false);

  const handleAcknowledge = () => {
    Alert.alert(t('account.thank_you'), t('account.acknowledgement_recorded'),
    [{ text: t('account.continue'), onPress: () => navigation.canGoBack() ? navigation.goBack() : undefined }]);
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('account.important_notice')} showBack={false} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={s.heroCircle}>
          <Icon name="warning" size={60} color={colors.softWarning} />
        </View>
        <Text style={s.title}> {t('account.policy_violation_warning')} </Text>
        <Text style={s.message}>
           {t('account.we_detected')} <Text style={s.highlight}> {t('account.inappropriate_language')} </Text>  {t('account.in_a_recent_session_this_is_a_formal_warning_a_second_violation_may_result_in_account_suspension')} </Text>

        {/* Violation detail */}
        <View style={s.violationCard}>
          <View style={s.violationRow}>
            <Icon name="report-problem" size={15} color={colors.softWarning} />
            <Text style={s.violationLabel}> {t('account.violation_type')} </Text>
            <Text style={s.violationValue}> {t('account.inappropriate_language_1')} </Text>
          </View>
          <View style={s.sep} />
          <View style={s.violationRow}>
            <Icon name="event" size={15} color={colors.textMuted} />
            <Text style={s.violationLabel}> {t('account.session_date')} </Text>
            <Text style={s.violationValue}> {t('account.28_jun_2026')} </Text>
          </View>
          <View style={s.sep} />
          <View style={s.violationRow}>
            <Icon name="gavel" size={15} color={colors.textMuted} />
            <Text style={s.violationLabel}> {t('account.warning_count')} </Text>
            <Text style={[s.violationValue, { color: colors.softWarning }]}> {t('account.1_of_2')} </Text>
          </View>
        </View>

        {/* Guidelines strip */}
        <View style={s.guideCard}>
          <Icon name="menu-book" size={15} color={colors.gold} style={{ flexShrink: 0 }} />
          <Text style={s.guideText}>
             {t('account.please_review_our')} {' '}
            <Text style={s.guideLink}> {t('account.community_guidelines_3_1')} </Text>
            {' '} {t('account.for_acceptable_language_and_conduct_during_sessions')} </Text>
        </View>

        {/* Acknowledgement checkbox row */}
        <TouchableOpacity style={s.checkRow} onPress={() => setAcknowledged((a) => !a)} activeOpacity={0.75}>
          <View style={[s.checkbox, acknowledged && s.checkboxChecked]}>
            {acknowledged && <Icon name="check" size={14} color={colors.rootBg} />}
          </View>
          <Text style={s.checkLabel}>
             {t('account.i_have_read_and_understood_this_notice_i_acknowledge_the_violation_and_promise_to_comply_with_cobuddy_s_community_guidelines_going_forward')} </Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.ackBtn, !acknowledged && s.ackBtnDisabled]}
          onPress={handleAcknowledge}
          disabled={!acknowledged}
          activeOpacity={0.85}>
          <Icon name="check-circle" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.ackBtnText}> {t('account.acknowledge')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default PolicyViolationNoticeScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  content: { alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  heroCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(245,166,35,0.10)', borderWidth: 1.5, borderColor: 'rgba(245,166,35,0.30)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 24, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  message: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  highlight: { fontFamily: fontFamily.interBold, color: colors.softWarning },
  violationCard: { width: '100%', backgroundColor: colors.cardSurface, borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', padding: spacing.lg, marginBottom: spacing.md },
  violationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  violationLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, flex: 1 },
  violationValue: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  guideCard: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.lg, borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)', padding: spacing.md, marginBottom: spacing.lg },
  guideText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 19 },
  guideLink: { fontFamily: fontFamily.interBold, color: colors.gold },
  checkRow: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, backgroundColor: colors.cardSurface, borderRadius: radius.xl, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.10)', padding: spacing.lg },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.elevatedSurface, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  checkboxChecked: { backgroundColor: colors.safetyGreen, borderColor: colors.safetyGreen },
  checkLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 20 },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  ackBtn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.gold, borderRadius: radius.md },
  ackBtnDisabled: { opacity: 0.38 },
  ackBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});