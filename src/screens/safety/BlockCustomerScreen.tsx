/**
* BlockCustomerScreen (CPN-132)
* Block a customer from future bookings.
*/
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useSafetyStore } from '../../store/slices/safetyStore';
import { useTranslation } from "react-i18next";

const BLOCK_REASONS = ["Made me uncomfortable", "Inappropriate behavior", "Harassment", "Repeated cancellations", "Other"] as any[];







const IMPACT_ROWS = [
{ icon: 'person-off', text: 'Customer cannot see your profile' },
{ icon: 'notifications-off', text: 'No future requests from them' },
{ icon: 'verified-user', text: 'Reviewed by CoBuddy team' }];


export function BlockCustomerScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const { customerName = 'Customer' } = route.params ?? {};

  const blockCustomer = useSafetyStore((s) => s.blockCustomer);

  const [reason, setReason] = useState('');
  const [otherText, setOtherText] = useState('');
  const [blocking, setBlocking] = useState(false);

  const initials = customerName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const canBlock = reason.length > 0 && (reason !== 'Other' || otherText.trim().length > 0);

  const handleBlock = () => {
    if (!canBlock || blocking) {return;}
    Alert.alert(
      `Block ${customerName}?`, t("alerts.they_will_no_longer_be_able_to_book_sess"),

      [
      { text: t("alerts.cancel"), style: 'cancel' },
      {
        text: t("alerts.yes_block"), style: 'destructive',
        onPress: () => {
          setBlocking(true);
          blockCustomer(customerName);
          navigation.canGoBack() ? navigation.goBack() : undefined;
        }
      }]

    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('safety.block_customer')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Customer card */}
        <View style={s.customerCard}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials || 'C'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.customerName}>{customerName}</Text>
            <Text style={s.customerPhone}>{t("content.safety.BlockCustomerScreen.91")}</Text>
          </View>
        </View>

        {/* Warning card */}
        <View style={s.warningCard}>
          <Icon name="block" size={22} color='#E74C3C' style={{ flexShrink: 0 }} />
          <Text style={s.warningText}>
             {t('safety.blocking_this_customer_will_prevent_future_bookings_existing_sessions_will_not_be_affected')} </Text>
        </View>

        {/* Reason pills */}
        <Text style={s.sectionLabel}> {t('safety.reason_for_blocking')} </Text>
        <View style={s.pillsWrap}>
          {BLOCK_REASONS.map((r) =>
          <TouchableOpacity accessibilityRole="button" key={r}
          style={[s.pill, reason === r && s.pillActive]}
          onPress={() => setReason(r)} activeOpacity={0.75}>
              <Text style={[s.pillText, reason === r && s.pillTextActive]}>{r}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Other text input */}
        {reason === 'Other' &&
        <TextInput
          style={s.otherInput}
          value={otherText}
          onChangeText={setOtherText}
          placeholder={t('safety.please_describe_the_reason')}
          placeholderTextColor={colors.textMuted}
          multiline
          selectionColor={colors.gold}
          textAlignVertical="top" />

        }

        {/* Impact list */}
        <Text style={[s.sectionLabel, { marginTop: spacing.md }]}> {t('safety.what_happens_when_you_block')} </Text>
        <View style={s.impactCard}>
          {IMPACT_ROWS.map((row, i) =>
          <View key={t(row.text)}>
              <View style={s.impactRow}>
                <Icon name={row.icon as any} size={18} color={colors.textMuted} />
                <Text style={s.impactText}>{t(row.text)}</Text>
              </View>
              {i < IMPACT_ROWS.length - 1 && <View style={s.impactDivider} />}
            </View>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Actions */}
      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button"
          style={[s.btnBlock, (!canBlock || blocking) && s.btnDisabled]}
          onPress={handleBlock} disabled={!canBlock || blocking} activeOpacity={0.85}>
          <Icon name="block" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={s.btnBlockText}>{blocking ? t("content.safety.BlockCustomerScreen.blocking") : t("content.safety.BlockCustomerScreen.block_customer")}</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" style={s.btnCancel}
        onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
        activeOpacity={0.75}>
          <Text style={s.btnCancelText}>{t('common.cancel')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default BlockCustomerScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  customerCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderRadius: radius.xl, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.md },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(214,168,79,0.12)',
    borderWidth: 2, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontFamily: fontFamily.interBold, fontSize: 18, color: colors.gold },
  customerName: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary, marginBottom: 2 },
  customerPhone: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  warningCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    backgroundColor: 'rgba(231,76,60,0.07)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(231,76,60,0.22)',
    padding: spacing.md, marginBottom: spacing.lg },
  warningText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: '#E88', flex: 1, lineHeight: 20 },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  pillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  pill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.cardSurface },
  pillActive: { borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.10)' },
  pillText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textMuted },
  pillTextActive: { color: colors.gold },
  otherInput: { backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)',
    padding: spacing.md, minHeight: 90, marginBottom: spacing.md,
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary },
  impactCard: { backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: spacing.md },
  impactRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  impactText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1 },
  impactDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', gap: spacing.sm },
  btnBlock: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: '#C0392B' },
  btnDisabled: { opacity: 0.45 },
  btnBlockText: { fontFamily: fontFamily.interBold, fontSize: 15, color: '#fff' },
  btnCancel: { height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)' },
  btnCancelText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textSecondary }
});