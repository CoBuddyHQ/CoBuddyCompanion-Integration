import i18next from "i18next"; /**
* LegalAgreementsScreen (CPN-147)
*/
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Linking, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

const DOCS: {icon: string;label: string;sub: string;url: string;}[] = [{ icon: "description", label: "content.settings.LegalAgreementsScreen.docs.0.label", sub: "content.settings.LegalAgreementsScreen.docs.0.sub", url: "https://cobuddy.app/terms" }, { icon: "privacy-tip", label: "content.settings.LegalAgreementsScreen.docs.1.label", sub: "content.settings.LegalAgreementsScreen.docs.1.sub", url: "https://cobuddy.app/privacy" }, { icon: "handshake", label: "content.settings.LegalAgreementsScreen.docs.2.label", sub: "content.settings.LegalAgreementsScreen.docs.2.sub", url: "https://cobuddy.app/companion-agreement" }, { icon: "groups", label: "content.settings.LegalAgreementsScreen.docs.3.label", sub: "content.settings.LegalAgreementsScreen.docs.3.sub", url: "https://cobuddy.app/community" }] as any[];






export function LegalAgreementsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const openDoc = (label: string, url: string) =>
  Linking.openURL(url).catch(() =>
  Alert.alert(t("alerts.could_not_open"), t("alerts.unable_to_open_v0_please_visit_cobuddy_a", { v0: label }))
  );

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('settings.legal_agreements')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.card}>
          {DOCS.map((doc, i) =>
          <View key={t(doc.label)}>
              {i > 0 && <View style={s.sep} />}
              <TouchableOpacity accessibilityRole="button" style={s.row} onPress={() => openDoc(doc.label, doc.url)} activeOpacity={0.75}>
                <View style={s.iconWrap}>
                  <Icon name={doc.icon as any} size={20} color={colors.gold} />
                </View>
                <View style={s.rowText}>
                  <Text style={s.rowLabel}>{t(doc.label)}</Text>
                  <Text style={s.rowSub}>{t(doc.sub)}</Text>
                </View>
                <Icon name="chevron-right" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ flex: 1, minHeight: 80 }} />

        <Text style={s.version}> {t('settings.version_1_0_4')} </Text>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default LegalAgreementsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, flexGrow: 1 },
  card: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  iconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(214,168,79,0.10)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rowText: { flex: 1 },
  rowLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary, marginBottom: 2 },
  rowSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  version: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, textAlign: 'center' }
});