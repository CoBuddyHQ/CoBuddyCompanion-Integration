/**
 * AppealDecisionScreen (CPN-174)
 * Submit an appeal against a resolved dispute decision.
 */
import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar, KeyboardAvoidingView, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import {colors} from '../../theme/colors';
import {fontFamily} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {radius} from '../../theme/radius';
import {Routes} from '../../navigation/routes';
import {useSupportStore} from '../../store/slices/supportStore';
import { useTranslation } from "react-i18next";

export function AppealDecisionScreen(): React.JSX.Element {
    const { t } = useTranslation();
   
  const navigation = useNavigation<any>();
   
  const route = useRoute<any>();
  const {disputeId = 'DIS-001'} = route.params ?? {};
  
  const submitDisputeAppeal = useSupportStore(s => s.submitDisputeAppeal);
  const dispute = useSupportStore(s => s.disputes.find(d => d.id === disputeId));

  const [reason,     setReason]     = useState('');
  const [submitting, _setSubmitting] = useState(false);
  const canSubmit = reason.trim().length > 10;

  const handleSubmit = () => {
    if (!canSubmit || submitting) {return;}
    submitDisputeAppeal(disputeId, reason.trim());
    navigation.canGoBack() ? navigation.goBack() : undefined;
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('support.appeal_decision')} showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Warning */}
          <View style={s.warningCard}>
            <Icon name="warning" size={18} color={colors.softWarning} style={{flexShrink: 0}} />
            <Text style={s.warningText}>
               {t('support.you_can_only_appeal_once_per_dispute_make_sure_to_provide_strong_reasoning')} </Text>
          </View>

          {/* Original decision */}
          <View style={s.decisionCard}>
            <Icon name="gavel" size={18} color='#E74C3C' />
            <View style={{flex: 1}}>
              <Text style={s.decisionTitle}> {t('support.dispute')} {dispute?.id ?? disputeId}</Text>
              <Text style={s.decisionOutcome}>{dispute?.outcome ?? 'Ruled against companion'}</Text>
            </View>
            <View style={s.redBadge}><Text style={s.redBadgeText}> {t('support.resolved')} </Text></View>
          </View>

          {/* Appeal reason */}
          <Text style={s.sectionLabel}> {t('support.appeal_reason')} </Text>
          <View style={s.descWrap}>
            <TextInput style={s.descInput} value={reason} onChangeText={setReason}
              placeholder={t('support.explain_why_you_think_the_decision_was_wrong')}
              placeholderTextColor={colors.textMuted} multiline
              selectionColor={colors.gold} textAlignVertical="top" />
          </View>

          {/* New evidence */}
          <TouchableOpacity accessibilityRole="button" style={s.evidenceRow}
            onPress={() => navigation.navigate(Routes.INCIDENT_EVIDENCE_UPLOAD)} activeOpacity={0.75}>
            <Icon name="attach-file" size={18} color={colors.gold} />
            <Text style={s.evidenceText}> {t('support.attach_new_evidence')} </Text>
            <Icon name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={{height: 80}} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={[s.btnGold, (!canSubmit || submitting) && s.btnDisabled]}
          onPress={handleSubmit} disabled={!canSubmit || submitting} activeOpacity={0.85}>
          <Text style={s.btnGoldText}>{submitting ? t('common.submitting', {defaultValue: 'Submitting…'}) : t('support.submit_appeal', {defaultValue: 'Submit Appeal'})}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
export default AppealDecisionScreen;

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.rootBg}, scroll: {flex: 1},
  content: {paddingHorizontal: spacing.lg, paddingTop: spacing.md},
  warningCard: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    backgroundColor: 'rgba(255,171,64,0.07)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(255,171,64,0.22)', padding: spacing.md, marginBottom: spacing.md},
  warningText: {fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.softWarning, flex: 1, lineHeight: 20},
  decisionCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: 'rgba(231,76,60,0.07)', borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(231,76,60,0.22)', padding: spacing.md, marginBottom: spacing.lg},
  decisionTitle: {fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary},
  decisionOutcome: {fontFamily: fontFamily.interRegular, fontSize: 12, color: '#E88', marginTop: 2},
  redBadge: {backgroundColor: 'rgba(231,76,60,0.12)', borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 4},
  redBadgeText: {fontFamily: fontFamily.interBold, fontSize: 11, color: '#E74C3C'},
  sectionLabel: {fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm},
  descWrap: {backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)', overflow: 'hidden', marginBottom: spacing.md},
  descInput: {padding: spacing.md, minHeight: 150,
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary},
  evidenceRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)', padding: spacing.md},
  evidenceText: {fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold, flex: 1},
  bar: {paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'},
  btnGold: {height: 52, alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold},
  btnDisabled: {opacity: 0.45},
  btnGoldText: {fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg},
});
