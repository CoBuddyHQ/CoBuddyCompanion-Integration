import i18next from "i18next";import { useTranslation } from 'react-i18next';
/**
 * CPN-086 — Booking Reject Reason Screen
 * Companion selects a reason before declining a booking request.
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, StatusBar, ActivityIndicator } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackScreenProps } from '@react-navigation/stack';

import AppHeader from '../../components/layout/AppHeader';
import { useRequestStore } from '../../store/slices/requestStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import type { RequestsStackParamList } from '../../types/navigation.types';

type Props = StackScreenProps<RequestsStackParamList, typeof Routes.BOOKING_REJECT_REASON>;

const REASONS = ["Schedule conflict / Unavailable", "Location is too far", "Not comfortable with activity type", "Customer profile seems incomplete", "Other"] as any[];







export function BookingRejectReasonScreen({ route, navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const { requestId } = route.params;
  const updateRequestStatus = useRequestStore((s) => s.updateRequestStatus);
  const request = useRequestStore(
    (s) => s.pendingRequests.find((r) => r.requestId === requestId) ?? null
  );

  const [selected, setSelected] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');
  const [loading, setLoading] = useState(false);

  const canDecline = selected !== null && !loading && (
  selected !== 'Other' || otherText.trim().length > 0);

  const handleDecline = () => {
    if (!canDecline) {return;}
    setLoading(true);
    setTimeout(() => {
      updateRequestStatus(requestId, 'declined');
      setLoading(false);
      navigation.replace(Routes.BOOKING_DECLINED_SUCCESS, { requestId });
    }, 1000);
  };

  if (!request) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
        <AppHeader title={t("application.decline_request")} showBack />
        <View style={styles.centeredMsg}>
          <Icon name="search-off" size={44} color={colors.textMuted} />
          <Text style={styles.centeredTitle}>{t("application.request_not_found")}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>{t("application.go_back")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>);

  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t("application.decline_request")} showBack />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── Heading ── */}
        <Text style={styles.heading}>{t("application.why_are_you_declining_this_request")}</Text>
        <Text style={styles.subheading}>{t("application.please_select_a_reason_this_helps_us_mat")}

        </Text>

        {/* ── Reason options ── */}
        <View style={styles.optionsList}>
          {REASONS.map((reason) => {
            const isSelected = selected === reason;
            return (
              <TouchableOpacity
                key={reason}
                style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                onPress={() => setSelected(reason)}
                activeOpacity={0.75}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {reason}
                </Text>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>);

          })}
        </View>

        {/* ── Other text input ── */}
        {selected === 'Other' &&
        <View style={styles.otherWrap}>
            <Text style={styles.otherLabel}>{t("application.additional_details_required")}</Text>
            <TextInput
            style={styles.otherInput}
            value={otherText}
            onChangeText={setOtherText}
            placeholder={t("application.describe_your_reason")}
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={200}
            textAlignVertical="top"
            accessibilityLabel={t("accessibility.other_reason_details")} />
          
            <Text style={styles.charCount}>{otherText.length}/200</Text>
          </View>
        }

        {/* ── Warning banner ── */}
        <View style={styles.warningBanner}>
          <Icon name="warning" size={15} color={colors.softWarning} style={{ flexShrink: 0 }} />
          <Text style={styles.warningText}>{t("application.declining_too_many_requests_may_affect_y")}

          </Text>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Sticky footer ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnDecline, !canDecline && styles.btnDisabled]}
          onPress={handleDecline}
          disabled={!canDecline}
          activeOpacity={0.8}
          accessibilityLabel={t("accessibility.confirm_decline")}>
          {loading ?
          <ActivityIndicator size="small" color={colors.white} /> :

          <>
              <Icon name="close" size={18}
            color={canDecline ? colors.white : colors.textMuted}
            style={{ marginRight: 8 }} />
              <Text style={[styles.btnDeclineText, !canDecline && styles.btnDisabledText]}>{t("application.confirm_decline")}

            </Text>
            </>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}

export default BookingRejectReasonScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: 24 },

  heading: {
    fontFamily: fontFamily.playfairSemiBold,
    fontSize: 20, color: colors.gold, marginBottom: spacing.sm
  },
  subheading: {
    fontFamily: fontFamily.interRegular,
    fontSize: 14, color: colors.textMuted, lineHeight: 20, marginBottom: spacing.xl
  },

  optionsList: { gap: spacing.sm },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.cardSurface,
    borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)'
  },
  optionRowSelected: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(214,168,79,0.07)'
  },
  optionText: {
    fontFamily: fontFamily.interRegular,
    fontSize: 14, color: colors.textSecondary, flex: 1
  },
  optionTextSelected: {
    fontFamily: fontFamily.interSemiBold, color: colors.textPrimary
  },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: spacing.md, flexShrink: 0
  },
  radioOuterSelected: { borderColor: colors.gold },
  radioInner: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: colors.gold
  },

  otherWrap: { marginTop: spacing.md },
  otherLabel: {
    fontFamily: fontFamily.interMedium,
    fontSize: 13, color: colors.textSecondary, marginBottom: spacing.sm
  },
  otherInput: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, minHeight: 96,
    fontFamily: fontFamily.interRegular, fontSize: 14,
    color: colors.textPrimary, lineHeight: 20
  },
  charCount: {
    fontFamily: fontFamily.interRegular,
    fontSize: 11, color: colors.textMuted,
    textAlign: 'right', marginTop: 4
  },

  warningBanner: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: 'rgba(217,108,108,0.10)',
    borderWidth: 1, borderColor: 'rgba(217,108,108,0.28)',
    borderRadius: radius.md, padding: spacing.md,
    marginTop: spacing.xl, gap: spacing.sm
  },
  warningText: {
    fontFamily: fontFamily.interRegular,
    fontSize: 13, color: colors.softWarning, lineHeight: 19, flex: 1
  },

  footer: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  btnDecline: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.softWarning
  },
  btnDeclineText: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.white },
  btnDisabled: { backgroundColor: colors.elevatedSurface },
  btnDisabledText: { color: colors.textMuted },

  centeredMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  centeredTitle: { fontFamily: fontFamily.interBold, fontSize: 18, color: colors.textPrimary, marginTop: spacing.md },
  backBtn: { marginTop: spacing.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  backBtnText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary }
});