import i18next from 'i18next';
/**
 * BadgesAchievementsScreen (CPN-161)
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTrustStore } from '../../store/slices/trustStore';
import { useTranslation } from "react-i18next";

interface Badge {
  id: string;
  icon: string;
  name: string;
  sub: string;
  unlocked: boolean;
  requirement?: string;
}

// All badges defined with stable IDs — unlocked state is resolved at runtime from trustStore
const ALL_BADGES: Badge[] = [
{ id: 'badge_safety', icon: 'shield', name: 'Safety Certified', sub: 'Passed safety quiz', unlocked: true },
{ id: 'badge_top_rated', icon: 'star', name: 'Top Rated 2026', sub: '4.9★ avg over 50 sessions', unlocked: true },
{ id: 'badge_100_sessions', icon: 'local-fire-department', name: '100+ Sessions', sub: 'Completed 100 sessions', unlocked: true },
{ id: 'badge_elite', icon: 'workspace-premium', name: 'Elite Companion', sub: 'Trust score reaches 100', unlocked: false, requirement: 'Score 100' },
{ id: 'badge_community', icon: 'emoji-events', name: 'Community Hero', sub: 'Requires 50 five-star reviews', unlocked: false, requirement: '50 reviews' },
{ id: 'badge_identity', icon: 'verified', name: 'Identity Plus', sub: 'Link all social accounts', unlocked: false, requirement: 'Link profiles' }];


const BadgeCard: React.FC<{badge: Badge;}> = ({ badge }) =>
<View style={[bc.card, badge.unlocked ? bc.cardUnlocked : bc.cardLocked]}>
    {/* Icon area */}
    <View style={[bc.iconWrap, badge.unlocked ? bc.iconWrapUnlocked : bc.iconWrapLocked]}>
      <Icon name={badge.icon as any} size={30}
    color={badge.unlocked ? colors.gold : colors.textMuted} />
      {badge.unlocked && <View style={bc.glowDot} />}
    </View>

    <Text style={[bc.name, !badge.unlocked && bc.nameLocked]}>{badge.name}</Text>
    <Text style={bc.sub}>{i18next.t(badge.sub)}</Text>

    {/* Locked overlay badge */}
    {!badge.unlocked &&
  <View style={bc.lockBadge}>
        <Icon name="lock" size={10} color={colors.textMuted} />
        <Text style={bc.lockText}>{badge.requirement}</Text>
      </View>
  }
  </View>;


const bc = StyleSheet.create({
  card: { width: '48%', borderRadius: radius.xl, padding: spacing.md,
    alignItems: 'center', marginBottom: spacing.sm, gap: 6 },
  cardUnlocked: { backgroundColor: '#1A2D45',
    borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.40)' },
  cardLocked: { backgroundColor: colors.cardSurface,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  iconWrap: { width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center', position: 'relative' },
  iconWrapUnlocked: { backgroundColor: 'rgba(214,168,79,0.15)',
    borderWidth: 2, borderColor: 'rgba(214,168,79,0.50)' },
  iconWrapLocked: { backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  glowDot: { position: 'absolute', top: 6, right: 6,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.gold, opacity: 0.7 },
  name: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textPrimary,
    textAlign: 'center' },
  nameLocked: { color: colors.textMuted },
  sub: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted,
    textAlign: 'center', lineHeight: 15 },
  lockBadge: { flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8, paddingVertical: 3 },
  lockText: { fontFamily: fontFamily.interRegular, fontSize: 10, color: colors.textMuted }
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export function BadgesAchievementsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const storeUnlocked = useTrustStore((s) => s.unlockedBadges);

  // Merge static definitions with store's runtime unlocked list
  const badges = ALL_BADGES.map((b) => ({ ...b, unlocked: storeUnlocked.includes(b.id) }));
  const unlocked = badges.filter((b) => b.unlocked);
  const locked = badges.filter((b) => !b.unlocked);

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('profile.badges_achievements')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Summary strip */}
        <View style={s.summaryStrip}>
          <Icon name="military-tech" size={20} color={colors.gold} />
          <Text style={s.summaryText}>
            <Text style={s.summaryBold}>{unlocked.length}</Text>  {t('profile.of')} {ALL_BADGES.length}  {t('profile.badges_earned')} </Text>
        </View>

        {/* Unlocked */}
        <Text style={s.sectionLabel}> {t('profile.earned_badges')} </Text>
        <View style={s.grid}>
          {unlocked.map((b) => <BadgeCard key={b.id} badge={b} />)}
        </View>

        {/* Locked */}
        <Text style={[s.sectionLabel, { marginTop: spacing.sm }]}> {t('profile.locked_badges')} </Text>
        <View style={s.grid}>
          {locked.map((b) => <BadgeCard key={b.id} badge={b} />)}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default BadgesAchievementsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  summaryStrip: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.08)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    padding: spacing.md, marginBottom: spacing.lg },
  summaryText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary },
  summaryBold: { fontFamily: fontFamily.interBold, color: colors.gold },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
});