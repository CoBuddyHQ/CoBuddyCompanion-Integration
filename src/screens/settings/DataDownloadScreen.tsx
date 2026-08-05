/**
 * DataDownloadScreen (CPN-148)
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

import { useState } from 'react';
import { apiPost, apiGet } from '../../services/api/client';
import { Endpoints } from '../../services/api/endpoints';

export function DataDownloadScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [requests, setRequests] = useState<Array<{ id: string; date: string; status: string }>>([]);
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await apiPost(Endpoints.ACCOUNT.DATA_EXPORT, {});
      const now = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      setRequests((prev) => [{ id: String(Date.now()), date: now, status: 'Processing' }, ...prev]);
      
      Alert.alert(
        t("alerts.request_submitted") || 'Request Submitted',
        'We will prepare your complete account data archive and email a secure download link to your registered email address within 24 hours.',
        [{ text: t("alerts.ok") || 'OK' }]
      );
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to submit data download request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('settings.download_my_data')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Info card */}
        <View style={s.infoCard}>
          <View style={s.infoIconWrap}>
            <Icon name="cloud-download" size={28} color={colors.gold} />
          </View>
          <Text style={s.infoTitle}> {t('settings.your_data_archive')} </Text>
          <Text style={s.infoBody}>
             {t('settings.request_a_copy_of_all_your_cobuddy_data_including_chat_logs_earnings_history_and_profile_information_we_will_prepare_a_secure_download_link_and_email_it_to_you')} </Text>
        </View>

        {/* What's included */}
        <Text style={s.sectionLabel}> {t('settings.what_s_included')} </Text>
        <View style={s.card}>
          {[
          { icon: 'chat', label: t("content.settings.DataDownloadScreen.chat_logs_session_notes") },
          { icon: 'account-balance-wallet', label: t("content.settings.DataDownloadScreen.earnings_transaction_history") },
          { icon: 'person', label: t("content.settings.DataDownloadScreen.profile_data_preferences") },
          { icon: 'star', label: t("content.settings.DataDownloadScreen.reviews_and_ratings_received") }].
          map((item, i) =>
          <View key={t(item.label)}>
              {i > 0 && <View style={s.sep} />}
              <View style={s.row}>
                <Icon name={item.icon as any} size={18} color={colors.gold} />
                <Text style={s.rowLabel}>{t(item.label)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* CTA */}
        <TouchableOpacity accessibilityRole="button" style={s.btn} onPress={handleRequest} activeOpacity={0.85}>
          <Icon name="cloud-download" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnText}> {t('settings.request_data_archive')} </Text>
        </TouchableOpacity>

        {/* Recent requests */}
        <Text style={s.sectionLabel}> {t('settings.recent_requests')} </Text>
        {requests.length === 0 ? (
          <View style={s.emptyCard}>
            <Icon name="inbox" size={28} color={colors.textMuted} />
            <Text style={s.emptyText}> {t('settings.no_recent_requests')} </Text>
          </View>
        ) : (
          <View style={s.card}>
            {requests.map((req, i) => (
              <View key={req.id}>
                {i > 0 && <View style={s.sep} />}
                <View style={s.row}>
                  <Icon name="cloud-done" size={20} color={colors.gold} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.rowLabel}>Data Archive ({req.date})</Text>
                    <Text style={{ fontSize: 12, color: colors.safetyGreen }}>{req.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default DataDownloadScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  infoCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)', padding: spacing.lg,
    alignItems: 'center', marginBottom: spacing.lg, gap: spacing.sm },
  infoIconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(214,168,79,0.12)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.28)', alignItems: 'center', justifyContent: 'center' },
  infoTitle: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.textPrimary },
  infoBody: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 20 },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  card: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.md },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  rowLabel: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary },
  btn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold, marginBottom: spacing.lg },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  emptyCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: spacing.xl,
    alignItems: 'center', gap: spacing.sm },
  emptyText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted }
});