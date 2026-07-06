/**
 * ChangePinScreen — Change PIN or Password
 */
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useAuthStore } from '../../store/slices/authStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

type Mode = 'pin' | 'password';

// ─── Reusable labelled input ─────────────────────────────────────────────────

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  numeric?: boolean;
  maxLength?: number;
}

const Field: React.FC<FieldProps> = ({ label, value, onChange, numeric, maxLength }) => {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  return (
    <View style={f.wrap}>
      <Text style={f.label}>{label}</Text>
      <View style={[f.row, focused && f.rowFocused]}>
        <TextInput
          style={f.input}
          value={value}
          onChangeText={onChange}
          secureTextEntry={!visible}
          keyboardType={numeric ? 'numeric' : 'default'}
          maxLength={maxLength}
          placeholder={numeric ? '••••' : '••••••••'}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={colors.gold}
          autoCapitalize="none" />
        
        <TouchableOpacity onPress={() => setVisible((v) => !v)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name={visible ? 'visibility-off' : 'visibility'}
          size={20} color={focused ? colors.gold : colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>);

};

const f = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textSecondary, marginBottom: 7 },
  row: { flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#0D1525', borderRadius: radius.md,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: spacing.md, paddingVertical: 13 },
  rowFocused: { borderColor: colors.gold },
  input: { flex: 1, fontFamily: fontFamily.interRegular, fontSize: 15,
    color: colors.textPrimary, padding: 0 }
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ChangePinScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [mode, setMode] = useState<Mode>('pin');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const reset = () => {setCurrent('');setNext('');setConfirm('');};
  const switchMode = (m: Mode) => {setMode(m);reset();};

  const isPin = mode === 'pin';
  const allFilled = current.length > 0 && next.length > 0 && confirm.length > 0;
  const pinsMatch = next === confirm;
  const notSame = current !== next;
  const canSubmit = allFilled && pinsMatch && notSame;

  const handleUpdate = () => {
    if (!allFilled) {
      Alert.alert(t("alerts.incomplete"), t("alerts.please_fill_in_all_fields"));return;
    }
    if (!pinsMatch) {
      Alert.alert(t("alerts.mismatch"), t("alerts.new_v0_and_confirmation_don_t_match", { v0: isPin ? t("content.settings.ChangePinScreen.pin") : 'password' }));return;
    }
    if (!notSame) {
      Alert.alert(t("alerts.same_value"), t("alerts.new_v0_must_be_different_from_the_curren", { v0: isPin ? t("content.settings.ChangePinScreen.pin") : 'password' }));return;
    }
    Alert.alert(t("alerts.success"), t("alerts.your_security_details_have_been_updated"), [
    {
      text: t("alerts.ok"),
      onPress: () => {
        useAuthStore.getState().setPinSet(true);
        navigation.canGoBack() ? navigation.goBack() : undefined;
      }
    }]
    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('settings.change_security_details')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Mode toggle */}
          <View style={s.toggleRow}>
            {(['pin', 'password'] as Mode[]).map((m) =>
            <TouchableOpacity key={m} style={[s.togglePill, mode === m && s.togglePillActive]}
            onPress={() => switchMode(m)} activeOpacity={0.75}>
                <Icon name={m === 'pin' ? 'pin' : 'lock'}
              size={16} color={mode === m ? colors.gold : colors.textMuted} />
                <Text style={[s.toggleText, mode === m && s.toggleTextActive]}>
                  {m === 'pin' ? t("content.settings.ChangePinScreen.change_pin") : t("content.settings.ChangePinScreen.change_password")}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Info banner */}
          <View style={s.banner}>
            <Icon name="shield" size={15} color={colors.gold} style={{ flexShrink: 0 }} />
            <Text style={s.bannerText}>
              {isPin ? t("content.settings.ChangePinScreen.your_pin_is_4_digits_and_is_used_to_lock") : t("content.settings.ChangePinScreen.use_a_strong_password_with_at_least_8_ch")

              }
            </Text>
          </View>

          {/* Fields */}
          <View style={s.formCard}>
            <Field label={isPin ? t("content.settings.ChangePinScreen.current_4_digit_pin") : t("content.settings.ChangePinScreen.current_password")}
            value={current} onChange={setCurrent}
            numeric={isPin} maxLength={isPin ? 4 : undefined} />
            <Field label={isPin ? t("content.settings.ChangePinScreen.new_4_digit_pin") : t("content.settings.ChangePinScreen.new_password")}
            value={next} onChange={setNext}
            numeric={isPin} maxLength={isPin ? 4 : undefined} />
            <Field label={isPin ? t("content.settings.ChangePinScreen.confirm_new_pin") : t("content.settings.ChangePinScreen.confirm_new_password")}
            value={confirm} onChange={setConfirm}
            numeric={isPin} maxLength={isPin ? 4 : undefined} />
          </View>

          {/* Validation hints */}
          {allFilled && !pinsMatch &&
          <View style={s.errorRow}>
              <Icon name="error-outline" size={14} color="#E74C3C" />
              <Text style={s.errorText}> {t('settings.new')} {isPin ? t("content.settings.ChangePinScreen.pin") : 'password'}  {t('settings.and_confirmation_don_t_match')} </Text>
            </View>
          }
          {allFilled && pinsMatch && !notSame &&
          <View style={s.errorRow}>
              <Icon name="error-outline" size={14} color="#E74C3C" />
              <Text style={s.errorText}> {t('settings.new')} {isPin ? t("content.settings.ChangePinScreen.pin") : 'password'}  {t('settings.must_differ_from_the_current_one')} </Text>
            </View>
          }
          {allFilled && canSubmit &&
          <View style={s.successRow}>
              <Icon name="check-circle" size={14} color={colors.safetyGreen} />
              <Text style={s.successText}> {t('settings.all_good_ready_to_update')} </Text>
            </View>
          }

          {/* CTA */}
          <TouchableOpacity style={[s.btn, !canSubmit && s.btnDisabled]}
          onPress={handleUpdate} disabled={!canSubmit} activeOpacity={0.85}>
            <Icon name="check" size={18} color={canSubmit ? colors.rootBg : colors.textMuted}
            style={{ marginRight: 8 }} />
            <Text style={[s.btnText, !canSubmit && s.btnTextDisabled]}> {t('settings.update_details')} </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>);

}
export default ChangePinScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  toggleRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  togglePill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 11, borderRadius: radius.xl,
    backgroundColor: colors.cardSurface,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)' },
  togglePillActive: { backgroundColor: 'rgba(214,168,79,0.10)', borderColor: colors.gold },
  toggleText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textMuted },
  toggleTextActive: { color: colors.gold },

  banner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.08)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    padding: spacing.md, marginBottom: spacing.md },
  bannerText: { fontFamily: fontFamily.interRegular, fontSize: 13,
    color: colors.textSecondary, flex: 1 },

  formCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md, marginBottom: spacing.sm },

  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  errorText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: '#E74C3C' },
  successRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  successText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.safetyGreen },

  btn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold, marginTop: spacing.sm },
  btnDisabled: { backgroundColor: colors.cardSurface,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  btnTextDisabled: { color: colors.textMuted }
});