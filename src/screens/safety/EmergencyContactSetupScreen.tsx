import i18next from "i18next"; /**
* EmergencyContactSetupScreen (CPN-128)
* Onboarding-style initial emergency contact setup.
*/
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useSafetyStore } from '../../store/slices/safetyStore';
import { useTranslation } from "react-i18next";

const RELATIONS = ["Mother", "Father", "Sibling", "Friend", "Partner", "Other"] as any[];

export function EmergencyContactSetupScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');
  const [isPrimary, setIsPrimary] = useState(true);
  const [saving, setSaving] = useState(false);
  const canContinue = name.trim().length > 0 && phone.trim().length >= 6;
  const addContact = useSafetyStore((s) => s.addContact);
  const handleContinue = () => {
    if (saving) {return;}
    setSaving(true);
    const newId = `C-${Date.now().toString(36).toUpperCase()}`;
    addContact({ id: newId, name: name.trim(), phone: `+91 ${phone.trim()}`, relation, isPrimary });
    setTimeout(() => {setSaving(false);navigation.canGoBack() ? navigation.goBack() : undefined;}, 600);
  };
  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('safety.emergency_setup')} showBack onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={s.stepRow}>
            {[1, 2, 3].map((i) => <View key={i} style={[s.stepDot, i === 2 && s.stepDotActive, i < 2 && s.stepDotDone]} />)}
            <Text style={s.stepLabel}> {t('safety.step_2_of_3')} </Text>
          </View>
          <Text style={s.title}>{'Who should we contact\nin an emergency?'}</Text>
          <Text style={s.subtitle}> {t('safety.add_at_least_one_trusted_contact_before_your_first_session')} </Text>
          <View style={s.safetyBanner}>
            <Icon name="warning" size={14} color={colors.softWarning} />
            <Text style={s.safetyBannerText}> {t('safety.this_is_important_for_your_safety_contacts_are_notified_instantly_when_you_trigger_sos')} </Text>
          </View>
          <Text style={s.label}> {t('safety.full_name')} </Text>
          <TextInput style={s.input} value={name} onChangeText={setName} placeholder={t('safety.e_g_priya_sharma')} placeholderTextColor={colors.textMuted} selectionColor={colors.gold} returnKeyType="next" />
          <Text style={s.label}> {t('safety.relationship')} </Text>
          <View style={s.pillsRow}>
            {RELATIONS.map((r) =>
            <TouchableOpacity accessibilityRole="button" key={r} style={[s.pill, relation === r && s.pillActive]} onPress={() => setRelation(r)} activeOpacity={0.75}>
                <Text style={[s.pillText, relation === r && s.pillTextActive]}>{r}</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={s.label}> {t('safety.phone_number')} </Text>
          <View style={s.phoneRow}>
            <View style={s.phonePrefix}><Text style={s.phonePrefixText}>+91</Text></View>
            <TextInput style={[s.input, s.phoneInput]} value={phone} onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))} placeholder={t("content.safety.EmergencyContactSetupScreen.98765_12345")} placeholderTextColor={colors.textMuted} keyboardType="phone-pad" selectionColor={colors.gold} maxLength={10} />
          </View>
          <View style={s.switchRow}>
            <View style={s.switchInfo}>
              <Text style={s.switchLabel}> {t('safety.set_as_primary_contact')} </Text>
              <Text style={s.switchSub}> {t('safety.called_first_in_an_emergency')} </Text>
            </View>
            <Switch value={isPrimary} onValueChange={setIsPrimary} trackColor={{ false: colors.border, true: 'rgba(214,168,79,0.35)' }} thumbColor={isPrimary ? colors.gold : colors.textMuted} />
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={[s.btn, (!canContinue || saving) && s.btnDisabled]} onPress={handleContinue} disabled={!canContinue || saving} activeOpacity={0.85}>
          <Text style={s.btnText}>{saving ? t('common.saving', { defaultValue: 'Saving…' }) : t('common.continue', { defaultValue: 'Continue' })}</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} activeOpacity={0.6} style={s.skipBtn}>
          <Text style={s.skipText}> {t('safety.skip_for_now')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default EmergencyContactSetupScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg }, scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.lg },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border },
  stepDotDone: { backgroundColor: colors.safetyGreen },
  stepDotActive: { width: 28, backgroundColor: colors.gold, borderRadius: 5 },
  stepLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textMuted, marginLeft: 4 },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 24, color: colors.textPrimary, lineHeight: 32, marginBottom: spacing.sm },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.lg },
  safetyBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: 'rgba(255,171,64,0.07)', borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(255,171,64,0.22)', padding: spacing.md, marginBottom: spacing.lg },
  safetyBannerText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.softWarning, flex: 1, lineHeight: 18 },
  label: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: spacing.sm },
  input: { backgroundColor: colors.cardSurface, borderRadius: radius.lg, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)', paddingHorizontal: spacing.md, height: 50, fontFamily: fontFamily.interRegular, fontSize: 15, color: colors.textPrimary, marginBottom: spacing.lg },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.cardSurface },
  pillActive: { borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.10)' },
  pillText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textMuted },
  pillTextActive: { color: colors.gold },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  phonePrefix: { height: 50, paddingHorizontal: 14, backgroundColor: colors.cardSurface, borderRadius: radius.lg, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)', alignItems: 'center', justifyContent: 'center' },
  phonePrefixText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textMuted },
  phoneInput: { flex: 1, marginBottom: 0 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.cardSurface, borderRadius: radius.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: spacing.md },
  switchInfo: { flex: 1 },
  switchLabel: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  switchSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', gap: 4 },
  btn: { height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: colors.gold },
  btnDisabled: { opacity: 0.45 },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  skipBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  skipText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted }
});