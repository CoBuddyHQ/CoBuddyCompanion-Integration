/**
 * DisputeCenterScreen (CPN-172)
 * View and manage booking disputes.
 */
import React, {useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import {colors} from '../../theme/colors';
import {fontFamily} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {radius} from '../../theme/radius';
import {Routes} from '../../navigation/routes';
import {useSupportStore} from '../../store/slices/supportStore';
import { useTranslation } from "react-i18next";

export function DisputeCenterScreen(): React.JSX.Element {
  const { t } = useTranslation();
   
  const navigation = useNavigation<any>();
  const disputes = useSupportStore(s => s.disputes);
  const fetchDisputes = useSupportStore(s => s.fetchDisputes);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);
  
  const activeDisputes = disputes.filter(d => d.status === 'Under Review');
  const pastDisputes = disputes.filter(d => d.status === 'Resolved');

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('support.dispute_center')} showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Info banner */}
        <View style={s.infoBanner}>
          <Icon name="gavel" size={16} color={colors.softWarning} />
          <Text style={s.infoText}>
             {t('support.disputes_are_reviewed_within_5_business_days_keep_all_evidence_ready')} </Text>
        </View>

        {/* Active disputes */}
        <Text style={s.sectionLabel}> {t('support.active_disputes')} </Text>
        {activeDisputes.length === 0 ? (
          <Text style={{color: colors.textMuted, fontFamily: fontFamily.interRegular, fontSize: 13, marginBottom: spacing.md}}> {t('support.no_active_disputes')} </Text>
        ) : (
          activeDisputes.map(d => (
            <TouchableOpacity accessibilityRole="button" key={d.id} style={s.disputeCard}
              onPress={() => navigation.navigate(Routes.DISPUTE_DETAIL, {disputeId: d.id})}
              activeOpacity={0.80}>
              <View style={s.disputeHeader}>
                <Text style={s.disputeTitle}> {t('support.session')} {d.sessionId}</Text>
                <View style={s.statusBadgeAmber}>
                  <Text style={s.statusBadgeAmberText}>{d.status}</Text>
                </View>
              </View>
              <Text style={s.disputeCustomer}> {t('support.customer')} {d.customerName}</Text>
              <View style={s.disputeFooter}>
                <Text style={s.disputeMeta}> {t('support.submitted')} {d.createdAgo}</Text>
                <Icon name="chevron-right" size={18} color={colors.textMuted} />
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Past disputes */}
        <Text style={[s.sectionLabel, {marginTop: spacing.md}]}> {t('support.past_disputes')} </Text>
        {pastDisputes.length === 0 ? (
          <Text style={{color: colors.textMuted, fontFamily: fontFamily.interRegular, fontSize: 13}}> {t('support.no_past_disputes')} </Text>
        ) : (
          pastDisputes.map(d => (
            <View key={d.id} style={s.resolvedCard}>
              <View style={s.disputeHeader}>
                <Text style={s.disputeTitle}> {t('support.session')} {d.sessionId}</Text>
                <View style={s.statusBadgeGreen}>
                  <Text style={s.statusBadgeGreenText}>{d.status}</Text>
                </View>
              </View>
              <Text style={s.disputeCustomer}> {t('support.customer')} {d.customerName}</Text>
              <Text style={s.resolvedOutcome}>{d.outcome}</Text>
            </View>
          ))
        )}

        <View style={{height: 20}} />
      </ScrollView>

      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={s.btnGold}
          onPress={() => navigation.navigate(Routes.DISPUTE_DETAIL, {disputeId: 'new'})}
          activeOpacity={0.85}>
          <Icon name="add" size={18} color={colors.rootBg} style={{marginRight: 8}} />
          <Text style={s.btnGoldText}> {t('support.file_new_dispute')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
export default DisputeCenterScreen;

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.rootBg},
  scroll: {flex: 1},
  content: {paddingHorizontal: spacing.lg, paddingTop: spacing.md},
  infoBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(255,171,64,0.07)', borderRadius: radius.md,
    borderWidth: 1, borderColor: 'rgba(255,171,64,0.22)', padding: spacing.md, marginBottom: spacing.lg},
  infoText: {fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.softWarning, flex: 1, lineHeight: 19},
  sectionLabel: {fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm},
  disputeCard: {backgroundColor: colors.cardSurface, borderRadius: radius.xl, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,171,64,0.20)', marginBottom: spacing.sm},
  resolvedCard: {backgroundColor: colors.cardSurface, borderRadius: radius.xl, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)'},
  disputeHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6},
  disputeTitle: {fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary},
  disputeCustomer: {fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, marginBottom: 6},
  disputeFooter: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  disputeMeta: {fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted},
  statusBadgeAmber: {backgroundColor: 'rgba(255,171,64,0.12)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(255,171,64,0.28)', paddingHorizontal: 10, paddingVertical: 3},
  statusBadgeAmberText: {fontFamily: fontFamily.interBold, fontSize: 11, color: colors.softWarning},
  statusBadgeGreen: {backgroundColor: 'rgba(109,214,165,0.10)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)', paddingHorizontal: 10, paddingVertical: 3},
  statusBadgeGreenText: {fontFamily: fontFamily.interBold, fontSize: 11, color: colors.safetyGreen},
  resolvedOutcome: {fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.safetyGreen},
  bar: {paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'},
  btnGold: {height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold},
  btnGoldText: {fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg},
});
