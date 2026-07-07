/**
 * DisputeDetailScreen (CPN-173)
 * View dispute details or file a new dispute.
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

const DISPUTE_CATS = ['Payment not received', 'Unfair cancellation', 'False review', 'Other'];

export function DisputeDetailScreen(): React.JSX.Element {
    const { t } = useTranslation();
   
  const navigation = useNavigation<any>();
   
  const route = useRoute<any>();
  const {disputeId = ''} = route.params ?? {};
  const isNew = disputeId === 'new';
  
  const dispute = useSupportStore(s => s.disputes.find(d => d.id === disputeId));
  const fileDispute = useSupportStore(s => s.fileDispute);

  const [category,    setCategory]    = useState('');
  const [description, setDescription] = useState('');
  const [submitting,  setSubmitting]  = useState(false);

  const canSubmit = category.length > 0 && description.trim().length > 10;

  const handleSubmit = () => {
    if (!canSubmit || submitting) {return;}
    fileDispute(category, description.trim());
    navigation.canGoBack() ? navigation.goBack() : undefined;
  };

  if (isNew) {
    return (
      <SafeAreaView style={s.root} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
        <AppHeader title={t('support.file_new_dispute')} showBack
          onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={s.sectionLabel}> {t('support.category')} </Text>
            <View style={s.pillsWrap}>
              {DISPUTE_CATS.map(c => (
                <TouchableOpacity accessibilityRole="button" key={c} style={[s.pill, category === c && s.pillActive]}
                  onPress={() => setCategory(c)} activeOpacity={0.75}>
                  <Text style={[s.pillText, category === c && s.pillTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[s.sectionLabel, {marginTop: spacing.sm}]}> {t('support.description')} </Text>
            <View style={s.descWrap}>
              <TextInput style={s.descInput} value={description}
                onChangeText={setDescription} placeholder={t('support.explain_your_dispute_in_detail')}
                placeholderTextColor={colors.textMuted} multiline selectionColor={colors.gold} textAlignVertical="top" />
            </View>
            <View style={{height: 80}} />
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={s.bar}>
          <TouchableOpacity accessibilityRole="button" style={[s.btnGold, (!canSubmit || submitting) && s.btnDisabled]}
            onPress={handleSubmit} disabled={!canSubmit || submitting} activeOpacity={0.85}>
            <Text style={s.btnGoldText}>{submitting ? t('common.loading') : t('support.submit_dispute', { defaultValue: 'Submit Dispute' })}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Detail view
  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={`Dispute #${disputeId}`} showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Status */}
        <View style={s.statusCard}>
          <Icon name="gavel" size={20} color={colors.softWarning} />
          <View style={{flex: 1}}>
            <Text style={s.statusTitle}> {t('support.under_review')} </Text>
            <Text style={s.statusSub}> {t('support.safety_team_is_reviewing_your_case')} </Text>
          </View>
          <View style={s.amberBadge}><Text style={s.amberBadgeText}> {t('support.pending')} </Text></View>
        </View>

        {/* Session info */}
        <Text style={s.sectionLabel}> {t('support.session_details')} </Text>
        <View style={s.infoCard}>
          {[
            ['Date', dispute?.sessionId ?? 'Unknown'], 
            ['Customer', dispute?.customerName ?? 'Unknown'], 
            ['Amount', dispute?.amount ?? '₹0']
          ].map(([k, v]) => (
            <View key={k} style={s.infoRow}>
              <Text style={s.infoKey}>{k}</Text>
              <Text style={s.infoVal}>{v}</Text>
            </View>
          ))}
        </View>

        {/* Timeline */}
        <Text style={[s.sectionLabel, {marginTop: spacing.md}]}> {t('support.timeline')} </Text>
        <View style={s.timelineCard}>
          {(dispute?.timeline ?? []).map((timelineEvent, i) => (
            <View key={i} style={s.timelineRow}>
              <View style={s.timelineDot} />
              <View style={{flex: 1}}>
                <Text style={s.timelineDate}>{timelineEvent.date}</Text>
                <Text style={s.timelineDesc}>{t(timelineEvent.desc)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Evidence link */}
        <TouchableOpacity accessibilityRole="button" style={s.evidenceRow}
          onPress={() => navigation.navigate(Routes.INCIDENT_EVIDENCE_UPLOAD)} activeOpacity={0.75}>
          <Icon name="attach-file" size={18} color={colors.gold} />
          <Text style={s.evidenceText}> {t('support.add_more_evidence')} </Text>
          <Icon name="chevron-right" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Appeal link */}
        <TouchableOpacity accessibilityRole="button" style={s.appealLink}
          onPress={() => navigation.navigate(Routes.APPEAL_DECISION, {disputeId})} activeOpacity={0.7}>
          <Text style={s.appealLinkText}> {t('support.appeal_decision')} </Text>
        </TouchableOpacity>

        <View style={{height: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
}
export default DisputeDetailScreen;

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.rootBg}, scroll: {flex: 1},
  content: {paddingHorizontal: spacing.lg, paddingTop: spacing.md},
  sectionLabel: {fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm},
  pillsWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md},
  pill: {paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.cardSurface},
  pillActive: {borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.10)'},
  pillText: {fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textMuted},
  pillTextActive: {color: colors.gold},
  descWrap: {backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)', overflow: 'hidden'},
  descInput: {padding: spacing.md, minHeight: 150,
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary},
  bar: {paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'},
  btnGold: {height: 52, alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold},
  btnDisabled: {opacity: 0.45},
  btnGoldText: {fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg},
  statusCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: 'rgba(255,171,64,0.07)', borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,171,64,0.22)', padding: spacing.md, marginBottom: spacing.lg},
  statusTitle: {fontFamily: fontFamily.interBold, fontSize: 15, color: colors.softWarning},
  statusSub: {fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2},
  amberBadge: {backgroundColor: 'rgba(255,171,64,0.15)', borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 4},
  amberBadgeText: {fontFamily: fontFamily.interBold, fontSize: 11, color: colors.softWarning},
  infoCard: {backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: spacing.md, gap: spacing.sm},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between'},
  infoKey: {fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted},
  infoVal: {fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary},
  timelineCard: {backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: spacing.md, gap: spacing.sm},
  timelineRow: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md},
  timelineDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.gold, marginTop: 4, flexShrink: 0},
  timelineDate: {fontFamily: fontFamily.interBold, fontSize: 12, color: colors.textMuted},
  timelineDesc: {fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, lineHeight: 19},
  evidenceRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)', padding: spacing.md, marginTop: spacing.md},
  evidenceText: {fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold, flex: 1},
  appealLink: {alignItems: 'center', paddingVertical: spacing.md, marginTop: spacing.sm},
  appealLinkText: {fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textMuted},
});
