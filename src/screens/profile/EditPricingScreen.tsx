/**
 * EditPricingScreen (CPN-140)
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useProfileStore } from '../../store/slices/profileStore';
import { useTranslation } from "react-i18next";
import { AdminConfig } from '../../config/adminValues';
import { RUPEE } from '../../utils/currency';

export function EditPricingScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  const [rateText, setRateText] = useState(
    profile?.hourlyRate ? String(profile.hourlyRate) : '500'
  );
  const [focused, setFocused] = useState(false);

  const rate = parseFloat(rateText) || 0;
  const fee = Math.round(rate * (AdminConfig.commission.platformFeePercentage / 100));
  const earnings = rate - fee;

  const handleSave = () => {
    if (rate > 0) {updateProfile({ hourlyRate: rate });}
    navigation.canGoBack() ? navigation.goBack() : undefined;
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <View style={s.header}>
        <TouchableOpacity accessibilityRole="button" onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
        style={s.hBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.hTitle}> {t('profile.hourly_rate')} </Text>
        <TouchableOpacity accessibilityRole="button" onPress={handleSave} style={s.hBtn}>
          <Text style={s.saveText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={[s.rateWrap, focused && s.rateWrapFocused]}>
            <Text style={s.prefix}>{t("content.profile.EditPricingScreen.text")}</Text>
            <TextInput style={s.rateInput} value={rateText}
            onChangeText={(t) => setRateText(t.replace(/[^0-9]/g, '').slice(0, 5))}
            keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textMuted}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            selectionColor={colors.gold} maxLength={5} />
            <Text style={s.suffix}> {t('profile.hr')} </Text>
          </View>
          <View style={s.strip}>
            <Icon name="info-outline" size={13} color={colors.gold} />
            <Text style={s.stripText}> {t('profile.recommended_for_your_city_300_800')} </Text>
          </View>
          <View style={s.quickRow}>
            {[300, 400, 500, 600, 800].map((v) =>
            <TouchableOpacity accessibilityRole="button" key={v} style={[s.qPill, rateText === String(v) && s.qPillActive]}
            onPress={() => setRateText(String(v))} activeOpacity={0.75}>
                <Text style={[s.qText, rateText === String(v) && s.qTextActive]}>{t("content.profile.EditPricingScreen.text")}{v}</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={s.secLabel}> {t('profile.earnings_breakdown')} </Text>
          <View style={s.card}>
            <View style={s.row}><Text style={s.key}> {t('profile.you_charge')} </Text><Text style={s.val}>{RUPEE}{rate.toLocaleString('en-IN')} {t('profile.hr')} </Text></View>
            <View style={s.row}><Text style={s.key}> {t('profile.platform_fee')} ({AdminConfig.commission.platformFeePercentage}%) </Text><Text style={[s.val, { color: '#E74C3C' }]}>-{RUPEE}{fee.toLocaleString('en-IN')}</Text></View>
            <View style={s.divider} />
            <View style={s.row}>
              <Text style={[s.key, { fontFamily: fontFamily.interBold, color: colors.textPrimary }]}> {t('profile.you_earn')} </Text>
              <Text style={[s.val, { color: colors.safetyGreen, fontSize: 18 }]}>{RUPEE}{earnings.toLocaleString('en-IN')} {t('profile.hr')} </Text>
            </View>
          </View>

          <Text style={[s.secLabel, { marginTop: spacing.lg }]}> {t('profile.category_rates') || "CATEGORY RATES (PER HOUR)"} </Text>
          <View style={s.card}>
            {Object.entries(AdminConfig.categoryPriceMultipliers).map(([category, multiplier], idx, arr) => {
              const categoryRate = Math.round(rate * multiplier);
              return (
                <View key={category}>
                  <View style={s.row}>
                    <Text style={[s.key, { textTransform: 'capitalize' }]}>{category.replace('_', ' ')}</Text>
                    <Text style={s.val}>{RUPEE}{categoryRate.toLocaleString('en-IN')}</Text>
                  </View>
                  {idx < arr.length - 1 && <View style={s.divider} />}
                </View>
              );
            })}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>);

}
export default EditPricingScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  hBtn: { minWidth: 48, alignItems: 'center' },
  hTitle: { fontFamily: fontFamily.interBold, fontSize: 17, color: colors.textPrimary },
  saveText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  rateWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#0D1525', borderRadius: radius.xl,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.08)', padding: spacing.lg, marginBottom: spacing.sm },
  rateWrapFocused: { borderColor: colors.gold },
  prefix: { fontFamily: fontFamily.playfairBold, fontSize: 36, color: colors.gold, marginRight: 4 },
  rateInput: { fontFamily: fontFamily.playfairBold, fontSize: 48, color: colors.textPrimary,
    minWidth: 120, textAlign: 'center', padding: 0 },
  suffix: { fontFamily: fontFamily.interRegular, fontSize: 20, color: colors.textMuted,
    marginLeft: 6, alignSelf: 'flex-end', paddingBottom: 6 },
  strip: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: spacing.lg },
  stripText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.xl },
  qPill: { backgroundColor: colors.cardSurface, borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 8 },
  qPillActive: { backgroundColor: 'rgba(214,168,79,0.12)', borderColor: colors.gold },
  qText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textSecondary },
  qTextActive: { color: colors.gold },
  secLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  card: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: spacing.lg, gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  key: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary },
  val: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginVertical: 4 }
});