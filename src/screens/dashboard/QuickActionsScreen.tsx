/**
 * QuickActionsScreen (CPN-063)
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
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

interface Action {
  icon: string;
  label: string;
  sub: string;
  color: string;
  bg: string;
  onPress: () => void;
}

export function QuickActionsScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const nav = useNavigation<any>();

  const ACTIONS: Action[] = [
    {
      icon: 'calendar-month',
      label: 'content.dashboard.QuickActionsScreen.actions.0.label',
      sub: 'content.dashboard.QuickActionsScreen.actions.0.sub',
      color: colors.gold,
      bg: 'rgba(214,168,79,0.12)',
      onPress: () => nav.navigate(Routes.AVAILABILITY_CALENDAR),
    },
    {
      icon: 'payments',
      label: 'content.dashboard.QuickActionsScreen.actions.1.label',
      sub: 'content.dashboard.QuickActionsScreen.actions.1.sub',
      color: colors.safetyGreen,
      bg: 'rgba(109,214,165,0.10)',
      onPress: () => nav.navigate(Routes.PAYOUT_REQUEST),
    },
    {
      icon: 'support-agent',
      label: 'content.dashboard.QuickActionsScreen.actions.2.label',
      sub: 'content.dashboard.QuickActionsScreen.actions.2.sub',
      color: '#74B9FF',
      bg: 'rgba(116,185,255,0.10)',
      onPress: () => nav.navigate(Routes.CREATE_SUPPORT_TICKET),
    },
    {
      icon: 'person',
      label: 'content.dashboard.QuickActionsScreen.actions.3.label',
      sub: 'content.dashboard.QuickActionsScreen.actions.3.sub',
      color: '#A29BFE',
      bg: 'rgba(162,155,254,0.10)',
      onPress: () => nav.navigate('GlobalProfileStack', { screen: Routes.COMPANION_PROFILE }),
    },
    {
      icon: 'bar-chart',
      label: 'content.dashboard.QuickActionsScreen.actions.4.label',
      sub: 'content.dashboard.QuickActionsScreen.actions.4.sub',
      color: '#FD79A8',
      bg: 'rgba(253,121,168,0.10)',
      onPress: () => nav.navigate(Routes.PERFORMANCE_INSIGHTS),
    },
    {
      icon: 'notifications',
      label: 'content.dashboard.QuickActionsScreen.actions.5.label',
      sub: 'content.dashboard.QuickActionsScreen.actions.5.sub',
      color: '#FDCB6E',
      bg: 'rgba(253,203,110,0.10)',
      onPress: () => nav.navigate(Routes.NOTIFICATION_CENTER),
    },
  ];


















































  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('dashboard.quick_actions')} showBack
      onBackPress={() => nav.canGoBack() ? nav.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.subtitle}> {t('dashboard.jump_straight_to_what_you_need')} </Text>

        <View style={s.grid}>
          {ACTIONS.map((a) =>
          <TouchableOpacity key={t(a.label)} style={s.card} onPress={a.onPress} activeOpacity={0.8}>
              <View style={[s.iconCircle, { backgroundColor: a.bg }]}>
                <Icon name={a.icon as any} size={28} color={a.color} />
              </View>
              <Text style={s.cardLabel}>{t(a.label)}</Text>
              <Text style={s.cardSub}>{t(a.sub)}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default QuickActionsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted,
    marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  card: { width: '48%', backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.lg, alignItems: 'center', gap: spacing.sm },
  iconCircle: { width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center' },
  cardLabel: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textPrimary, textAlign: 'center' },
  cardSub: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, textAlign: 'center' }
});