import i18next from "i18next"; /**
* ImportantAnnouncementsScreen (CPN-066)
* "Read More" opens real URLs via Linking.openURL (no fake alerts).
*/
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

interface Announcement {
  id: string;
  category: string;
  title: string;
  body: string;
  date: string;
  url?: string;
}
async function openArticle(title: string, url: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(i18next.t("alerts.cannot_open_link"), i18next.t("alerts.please_visit_v0", { v0: url }));
    }
  } catch {
    Alert.alert(i18next.t("alerts.error"), i18next.t("alerts.could_not_open_v0_please_try_again", { v0: title }));
  }
}

import { useState, useEffect } from 'react';
import { apiGet } from '../../services/api/client';

export function ImportantAnnouncementsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    apiGet('/companion/dashboard/announcements')
      .then((res: any) => {
        const records = Array.isArray(res?.announcements) ? res.announcements : [];
        const announcements = records
          .map((item: any, index: number): Announcement => {
            const publishedAt = item?.publishedAt ? Date.parse(item.publishedAt) : NaN;
            const title = typeof item?.title === 'string' ? item.title : item?.title?.en;
            const body = typeof item?.message === 'string' ? item.message : item?.message?.en;
            const url = typeof item?.actionUrl === 'string' && /^https:\/\//i.test(item.actionUrl)
              ? item.actionUrl
              : undefined;
            return {
              id: String(item?.id ?? index),
              category: String(item?.category || 'UPDATE'),
              title: String(title || ''),
              body: String(body || ''),
              date: Number.isFinite(publishedAt) ? new Date(publishedAt).toLocaleDateString() : '',
              url,
            };
          })
          .filter((item: Announcement) => item.title || item.body);
        setItems(announcements);
        setLoadError(false);
      })
      .catch(() => {
        setItems([]);
        setLoadError(true);
      });
  }, []);

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('dashboard.announcements')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.subtitle}> {t('dashboard.stay_up_to_date_with_platform_updates')} </Text>

        {items.length === 0 && (
          <Text style={s.empty} accessibilityRole={loadError ? 'alert' : undefined}>
            {loadError
              ? t('dashboard.announcements_unavailable', { defaultValue: 'Announcements are temporarily unavailable.' })
              : t('dashboard.no_announcements', { defaultValue: 'No announcements right now.' })}
          </Text>
        )}

        {items.map((item) => (
          <View key={item.id} style={s.card}>
            <View style={s.cardTop}>
              <View style={[s.iconWrap, { backgroundColor: 'rgba(214,168,79,0.15)' }]}>
                <Icon name="campaign" size={22} color={colors.gold} />
              </View>
              <View style={[s.tagPill, { borderColor: colors.gold + '50' }]}>
                <Text style={[s.tagText, { color: colors.gold }]}>
                  {t(item.category, { defaultValue: item.category })}
                </Text>
              </View>
              <Text style={s.dateText}>{item.date}</Text>
            </View>

            <Text style={s.cardTitle}>{t(item.title, { defaultValue: item.title })}</Text>
            <Text style={s.cardBody}>{t(item.body, { defaultValue: item.body })}</Text>

            {item.url && (
              <TouchableOpacity
                accessibilityRole="button"
                style={s.readMore}
                onPress={() => openArticle(item.title, item.url!)}
                activeOpacity={0.75}
              >
                <Text style={s.readMoreText}> {t('dashboard.read_more')} </Text>
                <Icon name="arrow-forward" size={14} color={colors.gold} />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default ImportantAnnouncementsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted,
    marginBottom: spacing.lg },
  empty: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted,
    paddingVertical: spacing.xl, textAlign: 'center' },
  card: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.lg, marginBottom: spacing.md },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  iconWrap: { width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tagPill: { borderRadius: radius.full, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 3 },
  tagText: { fontFamily: fontFamily.interBold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  dateText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginLeft: 'auto' },
  cardTitle: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.textPrimary,
    lineHeight: 22, marginBottom: spacing.sm },
  cardBody: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    lineHeight: 20, marginBottom: spacing.md },
  readMore: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  readMoreText: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.gold }
});
