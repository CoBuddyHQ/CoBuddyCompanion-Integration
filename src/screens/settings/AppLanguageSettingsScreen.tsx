import i18next from "i18next"; /**
* AppLanguageSettingsScreen (CPN-145)
* Language preference persists to uiStore (single source of truth for UI prefs).
*/
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useUIStore, AppLanguage } from '../../store/slices/uiStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

const LANGUAGES: {id: AppLanguage;label: string;sub: string;}[] = [{ id: "en", label: "content.settings.AppLanguageSettingsScreen.languages.0.label", sub: "content.settings.AppLanguageSettingsScreen.languages.0.sub" }, { id: "hi", label: "content.settings.AppLanguageSettingsScreen.languages.1.label", sub: "content.settings.AppLanguageSettingsScreen.languages.1.sub" }, { id: "mr", label: "content.settings.AppLanguageSettingsScreen.languages.2.label", sub: "content.settings.AppLanguageSettingsScreen.languages.2.sub" }, { id: "gu", label: "content.settings.AppLanguageSettingsScreen.languages.3.label", sub: "content.settings.AppLanguageSettingsScreen.languages.3.sub" }, { id: "ta", label: "content.settings.AppLanguageSettingsScreen.languages.4.label", sub: "content.settings.AppLanguageSettingsScreen.languages.4.sub" }] as any[];







import { apiPut } from '../../services/api/client';
import { Endpoints } from '../../services/api/endpoints';

export function AppLanguageSettingsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const language = useUIStore((s) => s.language);
  const setLanguage = useUIStore((s) => s.setLanguage);

  const handleSave = async () => {
    try {
      await apiPut(Endpoints.ACCOUNT.LANGUAGE, { language });
    } catch (e) {
      // Gracefully silent if offline
    }
    navigation.canGoBack() ? navigation.goBack() : undefined;
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <View style={s.header}>
        <TouchableOpacity accessibilityRole="button" onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
        style={s.hBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.hTitle}> {t('settings.app_language')} </Text>
        <TouchableOpacity accessibilityRole="button" onPress={handleSave} style={s.hBtn}>
          <Text style={s.saveText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.subtitle}> {t('settings.choose_the_language_for_the_cobuddy_app_interface')} </Text>

        <View style={s.card}>
          {LANGUAGES.map((lang, i) => {
            const active = language === lang.id;
            return (
              <View key={lang.id}>
                {i > 0 && <View style={s.sep} />}
                <TouchableOpacity accessibilityRole="button" style={s.row} onPress={() => setLanguage(lang.id)} activeOpacity={0.75}>
                  <View style={s.rowText}>
                    <Text style={[s.rowLabel, active && s.rowLabelActive]}>{t(lang.label)}</Text>
                    <Text style={s.rowSub}>{t(lang.sub)}</Text>
                  </View>
                  <Icon name={active ? 'check-circle' : 'radio-button-unchecked'}
                  size={22} color={active ? colors.gold : colors.textMuted} />
                </TouchableOpacity>
              </View>);

          })}
        </View>

        <View style={s.banner}>
          <Icon name="info-outline" size={16} color={colors.gold} style={{ flexShrink: 0 }} />
          <Text style={s.bannerText}> {t('settings.changing_app_language_requires_a_restart')} </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default AppLanguageSettingsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  hBtn: { minWidth: 48, alignItems: 'center' },
  hTitle: { fontFamily: fontFamily.interBold, fontSize: 17, color: colors.textPrimary },
  saveText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    marginBottom: spacing.md, lineHeight: 19 },
  card: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.md },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  rowText: { flex: 1 },
  rowLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 16, color: colors.textSecondary, marginBottom: 2 },
  rowLabelActive: { color: colors.textPrimary },
  rowSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  banner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.08)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)', padding: spacing.md },
  bannerText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.gold, flex: 1 }
});