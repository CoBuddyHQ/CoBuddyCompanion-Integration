import i18next from "i18next"; /**
* DeleteAccountScreen (CPN-149)
*/
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useAuthStore } from '../../store/slices/authStore';
import { useProfileStore } from '../../store/slices/profileStore';
import { SettingsService } from '../../services/api/services/settings.service';

import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

const CONSEQUENCES = ["Your profile will be permanently deleted", "All upcoming sessions will be cancelled", "Pending earnings will be forfeited", "Your reviews and ratings will be removed"] as any[];






export function DeleteAccountScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const logout = useAuthStore((s) => s.logout);
  const clearProfile = useProfileStore((s) => s.clearProfile);
  const [input, setInput] = useState('');
  const canDelete = input.trim() === 'DELETE';

  const handleDelete = () => {
    if (!canDelete) {return;}
    Alert.alert(
      t("alerts.account_deleted"),
      t("alerts.your_account_has_been_permanently_delete"),
      [{
        text: t("alerts.ok"),
        onPress: async () => {
          try {
            await SettingsService.deleteAccount();
          } catch (_) {
            // Ignore API error if account was already deleted/offline
          } finally {
            clearProfile(); // Wipe all profile data locally
            await logout(); // Clear auth state & stores → RootNavigator auto-shows AuthNavigator
          }
        }
      }]
    );
  };


  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('settings.delete_account')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Warning banner */}
          <View style={s.warningBanner}>
            <Icon name="warning" size={20} color="#E74C3C" style={{ flexShrink: 0 }} />
            <Text style={s.warningText}>
               {t('settings.this_action_is_permanent_and_cannot_be_undone')} </Text>
          </View>

          {/* Consequences */}
          <Text style={s.sectionLabel}> {t('settings.what_will_happen')} </Text>
          <View style={s.card}>
            {CONSEQUENCES.map((c, i) =>
            <View key={i}>
                {i > 0 && <View style={s.sep} />}
                <View style={s.consequenceRow}>
                  <View style={s.xIconWrap}>
                    <Icon name="close" size={14} color="#E74C3C" />
                  </View>
                  <Text style={s.consequenceText}>{c}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Confirm input */}
          <Text style={s.sectionLabel}> {t('settings.confirm_deletion')} </Text>
          <Text style={s.inputHint}> {t('settings.type')} <Text style={s.inputHintBold}> {t('settings.delete')} </Text>  {t('settings.in_the_box_below_to_confirm')} </Text>
          <View style={[s.inputWrap, canDelete && s.inputWrapReady]}>
            <TextInput style={s.input} value={input} onChangeText={setInput}
            placeholder={t('settings.type_delete_here')} placeholderTextColor={colors.textMuted}
            autoCapitalize="characters" selectionColor="#E74C3C" />
          </View>

          {/* Delete button */}
          <TouchableOpacity accessibilityRole="button"
            style={[s.deleteBtn, !canDelete && s.deleteBtnDisabled]}
            onPress={handleDelete} disabled={!canDelete} activeOpacity={0.85}>
            <Icon name="delete-forever" size={20} color={canDelete ? '#fff' : colors.textMuted}
            style={{ marginRight: 8 }} />
            <Text style={[s.deleteBtnText, !canDelete && s.deleteBtnTextDisabled]}>
               {t('settings.delete_my_account')} </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>);

}
export default DeleteAccountScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  warningBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(231,76,60,0.10)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(231,76,60,0.30)', padding: spacing.md, marginBottom: spacing.lg },
  warningText: { fontFamily: fontFamily.interBold, fontSize: 14, color: '#E74C3C', flex: 1, lineHeight: 20 },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  card: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.lg },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md },
  consequenceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  xIconWrap: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(231,76,60,0.12)',
    borderWidth: 1, borderColor: 'rgba(231,76,60,0.28)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  consequenceText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary, flex: 1 },
  inputHint: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    marginBottom: spacing.sm, lineHeight: 19 },
  inputHintBold: { fontFamily: fontFamily.interBold, color: '#E74C3C' },
  inputWrap: { backgroundColor: '#0D1525', borderRadius: radius.md,
    borderWidth: 2, borderColor: 'rgba(231,76,60,0.30)', marginBottom: spacing.lg },
  inputWrapReady: { borderColor: '#E74C3C' },
  input: { fontFamily: fontFamily.interSemiBold, fontSize: 16, color: '#E74C3C',
    paddingHorizontal: spacing.md, paddingVertical: 14, letterSpacing: 3 },
  deleteBtn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: '#E74C3C' },
  deleteBtnDisabled: { backgroundColor: colors.cardSurface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  deleteBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: '#fff' },
  deleteBtnTextDisabled: { color: colors.textMuted }
});