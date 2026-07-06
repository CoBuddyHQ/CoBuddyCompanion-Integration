import i18next from "i18next"; /**
* SafetyGuidelinesScreen (CPN-125)
* Scrollable safety guidelines organized by session phase.
*/
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

const BEFORE = ["Always meet at public venues only", "Share your session details with a trusted contact", "Keep your phone charged and location ON", "Review the customer's trust score before accepting", "Set a Safety Timer before starting"] as any[];







const DURING = ["Stay in public areas at all times", "Trust your instincts \u2014 end session if uncomfortable", "Use in-app chat/call only (for your protection)", "Check in with CoBuddy if session feels unsafe"] as any[];






const GuidelineCard: React.FC<{text: string;}> = ({ text }) =>
<View style={s.guideCard}>
    <View style={s.goldBar} />
    <Text style={s.guideText}>{text}</Text>
  </View>;


export function SafetyGuidelinesScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('safety.safety_guidelines')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Section 1 */}
        <View style={s.sectionHeader}>
          <View style={s.sectionDot} />
          <Text style={s.sectionTitle}> {t('safety.before_every_session')} </Text>
        </View>
        {BEFORE.map((t) => <GuidelineCard key={t} text={t} />)}

        {/* Section 2 */}
        <View style={[s.sectionHeader, { marginTop: spacing.lg }]}>
          <View style={[s.sectionDot, { backgroundColor: colors.safetyGreen }]} />
          <Text style={s.sectionTitle}> {t('safety.during_your_session')} </Text>
        </View>
        {DURING.map((t) => <GuidelineCard key={t} text={t} />)}

        {/* Section 3 — Emergency */}
        <View style={[s.sectionHeader, { marginTop: spacing.lg }]}>
          <View style={[s.sectionDot, { backgroundColor: colors.softWarning }]} />
          <Text style={s.sectionTitle}> {t('safety.emergency_actions')} </Text>
        </View>
        <View style={s.emergencyCard}>
          <Icon name="emergency" size={20} color={colors.softWarning} />
          <Text style={s.emergencyText}>
             {t('safety.use_the')} <Text style={s.emergencyBold}> {t('safety.sos_button')} </Text>  {t('safety.for_immediate_help_cobuddy_support_and_your_emergency_contacts_will_be_alerted_instantly')} </Text>
        </View>

        <TouchableOpacity style={s.sosBtn}
        onPress={() => navigation.navigate(Routes.SOS)}
        activeOpacity={0.85} accessibilityLabel={t("accessibility.view_sos_button")}>
          <Icon name="sos" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.sosBtnText}> {t('safety.view_sos_screen')} </Text>
        </TouchableOpacity>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default SafetyGuidelinesScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  sectionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold },
  sectionTitle: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },

  guideCard: { flexDirection: 'row', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    marginBottom: spacing.sm, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  goldBar: { width: 4, backgroundColor: colors.gold, borderRadius: 4 },
  guideText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary,
    paddingVertical: spacing.md, paddingRight: spacing.md, flex: 1, lineHeight: 21 },

  emergencyCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    backgroundColor: 'rgba(200,40,40,0.09)', borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(200,40,40,0.28)', padding: spacing.lg, marginBottom: spacing.md },
  emergencyText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: 'rgba(255,120,120,0.90)',
    flex: 1, lineHeight: 21 },
  emergencyBold: { fontFamily: fontFamily.interBold },

  sosBtn: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.softWarning, marginBottom: spacing.md },
  sosBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});