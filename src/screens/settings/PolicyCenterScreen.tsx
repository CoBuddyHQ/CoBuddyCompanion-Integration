import i18next from "i18next"; /**
* PolicyCenterScreen
* Companion-facing policy reference — cancellation, refunds, and venue rules.
*/
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, LayoutAnimation, Platform, UIManager } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface PolicySection {
  id: string;
  icon: string;
  iconColor: string;
  accentColor: string;
  title: string;
  body: string;
  badge?: string;
}

const POLICIES: PolicySection[] = [
  {
    id: 'cancellation',
    icon: 'cancel-schedule-send',
    iconColor: '#E74C3C',
    accentColor: 'rgba(231,76,60,0.12)',
    title: 'content.settings.PolicyCenterScreen.policies.0.title',
    badge: 'content.settings.PolicyCenterScreen.policies.0.badge',
    body: 'content.settings.PolicyCenterScreen.policies.0.body',
  },
  {
    id: 'refund',
    icon: 'account-balance-wallet',
    iconColor: colors.gold,
    accentColor: 'rgba(214,168,79,0.10)',
    title: 'content.settings.PolicyCenterScreen.policies.1.title',
    body: 'content.settings.PolicyCenterScreen.policies.1.body',
  },
  {
    id: 'venue',
    icon: 'place',
    iconColor: colors.safetyGreen,
    accentColor: 'rgba(109,214,165,0.10)',
    title: 'content.settings.PolicyCenterScreen.policies.2.title',
    body: 'content.settings.PolicyCenterScreen.policies.2.body',
  },
  {
    id: 'conduct',
    icon: 'verified-user',
    iconColor: '#7B61FF',
    accentColor: 'rgba(123,97,255,0.10)',
    title: 'content.settings.PolicyCenterScreen.policies.3.title',
    body: 'content.settings.PolicyCenterScreen.policies.3.body',
  },
];



































function PolicyCard({ section }: {section: PolicySection;}) {
  const [expanded, setExpanded] = useState(true);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((e) => !e);
  };

  return (
    <View style={[s.card, { borderLeftColor: section.iconColor, borderLeftWidth: 3 }]}>
      <TouchableOpacity style={s.cardHeader} onPress={toggle} activeOpacity={0.8}>
        <View style={[s.iconWrap, { backgroundColor: section.accentColor }]}>
          <Icon name={section.icon as any} size={20} color={section.iconColor} />
        </View>
        <View style={s.cardTitleWrap}>
          <Text style={s.cardTitle}>{i18next.t(section.title)}</Text>
          {section.badge && (
            <View style={[s.badge, { backgroundColor: section.accentColor, borderColor: section.iconColor + '55' }]}>
              <Text style={[s.badgeText, { color: section.iconColor }]}>{i18next.t(section.badge)}</Text>
            </View>
          )}
        </View>
        <Icon name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
        size={22} color={colors.textMuted} />
      </TouchableOpacity>

      {expanded && (
        <View style={s.cardBody}>
          <View style={s.bodyDivider} />
          <Text style={s.bodyText}>{i18next.t(section.body)}</Text>
        </View>
      )}
    </View>
  );

}

export function PolicyCenterScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('settings.policy_center')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Intro banner */}
        <View style={s.introBanner}>
          <Icon name="menu-book" size={18} color={colors.gold} style={{ flexShrink: 0 }} />
          <Text style={s.introText}>
             {t('settings.these_policies_govern_your_activity_on_the_cobuddy_platform_tap_any_section_to_expand_it')} </Text>
        </View>

        {/* Policy sections */}
        {POLICIES.map((section) =>
        <PolicyCard key={section.id} section={section} />
        )}

        {/* Last updated */}
        <View style={s.footer}>
          <Icon name="update" size={13} color={colors.textMuted} />
          <Text style={s.footerText}> {t('settings.last_updated_1_june_2026')} </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default PolicyCenterScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  introBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)', padding: spacing.md, marginBottom: spacing.lg },
  introText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    flex: 1, lineHeight: 19 },
  card: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.md,
    overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center',
    justifyContent: 'center', flexShrink: 0 },
  cardTitleWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  cardTitle: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  badge: { borderRadius: radius.full, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontFamily: fontFamily.interBold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardBody: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  bodyDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.md },
  bodyText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    lineHeight: 21 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center',
    paddingVertical: spacing.md },
  footerText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted }
});