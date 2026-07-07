import { useTranslation } from 'react-i18next';
/**
 * CustomerTrustSnapshotScreen (CPN-083)
 * Now reads requestId from route.params, resolves customer from requestStore.
 * handleAccept calls updateRequestStatus(requestId, 'accepted') and navigates to
 * BOOKING_ACCEPTED_SUCCESS — no more fake Alert.
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, ActivityIndicator } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useRequestStore } from '../../store/slices/requestStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';

// ─── Sub-components ───────────────────────────────────────────────────────────

const StarRow: React.FC<{score: number;}> = ({ score }) =>
<View style={s.starRow}>
    {[1, 2, 3, 4, 5].map((i) =>
  <Icon
    key={i}
    name={i <= Math.floor(score) ? 'star' : i - score < 1 ? 'star-half' : 'star-border'}
    size={22}
    color={colors.gold} />

  )}
    <Text style={s.scoreText}>{score.toFixed(1)} / 5.0</Text>
  </View>;


const StatBox: React.FC<{icon: string;label: string;value: string;color?: string;}> = ({
  icon, label, value, color
}) =>
<View style={s.statBox}>
    <Icon name={icon as any} size={20} color={color ?? colors.gold} />
    <Text style={s.statValue}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </View>;


const BadgeRow: React.FC<{icon: string;label: string;sublabel: string;}> = ({ icon, label, sublabel }) =>
<View style={s.badgeRow}>
    <View style={s.badgeIcon}>
      <Icon name={icon as any} size={18} color={colors.safetyGreen} />
    </View>
    <View style={s.badgeText}>
      <Text style={s.badgeLabel}>{label}</Text>
      <Text style={s.badgeSub}>{sublabel}</Text>
    </View>
    <Icon name="check-circle" size={18} color={colors.safetyGreen} />
  </View>;


// ─── Screen ───────────────────────────────────────────────────────────────────

export function CustomerTrustSnapshotScreen(): React.JSX.Element {const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const route = useRoute<any>();

  // The detail screen passes requestId (not customerId) so we resolve from request
  const requestId = (route.params?.requestId ?? route.params?.customerId ?? '') as string;

  const request = useRequestStore((s) => s.pendingRequests.find((r) => r.requestId === requestId) ?? null);
  const updateRequestStatus = useRequestStore((s) => s.updateRequestStatus);

  const [loading, setLoading] = React.useState(false);

  // ── Accept — writes to store ─────────────────────────────────────────────────
  const handleAccept = () => {
    if (!requestId || loading) {return;}
    setLoading(true);
    setTimeout(() => {
      updateRequestStatus(requestId, 'accepted');
      setLoading(false);
      navigation.navigate(Routes.BOOKING_ACCEPTED_SUCCESS, { requestId });
    }, 800);
  };

  // ── Not found guard ──────────────────────────────────────────────────────────
  if (!request) {
    return (
      <SafeAreaView style={s.root} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
        <AppHeader title={t("application.customer_profile")} showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
        <View style={s.notFound}>
          <Icon name="person-off" size={48} color={colors.textMuted} />
          <Text style={s.notFoundTitle}>{t("application.customer_not_found")}</Text>
          <Text style={s.notFoundSub}>{t("application.this_request_may_have_expired_or_been_re")}</Text>
          <TouchableOpacity accessibilityRole="button" style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backBtnText}>{t("application.go_back")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>);

  }

  const { customer } = request;
  const starScore = customer.trustScore / 20; // 0–100 → 0–5

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t("application.customer_profile")} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ── Avatar card ── */}
        <View style={s.avatarCard}>
          <View style={s.avatarCircle}>
            <Text style={s.avatarInitials}>{customer.displayInitials}</Text>
          </View>
          <Text style={s.customerName}>{customer.displayInitials}</Text>
          <Text style={s.memberSince}>
            {customer.sessionCountOverall > 0 ?
            `${customer.sessionCountOverall} session${customer.sessionCountOverall > 1 ? 's' : ''} completed` : t("content.requests.CustomerTrustSnapshotScreen.new_to_cobuddy")
            }
          </Text>
          <StarRow score={starScore} />
        </View>

        {/* ── Quick stats ── */}
        <View style={s.statsRow}>
          <StatBox icon="event-available" label={t("application.completed_sessions")}
          value={String(customer.sessionCountOverall)} color={colors.safetyGreen} />
          <View style={s.statsDivider} />
          <StatBox icon="workspace-premium" label={t("application.trust_score")}
          value={`${customer.trustScore}`} color={colors.gold} />
        </View>

        {/* ── Session history strip ── */}
        <View style={s.historyStrip}>
          <Icon name="trending-up" size={14} color={colors.gold} />
          <Text style={s.historyText}>{t("application.this_customer_has_a_trust_score_of")}
            {' '}
            <Text style={s.historyBold}>{customer.trustScore}/100</Text>
            {customer.sessionCountOverall > 0 &&
            <Text>
                {' '}{t("application.and_has_completed")}{' '}
                <Text style={s.historyBold}>{customer.sessionCountOverall}{t("application.sessions")}</Text>
              </Text>
            }.
          </Text>
        </View>

        {/* ── Verification badges ── */}
        <Text style={s.sectionLabel}>{t("application.verifications")}</Text>
        <View style={s.badgesCard}>
          {customer.isVerified &&
          <BadgeRow icon="verified-user" label={t("application.identity_verified")}
          sublabel={t("application.govt_id_confirmed_by_cobuddy")} />
          }
          {customer.isVerified && <View style={s.badgeSep} />}
          {customer.safetyConsent &&
          <BadgeRow icon="shield" label={t("application.safety_consent_signed")}
          sublabel={t("application.agreed_to_cobuddy_code_of_conduct")} />
          }
          {customer.safetyConsent && <View style={s.badgeSep} />}
          <BadgeRow icon="phone-android" label={t("application.verified_phone_number")}
          sublabel={t("application.mobile_number_verified")} />
        </View>

        {/* ── Trust score card ── */}
        <View style={s.trustCard}>
          <Icon name="security" size={20} color={colors.safetyGreen} />
          <View style={s.trustTextWrap}>
            <Text style={s.trustTitle}>{t("application.cobuddy_trust_score")}</Text>
            <Text style={s.trustSub}>{t("application.based_on_history_verifications_and_behav")}</Text>
          </View>
          <View style={s.trustBadge}>
            <Text style={s.trustBadgeText}>{customer.trustScore}</Text>
            <Text style={s.trustBadgeSub}>/ 100</Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Sticky footer ── */}
      <View style={s.footer}>
        <TouchableOpacity accessibilityRole="button"
          style={[s.acceptBtn, loading && { opacity: 0.65 }]}
          onPress={handleAccept}
          disabled={loading}
          activeOpacity={0.85}
          accessibilityLabel={t("accessibility.accept_booking")}>
          {loading ?
          <ActivityIndicator size="small" color={colors.rootBg} style={{ marginRight: 8 }} /> :

          <Icon name="check-circle" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          }
          <Text style={s.acceptBtnText}>{t("application.accept_booking")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default CustomerTrustSnapshotScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  // Not-found
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  notFoundTitle: { fontFamily: fontFamily.interBold, fontSize: 18, color: colors.textPrimary, marginTop: spacing.lg },
  notFoundSub: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 21 },
  backBtn: { marginTop: spacing.xl, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  backBtnText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary },

  // Avatar card
  avatarCard: { alignItems: 'center', backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    padding: spacing.xl, marginBottom: spacing.md },
  avatarCircle: { width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(214,168,79,0.12)', borderWidth: 2, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  avatarInitials: { fontFamily: fontFamily.playfairBold, fontSize: 28, color: colors.gold },
  customerName: { fontFamily: fontFamily.playfairBold, fontSize: 22, color: colors.textPrimary, marginBottom: 3 },
  memberSince: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  scoreText: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.gold, marginLeft: 8 },

  // Stats
  statsRow: { flexDirection: 'row', backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: spacing.sm, overflow: 'hidden' },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg, gap: 4 },
  statValue: { fontFamily: fontFamily.playfairBold, fontSize: 24, color: colors.textPrimary },
  statLabel: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, textAlign: 'center' },
  statsDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginVertical: spacing.md },

  // History strip
  historyStrip: { flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    padding: spacing.md, marginBottom: spacing.md },
  historyText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    flex: 1, lineHeight: 19 },
  historyBold: { fontFamily: fontFamily.interBold, color: colors.gold },

  // Badges
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  badgesCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', marginBottom: spacing.md },
  badgeRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  badgeIcon: { width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(109,214,165,0.10)', borderWidth: 1, borderColor: 'rgba(109,214,165,0.22)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  badgeText: { flex: 1 },
  badgeLabel: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textPrimary },
  badgeSub: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  badgeSep: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md },

  // Trust card
  trustCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: 'rgba(109,214,165,0.06)', borderRadius: radius.xl,
    borderWidth: 1.5, borderColor: 'rgba(109,214,165,0.25)', padding: spacing.md },
  trustTextWrap: { flex: 1 },
  trustTitle: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.safetyGreen },
  trustSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2, lineHeight: 17 },
  trustBadge: { alignItems: 'center', backgroundColor: 'rgba(109,214,165,0.12)',
    borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(109,214,165,0.30)',
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  trustBadgeText: { fontFamily: fontFamily.playfairBold, fontSize: 22, color: colors.safetyGreen },
  trustBadgeSub: { fontFamily: fontFamily.interRegular, fontSize: 10, color: colors.textMuted },

  // Footer
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  acceptBtn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.gold, borderRadius: radius.md },
  acceptBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});