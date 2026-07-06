/**
 * TaxInvoiceDetailsScreen (CPN-111)
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

export function TaxInvoiceDetailsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Derive all amounts from the session base amount passed via params
  const baseAmount: number = route.params?.amount ?? 1000;
  const platformFee = Math.round(baseAmount * 0.20);
  const gst = Math.round(platformFee * 0.18);
  const netPayout = baseAmount - platformFee - gst;
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const LINE_ITEMS = [{ label: "content.earnings.TaxInvoiceDetailsScreen.line_items.0.label", sign: "content.earnings.TaxInvoiceDetailsScreen.line_items.0.sign" }, { label: "content.earnings.TaxInvoiceDetailsScreen.line_items.1.label" }, { label: "content.earnings.TaxInvoiceDetailsScreen.line_items.2.label" }] as any[];




  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('earnings.tax_invoice')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Invoice document card */}
        <View style={s.invoiceDoc}>
          {/* Header */}
          <View style={s.invoiceHeader}>
            <View>
              <Text style={s.invoiceNum}> {t('earnings.invoice_inv_2026_001')} </Text>
              <Text style={s.invoiceDate}> {t('earnings.date_15_jun_2026')} </Text>
            </View>
            <View style={s.invoiceBadge}>
              <Icon name="check-circle" size={12} color={colors.safetyGreen} />
              <Text style={s.invoiceBadgeText}> {t('earnings.paid')} </Text>
            </View>
          </View>

          <View style={s.invoiceDivider} />

          {/* Parties */}
          <View style={s.partiesRow}>
            <View style={s.partyCol}>
              <Text style={s.partyLabel}> {t('earnings.billed_to')} </Text>
              <Text style={s.partyName}> {t('earnings.cobuddy_technologies_pvt_ltd')} </Text>
              <Text style={s.partyDetail}> {t('earnings.gstin_29aabcu9603r1zx')} </Text>
            </View>
            <View style={s.partyCol}>
              <Text style={s.partyLabel}> {t('earnings.companion')} </Text>
              <Text style={s.partyName}> {t('earnings.cpn_10042')} </Text>
              <Text style={s.partyDetail}> {t('earnings.pan_abcde1234f')} </Text>
            </View>
          </View>

          <View style={s.invoiceDivider} />

          {/* Line items */}
          <Text style={s.lineItemsTitle}> {t('earnings.line_items')} </Text>
          {LINE_ITEMS.map((item, i) =>
          <View key={t(item.label)} style={s.lineItem}>
              <Text style={s.lineItemLabel}>{t(item.label)}</Text>
              <Text style={[s.lineItemValue, item.sign < 0 && s.lineItemNeg]}>{item.value}</Text>
            </View>
          )}

          <View style={s.totalRow}>
            <Text style={s.totalLabel}> {t('earnings.total_net_payout')} </Text>
            <Text style={s.totalValue}>{fmt(netPayout)}</Text>
          </View>

          {/* Footer watermark */}
          <View style={s.invoiceFooter}>
            <Icon name="verified" size={12} color="#9CA3AF" />
            <Text style={s.invoiceFooterText}> {t('earnings.digitally_verified_by_cobuddy_technologies')} </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={s.bar}>
        <TouchableOpacity style={s.btn}
        onPress={() => Alert.alert(t("alerts.download"), t("alerts.downloading_invoice"))} activeOpacity={0.85}>
          <Icon name="file-download" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnText}> {t('earnings.download_pdf')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default TaxInvoiceDetailsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  invoiceDoc: { backgroundColor: '#F8F9FA', borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: '#E5E7EB', marginBottom: spacing.md },
  invoiceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  invoiceNum: { fontFamily: fontFamily.interBold, fontSize: 14, color: '#111827' },
  invoiceDate: { fontFamily: fontFamily.interRegular, fontSize: 12, color: '#6B7280', marginTop: 2 },
  invoiceBadge: { flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(109,214,165,0.15)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.40)', paddingHorizontal: 8, paddingVertical: 3 },
  invoiceBadgeText: { fontFamily: fontFamily.interBold, fontSize: 11, color: '#059669' },
  invoiceDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: spacing.md },
  partiesRow: { flexDirection: 'row', gap: spacing.lg },
  partyCol: { flex: 1 },
  partyLabel: { fontFamily: fontFamily.interRegular, fontSize: 10, color: '#9CA3AF',
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 },
  partyName: { fontFamily: fontFamily.interBold, fontSize: 12, color: '#111827', marginBottom: 2 },
  partyDetail: { fontFamily: fontFamily.interRegular, fontSize: 10, color: '#6B7280' },
  lineItemsTitle: { fontFamily: fontFamily.interSemiBold, fontSize: 11, color: '#6B7280',
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: spacing.sm },
  lineItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  lineItemLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: '#374151' },
  lineItemValue: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: '#111827' },
  lineItemNeg: { color: '#DC2626' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 2, borderTopColor: '#111827', paddingTop: spacing.sm, marginTop: spacing.sm },
  totalLabel: { fontFamily: fontFamily.interBold, fontSize: 14, color: '#111827' },
  totalValue: { fontFamily: fontFamily.playfairBold, fontSize: 18, color: '#111827' },
  invoiceFooter: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.lg },
  invoiceFooterText: { fontFamily: fontFamily.interRegular, fontSize: 10, color: '#9CA3AF' },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});