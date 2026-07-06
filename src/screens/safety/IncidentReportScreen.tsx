/**
 * IncidentReportScreen (CPN-134)
 * File a safety incident report during or after a session.
 */
import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import {colors} from '../../theme/colors';
import {fontFamily} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {radius} from '../../theme/radius';
import {Routes} from '../../navigation/routes';
import {useSafetyStore} from '../../store/slices/safetyStore';
import { useTranslation } from "react-i18next";

const INCIDENT_TYPES = [
  {icon: 'warning',       label: 'I felt unsafe'},
  {icon: 'person',        label: 'Verbal abuse'},
  {icon: 'location-on',   label: 'Wrong location'},
  {icon: 'money-off',     label: 'Payment dispute'},
  {icon: 'block',         label: 'Policy violation'},
  {icon: 'more-horiz',    label: 'Other'},
];

const WHEN_OPTS = ['During session', 'After session'];

export function IncidentReportScreen(): React.JSX.Element {
    const { t } = useTranslation();
   
  const navigation = useNavigation<any>();
   
  const route = useRoute<any>();
  const prefillSession: string = route.params?.sessionId ?? '';

  const [incidentType, setIncidentType] = useState('');
  const [sessionId,    setSessionId]    = useState(prefillSession);
  const [description,  setDescription]  = useState('');
  const [when,         setWhen]         = useState('');

  const addIncidentReport = useSafetyStore(s => s.addIncidentReport);

  const canSubmit = incidentType.length > 0 && description.trim().length > 10;

  const handleSubmit = () => {
    if (!canSubmit) {return;}
    const newId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
    addIncidentReport({
      reportId: newId,
      sessionId: sessionId.trim() || null,
      description: description.trim(),
      category: incidentType,
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    });
    navigation.navigate(Routes.INCIDENT_SUBMITTED, {type: 'incident'});
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('safety.incident_report')} showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        <Text style={s.subtitle}> {t('safety.report_a_safety_concern_during_or_after_a_session')} </Text>

        {/* Incident type grid */}
        <Text style={s.sectionLabel}> {t('safety.incident_type')} </Text>
        <View style={s.typeGrid}>
          {INCIDENT_TYPES.map(item => (
            <TouchableOpacity key={item.label}
              style={[s.typeCard, incidentType === item.label && s.typeCardActive]}
              onPress={() => setIncidentType(item.label)} activeOpacity={0.75}>
              <Icon name={item.icon as any} size={22}
                color={incidentType === item.label ? colors.gold : colors.textMuted} />
              <Text style={[s.typeLabel, incidentType === item.label && s.typeLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Session ID */}
        <Text style={s.sectionLabel}> {t('safety.related_session_id_optional')} </Text>
        <TextInput style={s.input} value={sessionId} onChangeText={setSessionId}
          placeholder={t('safety.e_g_ses_001')} placeholderTextColor={colors.textMuted}
          selectionColor={colors.gold} returnKeyType="next" />

        {/* Description */}
        <Text style={s.sectionLabel}> {t('safety.what_happened')} </Text>
        <View style={s.descWrap}>
          <TextInput style={s.descInput} value={description}
            onChangeText={t => setDescription(t.slice(0, 1000))}
            placeholder={t('safety.describe_the_incident_in_detail')}
            placeholderTextColor={colors.textMuted}
            multiline selectionColor={colors.gold} textAlignVertical="top" />
          <Text style={s.charCount}>{description.length}/1000</Text>
        </View>

        {/* When */}
        <Text style={s.sectionLabel}> {t('safety.when_did_it_happen')} </Text>
        <View style={s.whenRow}>
          {WHEN_OPTS.map(w => (
            <TouchableOpacity key={w}
              style={[s.whenPill, when === w && s.whenPillActive]}
              onPress={() => setWhen(w)} activeOpacity={0.75}>
              <Text style={[s.whenText, when === w && s.whenTextActive]}>{w}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Attach evidence */}
        <TouchableOpacity style={s.attachRow}
          onPress={() => navigation.navigate(Routes.INCIDENT_EVIDENCE_UPLOAD, {incidentId: `draft-${Math.random().toString(36).substring(2, 9)}`})}
          activeOpacity={0.75}>
          <Icon name="attach-file" size={18} color={colors.gold} />
          <Text style={s.attachText}> {t('safety.attach_evidence')} </Text>
          <Icon name="chevron-right" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={{height: 80}} />
      </ScrollView>

      <View style={s.bar}>
        <TouchableOpacity
          style={[s.btnSubmit, !canSubmit && s.btnDisabled]}
          onPress={handleSubmit} disabled={!canSubmit} activeOpacity={0.85}>
          <Icon name="flag" size={18} color="#fff" style={{marginRight: 8}} />
          <Text style={s.btnSubmitText}> {t('safety.submit_report')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
export default IncidentReportScreen;

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.rootBg},
  scroll: {flex: 1},
  content: {paddingHorizontal: spacing.lg, paddingTop: spacing.md},
  subtitle: {fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    lineHeight: 19, marginBottom: spacing.lg},
  sectionLabel: {fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm},
  typeGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg},
  typeCard: {width: '47%', alignItems: 'center', gap: 8, paddingVertical: spacing.md,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.06)'},
  typeCardActive: {borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.08)'},
  typeLabel: {fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textMuted, textAlign: 'center'},
  typeLabelActive: {color: colors.gold},
  input: {backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)',
    paddingHorizontal: spacing.md, height: 50,
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.lg},
  descWrap: {backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)', marginBottom: spacing.lg, overflow: 'hidden'},
  descInput: {padding: spacing.md, minHeight: 150,
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary},
  charCount: {fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted,
    textAlign: 'right', paddingHorizontal: spacing.md, paddingBottom: spacing.sm},
  whenRow: {flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg},
  whenPill: {flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.cardSurface},
  whenPillActive: {borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.10)'},
  whenText: {fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textMuted},
  whenTextActive: {color: colors.gold},
  attachRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)', padding: spacing.md},
  attachText: {fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold, flex: 1},
  bar: {paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'},
  btnSubmit: {height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: '#C0392B'},
  btnDisabled: {opacity: 0.45},
  btnSubmitText: {fontFamily: fontFamily.interBold, fontSize: 15, color: '#fff'},
});
