import i18next from "i18next"; /**
* AddTrustedContactScreen (CPN-130)
* Form to add a new emergency contact.
*/
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, KeyboardAvoidingView, Platform, Switch } from
'react-native';
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

export function AddTrustedContactScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [saving, setSaving] = useState(false);

  const addContact = useSafetyStore((s) => s.addContact);

  const canSave = name.trim().length > 0 && phone.trim().length >= 6;

  const handleSave = () => {
    if (!canSave || saving) {return;}
    setSaving(true);
    // Generate a unique ID and persist to store
    const newId = `C-${Date.now().toString(36).toUpperCase()}`;
    addContact({ id: newId, name: name.trim(), phone: `+91 ${phone.trim()}`, relation, isPrimary });
    setTimeout(() => {
      setSaving(false);
      navigation.canGoBack() ? navigation.goBack() : undefined;
    }, 400);
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('safety.add_contact')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* SOS info strip */}
          <View style={s.infoStrip}>
            <Icon name="phone-in-talk" size={14} color={colors.safetyGreen} />
            <Text style={s.infoStripText}>
               {t('safety.this_person_will_receive_an_automated_call_if_you_trigger_sos')} </Text>
          </View>

          {/* Full Name */}
          <Text style={s.label}> {t('safety.full_name')} </Text>
          <TextInput
            style={s.input}
            value={name}
            onChangeText={setName}
            placeholder={t('safety.e_g_priya_sharma')}
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.gold}
            returnKeyType="next" />
          

          {/* Relationship pills */}
          <Text style={s.label}> {t('safety.relationship')} </Text>
          <View style={s.pillsRow}>
            {RELATIONS.map((r) =>
            <TouchableOpacity accessibilityRole="button" key={r}
            style={[s.pill, relation === r && s.pillActive]}
            onPress={() => setRelation(r)} activeOpacity={0.75}>
                <Text style={[s.pillText, relation === r && s.pillTextActive]}>{r}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Phone */}
          <Text style={s.label}> {t('safety.phone_number')} </Text>
          <View style={s.phoneRow}>
            <View style={s.phonePrefix}>
              <Text style={s.phonePrefixText}>+91</Text>
            </View>
            <TextInput
              style={[s.input, s.phoneInput]}
              value={phone}
              onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
              placeholder={t("content.safety.AddTrustedContactScreen.98765_12345")}
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              selectionColor={colors.gold}
              maxLength={10} />
            
          </View>

          {/* Primary switch */}
          <View style={s.switchRow}>
            <View style={s.switchInfo}>
              <Text style={s.switchLabel}> {t('safety.set_as_primary_contact')} </Text>
              <Text style={s.switchSub}> {t('safety.called_first_in_an_emergency')} </Text>
            </View>
            <Switch
              value={isPrimary}
              onValueChange={setIsPrimary}
              trackColor={{ false: colors.border, true: 'rgba(214,168,79,0.35)' }}
              thumbColor={isPrimary ? colors.gold : colors.textMuted} />
            
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky CTA */}
      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button"
          style={[s.btn, (!canSave || saving) && s.btnDisabled]}
          onPress={handleSave} disabled={!canSave || saving}
          activeOpacity={0.85}>
          <Text style={s.btnText}>{saving ? t('common.saving', { defaultValue: 'Saving…' }) : t('safety.save_contact', { defaultValue: 'Save Contact' })}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default AddTrustedContactScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  infoStrip: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(109,214,165,0.07)', borderRadius: radius.md,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.20)',
    padding: spacing.md, marginBottom: spacing.lg },
  infoStripText: { fontFamily: fontFamily.interRegular, fontSize: 12,
    color: colors.textSecondary, flex: 1, lineHeight: 18 },

  label: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: spacing.sm },
  input: { backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)',
    paddingHorizontal: spacing.md, height: 50,
    fontFamily: fontFamily.interRegular, fontSize: 15, color: colors.textPrimary,
    marginBottom: spacing.lg },

  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.cardSurface },
  pillActive: { borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.10)' },
  pillText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textMuted },
  pillTextActive: { color: colors.gold },

  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  phonePrefix: { height: 50, paddingHorizontal: 14, backgroundColor: colors.cardSurface,
    borderRadius: radius.lg, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)',
    alignItems: 'center', justifyContent: 'center' },
  phonePrefixText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textMuted },
  phoneInput: { flex: 1, marginBottom: 0 },

  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: spacing.md },
  switchInfo: { flex: 1 },
  switchLabel: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  switchSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },

  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btn: { height: 52, alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnDisabled: { opacity: 0.45 },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});