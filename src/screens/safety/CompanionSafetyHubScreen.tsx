/**
 * CompanionSafetyHubScreen
 * Central safety control panel. Accessed from Profile Tab → "Safety Hub".
 */
import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Switch, StyleSheet, StatusBar } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useSafetyStore } from '../../store/slices/safetyStore';
import type { TrustedContact } from '../../store/types/store.types';
import { useTranslation } from "react-i18next";

// ─── Feature toggle row ───────────────────────────────────────────────────────

interface FeatureRowProps {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  last?: boolean;
}

const FeatureRow: React.FC<FeatureRowProps> = ({
  icon, iconColor, iconBg, title, description, value, onValueChange, last
}) => {
  const { t } = useTranslation();
  return (
    <View style={[featureStyles.row, last && featureStyles.rowLast]}>
    <View style={[featureStyles.iconWrap, { backgroundColor: iconBg }]}>
      <Icon name={icon as any} size={19} color={iconColor} />
    </View>
    <View style={featureStyles.mid}>
      <Text style={featureStyles.title}>{title}</Text>
      <Text style={featureStyles.desc}>{description}</Text>
    </View>
    <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.elevatedSurface, true: 'rgba(109,214,165,0.30)' }}
        thumbColor={value ? colors.safetyGreen : colors.border} />
      
  </View>);

};

const featureStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', gap: spacing.md
  },
  rowLast: { borderBottomWidth: 0 },
  iconWrap: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2
  },
  mid: { flex: 1 },
  title: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  desc: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 3, lineHeight: 18 }
});

// ─── Contact row ──────────────────────────────────────────────────────────────

const ContactRow: React.FC<{contact: TrustedContact;onEdit: () => void;last?: boolean;}> = ({
  contact, onEdit, last
}) => {
  const { t } = useTranslation();
  return (
    <View style={[contactStyles.row, last && contactStyles.rowLast]}>
    <View style={contactStyles.avatar}>
      <Text style={contactStyles.avatarText}>
        {contact.name.charAt(0).toUpperCase()}
      </Text>
    </View>
    <View style={contactStyles.mid}>
      <View style={contactStyles.nameRow}>
        <Text style={contactStyles.name}>{contact.name}</Text>
        {contact.isEmergencyContact &&
          <View style={contactStyles.primaryBadge}>
            <Text style={contactStyles.primaryBadgeText}> {t('safety.primary')} </Text>
          </View>
          }
      </View>
      <Text style={contactStyles.relation}>{contact.relationship}{t("content.safety.CompanionSafetyHubScreen.text")}{contact.maskedPhone}</Text>
    </View>
    <TouchableOpacity accessibilityRole="button" onPress={onEdit} style={contactStyles.editBtn}>
      <Icon name="edit" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  </View>);

};

const contactStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', gap: spacing.md
  },
  rowLast: { borderBottomWidth: 0 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1.5, borderColor: 'rgba(109,214,165,0.30)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  avatarText: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.safetyGreen },
  mid: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  name: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  primaryBadge: {
    backgroundColor: 'rgba(109,214,165,0.12)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)',
    paddingHorizontal: 7, paddingVertical: 2
  },
  primaryBadgeText: { fontFamily: fontFamily.interSemiBold, fontSize: 10, color: colors.safetyGreen },
  relation: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  editBtn: { padding: 4 }
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export function CompanionSafetyHubScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  // ── Store — contacts & toggles ──────────────────────────────────────────────
  const contacts = useSafetyStore((s) => s.trustedContacts);
  const locationTracking = useSafetyStore((s) => s.locationTracking);
  const autoCheckIn = useSafetyStore((s) => s.autoCheckIn);
  const disguisedCall = useSafetyStore((s) => s.disguisedCall);
  const toggleSetting = useSafetyStore((s) => s.toggleSetting);
  const fetchTrustedContacts = useSafetyStore((s) => s.fetchTrustedContacts);

  useEffect(() => {
    fetchTrustedContacts();
  }, [fetchTrustedContacts]);

  const handleSOS = () => {

    navigation.navigate(Routes.SOS);
  };

  const handleAddContact = () => {

    navigation.navigate(Routes.ADD_TRUSTED_CONTACT);
  };


  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        title={t('safety.safety_hub')}
        showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════════════
                HERO — PROTECTION STATUS
             ══════════════════════════════════════════ */}
        <View style={styles.heroCard}>
          {/* Glow */}
          <View style={styles.heroGlow} />

          <View style={styles.heroIconRing}>
            <Icon name="shield" size={36} color={colors.safetyGreen} />
          </View>

          <Text style={styles.heroTitle}> {t('safety.you_are_protected')} </Text>
          <Text style={styles.heroSubtitle}>
             {t('safety.cobuddy_s_live_monitoring_and_sos_system_is_active_during_all_your_sessions')} </Text>

          {/* Live indicator */}
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.livePillText}> {t('safety.safety_system_active')} </Text>
          </View>
        </View>

        {/* ══════════════════════════════════════════
                ACTIVE SAFETY FEATURES
             ══════════════════════════════════════════ */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}> {t('safety.active_safety_features')} </Text>

          <FeatureRow
            icon="my-location"
            iconColor={colors.safetyGreen}
            iconBg="rgba(109,214,165,0.12)"
            title={t('safety.live_location_tracking')}
            description={t("content.safety.CompanionSafetyHubScreen.your_location_is_shared_securely_with_ou")}
            value={locationTracking}
            onValueChange={() => toggleSetting('locationTracking')} />
          
          <FeatureRow
            icon="notifications-active"
            iconColor={colors.gold}
            iconBg="rgba(214,168,79,0.12)"
            title={t('safety.auto_check_in_reminders')}
            description={t("content.safety.CompanionSafetyHubScreen.we_will_prompt_you_to_confirm_you_re_saf")}
            value={autoCheckIn}
            onValueChange={() => toggleSetting('autoCheckIn')} />
          
          <FeatureRow
            icon="phone-in-talk"
            iconColor="#8EABFF"
            iconBg="rgba(142,171,255,0.12)"
            title={t('safety.disguised_call_option')}
            description={t("content.safety.CompanionSafetyHubScreen.get_a_fake_incoming_call_to_exit_an_unco")}
            value={disguisedCall}
            onValueChange={() => toggleSetting('disguisedCall')}
            last />
          
        </View>

        {/* ══════════════════════════════════════════
                QUICK ACCESS LINKS
             ══════════════════════════════════════════ */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}> {t('safety.safety_tools')} </Text>
          {[
          { icon: 'timer', label: t("content.safety.CompanionSafetyHubScreen.safety_timer"), route: Routes.SAFETY_TIMER, color: colors.gold },
          { icon: 'contacts', label: t("content.safety.CompanionSafetyHubScreen.trusted_contacts"), route: Routes.TRUSTED_CONTACTS, color: colors.safetyGreen },
          { icon: 'menu-book', label: t("content.safety.CompanionSafetyHubScreen.safety_guidelines"), route: Routes.SAFETY_GUIDELINES, color: '#8EABFF' },
          { icon: 'place', label: t("content.safety.CompanionSafetyHubScreen.public_venue_rules"), route: Routes.PUBLIC_VENUE_RULES, color: colors.textSecondary },
          { icon: 'quiz', label: t("content.safety.CompanionSafetyHubScreen.safety_quiz"), route: Routes.SAFETY_QUIZ, color: colors.gold },
          { icon: 'person-add', label: t("content.safety.CompanionSafetyHubScreen.emergency_contact_setup"), route: Routes.EMERGENCY_CONTACT_SETUP, color: colors.safetyGreen }].
          map((item, i, arr) =>
          <TouchableOpacity accessibilityRole="button"
            key={t(item.label)}
            style={[styles.toolRow, i === arr.length - 1 && styles.toolRowLast]}
            onPress={() => navigation.navigate(item.route)}
            activeOpacity={0.75}>
              <View style={[styles.toolIconWrap, { backgroundColor: `${item.color}18` }]}>
                <Icon name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={styles.toolLabel}>{t(item.label)}</Text>
              <Icon name="chevron-right" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* ══════════════════════════════════════════
                EMERGENCY CONTACTS
             ══════════════════════════════════════════ */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.sectionLabel}> {t('safety.emergency_contacts')} </Text>
            <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate(Routes.TRUSTED_CONTACTS)}>
              <Text style={styles.cardTitleLink}> {t('safety.view_all')} </Text>
            </TouchableOpacity>
          </View>

          {contacts.map((contact: TrustedContact, i: number) =>
          <ContactRow
            key={contact.contactId}
            contact={contact}
            onEdit={() => navigation.navigate(Routes.EDIT_TRUSTED_CONTACT, {
              contactId: contact.contactId,
              name: contact.name,
              phone: contact.maskedPhone,
              relation: contact.relationship,
              isPrimary: contact.isEmergencyContact
            })}
            last={i === contacts.length - 1} />

          )}

          {contacts.length === 0 &&
          <Text style={styles.noContactsNote}> {t('safety.no_emergency_contacts_added_yet')} </Text>
          }

          {/* Add contact button */}
          <TouchableOpacity accessibilityRole="button" style={styles.addContactBtn} onPress={handleAddContact} activeOpacity={0.75}>
            <Icon name="person-add" size={17} color={colors.gold} />
            <Text style={styles.addContactText}> {t('safety.add_emergency_contact')} </Text>
          </TouchableOpacity>
        </View>

        {/* ══════════════════════════════════════════
                INCIDENT REPORT LINK
             ══════════════════════════════════════════ */}
        <TouchableOpacity accessibilityRole="button"
          style={styles.incidentStrip}
          onPress={() => navigation.navigate(Routes.INCIDENT_REPORT)}
          activeOpacity={0.75}>
          <Icon name="report-problem" size={16} color={colors.softWarning} />
          <Text style={styles.incidentText}> {t('safety.report_an_incident_from_a_past_session')} </Text>
          <Icon name="chevron-right" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ══════════════════════════════════════════
                SOS DEMO BUTTON
             ══════════════════════════════════════════ */}
        <View style={styles.sosSection}>
          <TouchableOpacity accessibilityRole="button"
            style={styles.sosBtn}
            onPress={handleSOS}
            activeOpacity={0.8}
            accessibilityLabel={t("accessibility.test_sos_button")}>
            {/* Pulse rings */}
            <View style={styles.sosPulse1} />
            <View style={styles.sosPulse2} />
            <View style={styles.sosInner}>
              <Icon name="sos" size={32} color="#fff" />
              <Text style={styles.sosBtnText}> {t('safety.test_sos')} </Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.sosDisclaimer}>
             {t('safety.in_a_real_emergency_tapping_sos_immediately_alerts_local_authorities_and_cobuddy_support')} </Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>);

}

export default CompanionSafetyHubScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  // Hero card
  heroCard: {
    backgroundColor: 'rgba(109,214,165,0.08)',
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)',
    borderRadius: radius.xxl, padding: spacing.xl,
    alignItems: 'center', marginBottom: spacing.md,
    overflow: 'hidden', position: 'relative'
  },
  heroGlow: {
    position: 'absolute', top: -60, left: '50%', marginLeft: -80,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(109,214,165,0.10)'
  },
  heroIconRing: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: 'rgba(109,214,165,0.14)',
    borderWidth: 2, borderColor: 'rgba(109,214,165,0.35)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md
  },
  heroTitle: {
    fontFamily: fontFamily.playfairBold, fontSize: 22,
    color: colors.safetyGreen, marginBottom: spacing.sm, textAlign: 'center'
  },
  heroSubtitle: {
    fontFamily: fontFamily.interRegular, fontSize: 13,
    color: colors.textSecondary, textAlign: 'center', lineHeight: 20,
    maxWidth: 280, marginBottom: spacing.md
  },
  livePill: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: 'rgba(109,214,165,0.15)',
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(109,214,165,0.28)',
    paddingHorizontal: 14, paddingVertical: 6
  },
  liveDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: colors.safetyGreen
  },
  livePillText: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.safetyGreen },

  // Generic card
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitleLink: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold },
  sectionLabel: {
    fontFamily: fontFamily.interSemiBold, fontSize: 11,
    color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: spacing.sm
  },

  // Tool rows
  toolRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: 11,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  toolRowLast: { borderBottomWidth: 0 },
  toolIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  toolLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary, flex: 1 },

  // Add contact
  addContactBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.35)', borderStyle: 'dashed',
    borderRadius: radius.md, paddingVertical: 12, marginTop: spacing.md
  },
  addContactText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold },

  // Incident strip
  incidentStrip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(217,108,108,0.07)',
    borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(217,108,108,0.18)',
    padding: spacing.md, marginBottom: spacing.md
  },
  incidentText: {
    fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1
  },

  // SOS section
  sosSection: { alignItems: 'center', paddingVertical: spacing.lg },
  sosBtn: {
    width: 140, height: 140, borderRadius: 70,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md, position: 'relative'
  },
  sosPulse1: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(217,108,108,0.15)',
    borderWidth: 1.5, borderColor: 'rgba(217,108,108,0.30)'
  },
  sosPulse2: {
    position: 'absolute', width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(217,108,108,0.18)',
    borderWidth: 1.5, borderColor: 'rgba(217,108,108,0.35)'
  },
  sosInner: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: colors.softWarning,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.softWarning, shadowOpacity: 0.5,
    shadowRadius: 18, shadowOffset: { width: 0, height: 4 }
  },
  sosBtnText: { fontFamily: fontFamily.interBold, fontSize: 11, color: '#fff', marginTop: 2 },
  sosDisclaimer: {
    fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted,
    textAlign: 'center', maxWidth: 280, lineHeight: 18
  },
  noContactsNote: {
    fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted,
    paddingVertical: spacing.md, textAlign: 'center'
  }
});