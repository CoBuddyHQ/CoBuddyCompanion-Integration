import i18next from "i18next"; /**
* CancelSessionRequestScreen (CPN-114)
* Companion cancels with penalty warning + reason selection.
*/
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

const REASONS = ["Personal emergency", "Health issue", "Transport problem", "Other"] as any[];

export function CancelSessionRequestScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';
  const [selected, setSelected] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');
  const isValid = !!selected && (selected !== 'Other' || otherText.trim().length > 0);
  const effectiveReason = selected === 'Other' ? otherText.trim() : selected ?? '';

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('sessions.cancel_session')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      <ScrollView style={s.scroll} contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={s.warnCard}>
          <Icon name="error" size={20} color={colors.softWarning} />
          <View style={{ flex: 1 }}>
            <Text style={s.warnTitle}> {t('sessions.late_cancellation_warning')} </Text>
            <Text style={s.warnText}> {t('sessions.cancelling_within_2_hours_of_start_may_result_in_a_penalty_fee')} </Text>
          </View>
        </View>
        <View style={s.penaltyCard}>
          <Icon name="account-balance-wallet" size={15} color={colors.softWarning} />
          <Text style={s.penaltyText}> {t('sessions.penalty')} <Text style={s.penaltyAmt}>₹200</Text>  {t('sessions.deducted_from_next_payout')} </Text>
        </View>
        <View style={s.trustCard}>
          <Icon name="shield" size={15} color={colors.gold} style={{ flexShrink: 0 }} />
          <Text style={s.trustText}>
            <Text style={s.trustBold}> {t('sessions.5_trust_score_points')} </Text>  {t('sessions.will_be_applied_repeated_cancellations_may_restrict_your_account')} </Text>
        </View>
        <Text style={s.sectionTitle}> {t('sessions.select_reason_required')} </Text>
        {REASONS.map((r) =>
        <TouchableOpacity key={r}
        style={[s.pill, selected === r && s.pillActive]}
        onPress={() => setSelected(r)} activeOpacity={0.75}>
            <View style={[s.radio, selected === r && s.radioActive]}>
              {selected === r && <View style={s.radioInner} />}
            </View>
            <Text style={[s.pillLabel, selected === r && s.pillLabelActive]}>{r}</Text>
          </TouchableOpacity>
        )}
        {selected === 'Other' &&
        <TextInput style={s.otherInput} value={otherText} onChangeText={setOtherText}
        placeholder={t('sessions.describe_your_reason')} placeholderTextColor={colors.textMuted}
        multiline maxLength={300} selectionColor={colors.gold} textAlignVertical="top" />
        }
        <View style={{ height: 120 }} />
      </ScrollView>
      <View style={s.bar}>
        <TouchableOpacity style={[s.btnRed, !isValid && s.btnDisabled]}
        onPress={() => navigation.navigate(Routes.CANCELLATION_REASON, { sessionId, reason: effectiveReason })}
        disabled={!isValid} activeOpacity={0.85}>
          <Icon name="cancel" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={s.btnRedText}> {t('sessions.confirm_cancellation')} </Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btnOutline}
        onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} activeOpacity={0.75}>
          <Text style={s.btnOutlineText}> {t('sessions.keep_session')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default CancelSessionRequestScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  warnCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    backgroundColor: 'rgba(200,40,40,0.10)', borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(200,40,40,0.30)', padding: spacing.lg, marginBottom: spacing.sm },
  warnTitle: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.softWarning, marginBottom: 3 },
  warnText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: 'rgba(255,100,100,0.85)', lineHeight: 19 },
  penaltyCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(255,171,64,0.07)', borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,171,64,0.20)', marginBottom: spacing.lg },
  penaltyText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1 },
  penaltyAmt: { fontFamily: fontFamily.interBold, color: colors.softWarning },
  trustCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)', marginBottom: spacing.lg },
  trustText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 19 },
  trustBold: { fontFamily: fontFamily.interBold, color: colors.gold },
  sectionTitle: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  pill: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm },
  pillActive: { borderColor: colors.softWarning, backgroundColor: 'rgba(200,40,40,0.06)' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  radioActive: { borderColor: colors.softWarning },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.softWarning },
  pillLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textSecondary },
  pillLabelActive: { color: colors.textPrimary },
  otherInput: { backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.35)', padding: spacing.md,
    minHeight: 100, fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary, marginTop: spacing.sm },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', gap: spacing.sm },
  btnRed: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.softWarning },
  btnDisabled: { opacity: 0.45 },
  btnRedText: { fontFamily: fontFamily.interBold, fontSize: 15, color: '#fff' },
  btnOutline: { height: 48, alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.40)' },
  btnOutlineText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold }
});