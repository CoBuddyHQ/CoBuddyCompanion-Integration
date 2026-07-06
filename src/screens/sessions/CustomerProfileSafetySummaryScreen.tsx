/**
 * CPN-101 — Customer Profile Safety Summary Screen
 * Displays the customer's verified safety profile before a session.
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackScreenProps } from '@react-navigation/stack';

import AppHeader from '../../components/layout/AppHeader';
import GlassCard from '../../components/cards/GlassCard';
import { useSessionStore } from '../../store/slices/sessionStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import type { SessionsStackParamList } from '../../types/navigation.types';
import { useTranslation } from "react-i18next";

type Props = StackScreenProps<SessionsStackParamList, typeof Routes.CUSTOMER_PROFILE_SAFETY_SUMMARY>;

export function CustomerProfileSafetySummaryScreen({ route, navigation }: Props): React.JSX.Element {
  const { t } = useTranslation();
  // Route uses customerId param per the type definition
  const customerId: string = route.params?.customerId ?? '';

  // Find the session that has this customer
  const session = useSessionStore((s) =>
  [...s.upcomingSessions, ...(s.activeSession ? [s.activeSession] : []), ...s.sessionHistory].
  find((ses) => ses.customer.customerId === customerId) ?? null
  );

  const customer = session?.customer ?? null;

  const VERIFICATIONS = [{ icon: "badge", label: "content.sessions.CustomerProfileSafetySummaryScreen.verifications.0.label" }, { icon: "face", label: "content.sessions.CustomerProfileSafetySummaryScreen.verifications.1.label" }, { icon: "credit-card", label: "content.sessions.CustomerProfileSafetySummaryScreen.verifications.2.label" }, { icon: "shield", label: "content.sessions.CustomerProfileSafetySummaryScreen.verifications.3.label" }] as any[];






  const showUpRate = customer ? '100%' : '—';
  const incidents = 0;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('sessions.safety_summary')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

        {/* ── Safety header card ── */}
        <View style={styles.safetyHeader}>
          <View style={styles.safetyIconWrap}>
            <Icon name="verified-user" size={32} color={colors.safetyGreen} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.safetyHeaderTitle}> {t('sessions.safety_profile_is_clean')} </Text>
            <Text style={styles.safetyHeaderSub}>
               {t('sessions.no_incidents_or_complaints_on_record_for_this_customer')} </Text>
          </View>
        </View>

        {/* ── Customer identity ── */}
        <GlassCard style={styles.card}>
          <View style={styles.customerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{customer?.displayInitials ?? '?'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.customerName}>{customer?.displayInitials ?? 'Unknown Customer'}</Text>
              <Text style={styles.customerMeta}>{t("content.sessions.CustomerProfileSafetySummaryScreen.text")}
                {customer ? (customer.trustScore / 20).toFixed(1) : '—'}
                {' · '}{customer?.sessionCountOverall ?? 0}  {t('sessions.sessions_completed')} </Text>
            </View>
            {customer?.isVerified &&
            <View style={styles.verifiedBadge}>
                <Icon name="verified" size={13} color={colors.safetyGreen} />
                <Text style={styles.verifiedText}> {t('sessions.verified')} </Text>
              </View>
            }
          </View>
        </GlassCard>

        {/* ── Verification rows ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}> {t('sessions.verification_status')} </Text>
          {VERIFICATIONS.map((v) =>
          <View key={t(v.label)} style={styles.verifyRow}>
              <View style={[styles.verifyIconWrap, v.done && styles.verifyIconDone]}>
                <Icon name={v.icon as any} size={16}
              color={v.done ? colors.safetyGreen : colors.textMuted} />
              </View>
              <Text style={styles.verifyLabel}>{t(v.label)}</Text>
              <View style={[styles.verifyStatus, v.done ? styles.verifyDone : styles.verifyPending]}>
                <Icon name={v.done ? 'check' : 'close'} size={12}
              color={v.done ? colors.safetyGreen : colors.textMuted} />
                <Text style={[styles.verifyStatusText,
              { color: v.done ? colors.safetyGreen : colors.textMuted }]}>
                  {v.done ? t("content.sessions.CustomerProfileSafetySummaryScreen.verified") : t("content.sessions.CustomerProfileSafetySummaryScreen.pending")}
                </Text>
              </View>
            </View>
          )}
        </GlassCard>

        {/* ── Behaviour stats ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}> {t('sessions.past_behaviour')} </Text>
          <View style={styles.statsRow}>
            {[
            { value: String(customer?.sessionCountOverall ?? 0), label: t("content.sessions.CustomerProfileSafetySummaryScreen.sessions_completed") },
            { value: String(incidents), label: t("content.sessions.CustomerProfileSafetySummaryScreen.incidents_reported") },
            { value: showUpRate, label: t("content.sessions.CustomerProfileSafetySummaryScreen.show_up_rate") }].
            map((stat) =>
            <View key={t(stat.label)} style={styles.statCell}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{t(stat.label)}</Text>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── Session history snippet ── */}
        {customer && customer.totalSessionsWithCompanion > 0 &&
        <View style={styles.historyPill}>
            <Icon name="handshake" size={15} color={colors.gold} />
            <Text style={styles.historyPillText}>
               {t('sessions.you_ve_had')} {customer.totalSessionsWithCompanion}  {t('sessions.session')} {customer.totalSessionsWithCompanion > 1 ? 's' : ''}  {t('sessions.with_this_customer_before')} </Text>
          </View>
        }

        {/* ── Disclaimer ── */}
        <View style={styles.disclaimerCard}>
          <Icon name="info" size={15} color={colors.textMuted} style={{ flexShrink: 0 }} />
          <Text style={styles.disclaimerText}>
             {t('sessions.cobuddy_verifies_basic_identity_but_always_trust_your_instincts_use_the')} <Text style={{ fontFamily: fontFamily.interBold, color: colors.softWarning }}> {t('sessions.sos_button')} </Text>  {t('sessions.if_you_feel_unsafe_at_any_point')} </Text>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}
        activeOpacity={0.8} accessibilityLabel={t("accessibility.go_back")}>
          <Icon name="arrow-back" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={styles.btnBackText}> {t('sessions.go_back')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}

export default CustomerProfileSafetySummaryScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 24 },

  safetyHeader: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    backgroundColor: 'rgba(109,214,165,0.10)',
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.28)',
    borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md
  },
  safetyIconWrap: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(109,214,165,0.15)',
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.30)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  safetyHeaderTitle: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.safetyGreen, marginBottom: 4 },
  safetyHeaderSub: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, lineHeight: 18 },

  card: { marginBottom: spacing.md },
  cardTitle: { fontFamily: fontFamily.playfairSemiBold, fontSize: 14, color: colors.gold, marginBottom: spacing.md },

  customerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.elevatedSurface, borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  avatarText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  customerName: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  customerMeta: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.gold, marginTop: 3 },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.safetyGreenSubtle, borderRadius: radius.full,
    paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)'
  },
  verifiedText: { fontFamily: fontFamily.interMedium, fontSize: 11, color: colors.safetyGreen },

  verifyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  verifyIconWrap: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.elevatedSurface, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md
  },
  verifyIconDone: { backgroundColor: 'rgba(109,214,165,0.12)', borderColor: 'rgba(109,214,165,0.30)' },
  verifyLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1 },
  verifyStatus: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full, borderWidth: 1
  },
  verifyDone: { backgroundColor: 'rgba(109,214,165,0.10)', borderColor: 'rgba(109,214,165,0.28)' },
  verifyPending: { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)' },
  verifyStatusText: { fontFamily: fontFamily.interMedium, fontSize: 11 },

  statsRow: { flexDirection: 'row' },
  statCell: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm },
  statValue: { fontFamily: fontFamily.interBold, fontSize: 22, color: colors.gold },
  statLabel: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, textAlign: 'center', lineHeight: 15, marginTop: 3 },

  historyPill: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.08)',
    borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    padding: spacing.md, marginBottom: spacing.md
  },
  historyPillText: { fontFamily: fontFamily.interMedium, fontSize: 13, color: colors.gold, flex: 1 },

  disclaimerCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.cardSurface,
    borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md
  },
  disclaimerText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, lineHeight: 18, flex: 1 },

  footer: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  btnBack: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold
  },
  btnBackText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});