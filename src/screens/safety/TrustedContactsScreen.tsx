/**
 * TrustedContactsScreen (CPN-129)
 * Manage emergency contacts notified during SOS.
 * Contacts are now persisted in useSafetyStore (no more hardcoded INITIAL_CONTACTS).
 */
import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar, Alert } from
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

export function TrustedContactsScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  // ── Store ───────────────────────────────────────────────────────────────────
  const contacts = useSafetyStore((s) => s.trustedContacts);
  const removeContact = useSafetyStore((s) => s.removeContact);

  const handleRemove = (contactId: string, name: string) => {
    Alert.alert(
      `Remove ${name}?`, t("alerts.this_contact_will_no_longer_be_notified"),

      [
      { text: t("alerts.cancel"), style: 'cancel' },
      {
        text: t("alerts.remove_contact_1"), style: 'destructive',
        onPress: () => removeContact(contactId)
      }]

    );
  };

  const handleEdit = (contact: TrustedContact) => {
    navigation.navigate(Routes.EDIT_TRUSTED_CONTACT, {
      contactId: contact.contactId,
      name: contact.name,
      phone: contact.maskedPhone,
      relation: contact.relationship,
      isPrimary: contact.isEmergencyContact
    });
  };

  const renderContact = ({ item }: {item: TrustedContact;}) =>
  <TouchableOpacity accessibilityRole="button"
    style={s.card}
    onLongPress={() => handleRemove(item.contactId, item.name)}
    activeOpacity={0.85}
    delayLongPress={500}
    accessibilityLabel={t("accessibility.trusted_contact", { name: item.name, relationship: item.relationship })}>
      {/* Avatar */}
      <View style={s.avatar}>
        <Text style={s.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>

      {/* Info */}
      <View style={s.info}>
        <View style={s.nameRow}>
          <Text style={s.name}>{item.name}</Text>
          {item.isEmergencyContact &&
        <View style={s.primaryBadge}>
              <Text style={s.primaryBadgeText}> {t('safety.primary')} </Text>
            </View>
        }
        </View>
        <Text style={s.relation}>{item.relationship}</Text>
        <Text style={s.phone}>{item.maskedPhone}</Text>
      </View>

      {/* Edit */}
      <TouchableOpacity accessibilityRole="button" style={s.editBtn} onPress={() => handleEdit(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Icon name="edit" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>;


  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('safety.trusted_contacts')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      {/* Info banner */}
      <View style={s.banner}>
        <Icon name="shield" size={14} color={colors.safetyGreen} />
        <Text style={s.bannerText}>
           {t('safety.these_people_will_be_notified_in_case_of_emergency_during_your_sessions')} </Text>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.contactId}
        renderItem={renderContact}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
        <View style={s.emptyWrap}>
            <Icon name="person-add" size={40} color={colors.textMuted} />
            <Text style={s.emptyText}> {t('safety.no_emergency_contacts_added_yet')} </Text>
            <Text style={s.emptySubText}> {t('safety.add_at_least_one_contact_so_we_can_reach_them_during_an_sos')} </Text>
          </View>
        }
        ListFooterComponent={
        <View style={s.footer}>
            <TouchableOpacity accessibilityRole="button"
            style={s.addBtn}
            onPress={() => navigation.navigate(Routes.ADD_TRUSTED_CONTACT)}
            activeOpacity={0.75}
            accessibilityLabel={t("accessibility.add_new_emergency_contact")}>
              <Icon name="person-add" size={18} color={colors.gold} />
              <Text style={s.addBtnText}> {t('safety.add_new_contact')} </Text>
            </TouchableOpacity>
            <Text style={s.maxNote}> {t('safety.you_can_add_up_to_3_emergency_contacts')} </Text>
          </View>
        } />
      
    </SafeAreaView>);

}
export default TrustedContactsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  banner: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(109,214,165,0.07)', borderRadius: radius.md,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.20)',
    marginHorizontal: spacing.lg, marginTop: spacing.sm, marginBottom: 4,
    padding: spacing.md },
  bannerText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textSecondary, flex: 1, lineHeight: 18 },

  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xl },

  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md, marginBottom: spacing.sm },
  avatar: { width: 50, height: 50, borderRadius: 25, flexShrink: 0,
    backgroundColor: 'rgba(214,168,79,0.12)',
    borderWidth: 2, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fontFamily.interBold, fontSize: 20, color: colors.gold },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  name: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  primaryBadge: { backgroundColor: 'rgba(214,168,79,0.15)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.30)',
    paddingHorizontal: 7, paddingVertical: 2 },
  primaryBadgeText: { fontFamily: fontFamily.interSemiBold, fontSize: 10, color: colors.gold },
  relation: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  phone: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 1 },
  editBtn: { padding: 4 },

  emptyWrap: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  emptyText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textSecondary },
  emptySubText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, textAlign: 'center', maxWidth: 260, lineHeight: 19 },

  footer: { paddingTop: spacing.md },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    height: 52, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.40)',
    backgroundColor: 'rgba(214,168,79,0.06)', marginBottom: spacing.sm },
  addBtnText: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.gold },
  maxNote: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted,
    textAlign: 'center' }
});