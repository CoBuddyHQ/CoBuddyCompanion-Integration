import i18next from "i18next";
import { useTranslation } from 'react-i18next';
/**
* CPN-036 — Government ID Type Selection Screen
* Phase 4B Visual Consistency Polish
*
* Visual system: matches CPN-021 to CPN-032
*   - ScreenTopBar (shared, consistent) — same as CPN-033/034/035
*   - ApplicationPhaseProgress: "Financial Setup"
*   - Hero circle: 88×88, cardSurface bg, colors.border, gold glow, 44px icon
*   - Headline: textStyles.displayMd (Playfair SemiBold), centered
*   - Cards: GlassCard
*   - ID selection: 4 radio rows inside GlassCard — gold accent on selected
*   - Supporting info: GlassCard items (keep document ready, private & protected)
*   - Primary CTA: ActionButton variant="primary" in unified ctaWrap footer
*   - Secondary: ActionButton variant="ghost"
*
* AMBER REMOVED: CPN-036 now uses the same gold accent as CPN-033/034/035.
*
* BUSINESS LOGIC PRESERVED (unchanged):
*   - setSelectedIdType(idType) from applicationStore
*   - navigation.navigate(GOVERNMENT_ID_UPLOAD, {idType: option.label})
*   - Aadhaar default selected, Recommended badge retained
*   - navigation CPN-036 → CPN-037
*/

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { useApplicationStore } from '../../store/slices/applicationStore';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.GOVERNMENT_ID_TYPE>;
const ID_OPTIONS = [{
  id: 'aadhaar',
  icon: 'badge',
  label: i18next.t("content.application.GovernmentIDTypeScreen.aadhaar_card"),
  description: i18next.t("content.application.GovernmentIDTypeScreen.use_aadhaar_as_your_primary_identity_doc"),
  recommended: true
}, {
  id: 'driving',
  icon: 'directions-car',
  label: i18next.t("content.application.GovernmentIDTypeScreen.driving_licence"),
  description: i18next.t("content.application.GovernmentIDTypeScreen.use_a_valid_indian_driving_licence"),
  recommended: false
}, {
  id: 'voter',
  icon: 'how-to-vote',
  label: i18next.t("content.application.GovernmentIDTypeScreen.voter_id"),
  description: i18next.t("content.application.GovernmentIDTypeScreen.use_your_election_commission_voter_ident"),
  recommended: false
}, {
  id: 'passport',
  icon: 'flight',
  label: i18next.t("content.application.GovernmentIDTypeScreen.passport"),
  description: i18next.t("content.application.GovernmentIDTypeScreen.use_a_valid_passport_for_identity_verifi"),
  recommended: false
}] as const;
type IDOptionId = typeof ID_OPTIONS[number]['id'];
export function GovernmentIDTypeScreen({
  navigation
}: Props): React.JSX.Element {
  const {
    t
  } = useTranslation();
  const {
    setSelectedIdType
  } = useApplicationStore();
  const [selectedId, setSelectedId] = useState<IDOptionId>('aadhaar');
  const handleContinue = useCallback(() => {
    const option = ID_OPTIONS.find((o) => o.id === selectedId);
    if (!option) {
      return;
    }
    setSelectedIdType(selectedId);
    navigation.navigate(Routes.GOVERNMENT_ID_UPLOAD, {
      idType: option.label
    });
  }, [selectedId, setSelectedIdType, navigation]);
  return <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />
      

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.GovernmentIDTypeContent.SECTION_BADGE")}</Text>
        </View>

        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="badge" size={44} color={colors.gold} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="verified-user" size={16} color={colors.gold} />
          </View>
        </View>

        {/* ── Headline ── */}
        <Text style={styles.headline}>{t("content.application_kyc.GovernmentIDTypeContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.GovernmentIDTypeContent.SUBHEADLINE")}</Text>

        {/* ── ID Selection Card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.GovernmentIDTypeContent.SELECT_TITLE").toUpperCase()}</Text>
          <Text style={styles.cardBody}>{t("content.application_kyc.GovernmentIDTypeContent.SELECT_SUBTITLE")}</Text>
          <View style={styles.radioGroup} accessibilityRole="radiogroup">
            {ID_OPTIONS.map((option) => {
            const isSelected = selectedId === option.id;
            return <TouchableOpacity key={option.id} style={[styles.radioRow, isSelected && styles.radioRowSelected]} onPress={() => setSelectedId(option.id)} accessibilityRole="radio" accessibilityState={{
              selected: isSelected
            }}>
                  {/* Radio indicator */}
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSel]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>

                  {/* Document type icon */}
                  <View style={[styles.docIconWrap, isSelected && styles.docIconWrapSelected]}>
                    <Icon name={option.icon as any} size={spacing.iconMd} color={isSelected ? colors.gold : colors.textMuted} />
                    
                  </View>

                  {/* Label + description + Recommended badge */}
                  <View style={styles.radioContent}>
                    <View style={styles.radioLabelRow}>
                      <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>
                        {t(option.label)}
                      </Text>
                      {option.recommended && <View style={styles.recommendedBadge}>
                          <Text style={styles.recommendedText}>{t("application.recommended")}</Text>
                        </View>}
                    </View>
                    <Text style={styles.radioDescription}>{t(option.description)}</Text>
                  </View>
                </TouchableOpacity>;
          })}
          </View>
        </GlassCard>

        {/* ── Supporting Info Cards ── */}
        <GlassCard style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Icon name="photo-camera" size={spacing.iconMd} color={colors.gold} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>{t("application.keep_your_document_ready")}</Text>
              <Text style={styles.infoBody}>{t("content.application_kyc.GovernmentIDTypeContent.PROMPT_NOTE")}</Text>
            </View>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Icon name="lock" size={spacing.iconMd} color={colors.gold} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>{t("application.private_and_protected")}</Text>
              <Text style={styles.infoBody}>{t("content.application_kyc.GovernmentIDTypeContent.PRIVACY_NOTE")}</Text>
            </View>
          </View>
        </GlassCard>

        {/* ── Verified Note ── */}
        <View style={styles.verifiedNote}>
          <Icon name="verified" size={14} color={colors.textMuted} />
          <Text style={styles.verifiedNoteText}>{t("content.application_kyc.GovernmentIDTypeContent.VERIFIED_NOTE")}</Text>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer — same pattern as CPN-033/034/035 ── */}
      <View style={styles.ctaWrap}>
        <ActionButton label={t("content.application_kyc.GovernmentIDTypeContent.CTA_PRIMARY")} onPress={handleContinue} variant="primary" rightIcon={t("application.arrow_forward")} accessibilityLabel={t("accessibility.continue_to_upload_government_id")} />
        
        <ActionButton label={t("content.application_kyc.GovernmentIDTypeContent.CTA_SAVE_LATER")} onPress={() => navigation.goBack()} variant="ghost" style={styles.saveBtn} accessibilityLabel={t("accessibility.save_and_continue_later")} />
        
      </View>
    </SafeAreaView>;
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.rootBg
  },
  scroll: {
    flex: 1
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg
  },
  // Hero — identical to CPN-021 to CPN-035
  heroWrap: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: spacing.sm
  },
  heroCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6
  },
  heroBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  // Headline — identical to CPN-021 to CPN-035
  headline: {
    ...textStyles.displayMd,
    color: colors.textPrimary,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-SemiBold'
  },
  subheadline: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center'
  },
  // Cards
  card: {
    gap: spacing.md
  },
  cardTitle: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },
  cardBody: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    lineHeight: 20
  },
  // Radio group
  radioGroup: {
    gap: spacing.sm
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSurface,
    backgroundColor: colors.elevatedSurface
  },
  radioRowSelected: {
    borderColor: colors.border,
    backgroundColor: colors.goldSubtle
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  radioCircleSel: {
    borderColor: colors.gold
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gold
  },
  // Doc icon
  docIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.borderSurface,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  docIconWrapSelected: {
    backgroundColor: colors.goldSubtle,
    borderColor: colors.border
  },
  // Radio content
  radioContent: {
    flex: 1
  },
  radioLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap'
  },
  radioLabel: {
    ...textStyles.labelMd,
    color: colors.textPrimary
  },
  radioLabelSelected: {
    color: colors.gold
  },
  radioDescription: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18
  },
  recommendedBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1,
    borderColor: colors.border
  },
  recommendedText: {
    ...textStyles.labelXs,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  // Supporting info card rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  infoText: {
    flex: 1
  },
  infoTitle: {
    ...textStyles.labelMd,
    color: colors.textPrimary,
    marginBottom: 2
  },
  infoBody: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    lineHeight: 18
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.borderSurface,
    marginVertical: spacing.sm
  },
  // Verified note
  verifiedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'center'
  },
  verifiedNoteText: {
    ...textStyles.labelSm,
    color: colors.textMuted
  },
  bottomPad: {
    height: spacing.xl
  },
  // CTA footer — identical to CPN-033/034/035
  ctaWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.xs
  },
  saveBtn: {
    marginTop: spacing.xs
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'center',
    backgroundColor: colors.goldSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.huge,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    marginBottom: spacing.xl
  },
  phaseBadgeText: {
    ...textStyles.capsSm,
    color: colors.gold,
    letterSpacing: 1
  }
});