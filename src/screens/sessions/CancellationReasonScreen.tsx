/**
 * CancellationReasonScreen (CPN-115)
 * Additional details + impact summary before final cancellation submission.
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useSessionStore } from '../../store/slices/sessionStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

const NEXT_STEPS = [
{ icon: 'notifications', text: 'Customer will be notified immediately' },
{ icon: 'account-balance-wallet', text: '₹200 penalty deducted from next payout' },
{ icon: 'bar-chart', text: 'Your cancellation rate will be updated' }];


export function CancellationReasonScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';
  const reason: string = route.params?.reason ?? 'Not specified';
  const updateSessionStatus = useSessionStore((s) => s.updateSessionStatus);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (submitting) {return;}
    setSubmitting(true);
    setTimeout(() => {
      if (sessionId) {updateSessionStatus(sessionId, 'cancelled');}
      navigation.replace(Routes.CANCELLATION_REVIEW_PENDING, { sessionId });
    }, 900);
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('sessions.cancellation_details')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      <ScrollView style={s.scroll} contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Selected reason display */}
        <View style={s.reasonCard}>
          <Text style={s.reasonCardLabel}> {t('sessions.selected_reason')} </Text>
          <Text style={s.reasonCardValue}>{reason}</Text>
        </View>

        {/* Additional details */}
        <Text style={s.sectionTitle}> {t('sessions.additional_details_optional')} </Text>
        <TextInput
          style={s.detailsInput}
          value={details}
          onChangeText={setDetails}
          placeholder={t('sessions.please_add_any_additional_details_that_may_help_our_team')}
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={500}
          selectionColor={colors.gold}
          textAlignVertical="top" />
        

        {/* What happens next */}
        <Text style={[s.sectionTitle, { marginTop: spacing.lg }]}> {t('sessions.what_happens_next')} </Text>
        <View style={s.nextCard}>
          {NEXT_STEPS.map((step, i) =>
          <View key={t(step.text)} style={[s.nextRow, i === NEXT_STEPS.length - 1 && s.nextRowLast]}>
              <View style={s.nextIcon}>
                <Icon name={step.icon as any} size={15} color={colors.softWarning} />
              </View>
              <Text style={s.nextText}>{t(step.text)}</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={s.bar}>
        <TouchableOpacity style={[s.btnRed, submitting && s.btnDisabled]}
        onPress={handleSubmit} disabled={submitting} activeOpacity={0.85}
        accessibilityLabel={t("accessibility.submit_cancellation")}>
          <Icon name="check-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={s.btnRedText}>{submitting ? t("content.sessions.CancellationReasonScreen.submitting") : t("content.sessions.CancellationReasonScreen.submit_cancellation")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default CancellationReasonScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  reasonCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    padding: spacing.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.lg },
  reasonCardLabel: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.7 },
  reasonCardValue: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary, marginTop: 4 },
  sectionTitle: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  detailsInput: { backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)',
    padding: spacing.md, minHeight: 120,
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary },
  nextCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    padding: spacing.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  nextRowLast: { borderBottomWidth: 0 },
  nextIcon: { width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,171,64,0.10)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  nextText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 19 },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btnRed: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.softWarning },
  btnDisabled: { opacity: 0.65 },
  btnRedText: { fontFamily: fontFamily.interBold, fontSize: 15, color: '#fff' }
});