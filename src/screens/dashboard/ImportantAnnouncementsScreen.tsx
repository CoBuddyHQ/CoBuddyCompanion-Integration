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
  icon: string;
  iconColor: string;
  iconBg: string;
  tag: string;
  tagColor: string;
  title: string;
  body: string;
  date: string;
  url: string; // real URL — no more Alert stubs
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    icon: 'bolt',
    iconColor: colors.gold,
    iconBg: 'rgba(214,168,79,0.15)',
    tag: 'content.dashboard.ImportantAnnouncementsScreen.announcements.0.tag',
    tagColor: colors.gold,
    title: 'content.dashboard.ImportantAnnouncementsScreen.announcements.0.title',
    body: 'content.dashboard.ImportantAnnouncementsScreen.announcements.0.body',
    date: 'content.dashboard.ImportantAnnouncementsScreen.announcements.0.date',
    url: 'https://cobuddy.app/blog/instant-payouts',
  },
  {
    id: '2',
    icon: 'security',
    iconColor: '#E74C3C',
    iconBg: 'rgba(231,76,60,0.12)',
    tag: 'content.dashboard.ImportantAnnouncementsScreen.announcements.1.tag',
    tagColor: '#E74C3C',
    title: 'content.dashboard.ImportantAnnouncementsScreen.announcements.1.title',
    body: 'content.dashboard.ImportantAnnouncementsScreen.announcements.1.body',
    date: 'content.dashboard.ImportantAnnouncementsScreen.announcements.1.date',
    url: 'https://cobuddy.app/safety/venue-guidelines',
  },
  {
    id: '3',
    icon: 'campaign',
    iconColor: '#74B9FF',
    iconBg: 'rgba(116,185,255,0.10)',
    tag: 'content.dashboard.ImportantAnnouncementsScreen.announcements.2.tag',
    tagColor: '#74B9FF',
    title: 'content.dashboard.ImportantAnnouncementsScreen.announcements.2.title',
    body: 'content.dashboard.ImportantAnnouncementsScreen.announcements.2.body',
    date: 'content.dashboard.ImportantAnnouncementsScreen.announcements.2.date',
    url: 'https://cobuddy.app/expansion',
  },
];






































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

export function ImportantAnnouncementsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('dashboard.announcements')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.subtitle}> {t('dashboard.stay_up_to_date_with_platform_updates')} </Text>

        {ANNOUNCEMENTS.map((item) =>
        <View key={item.id} style={s.card}>
            {/* Top row */}
            <View style={s.cardTop}>
              <View style={[s.iconWrap, { backgroundColor: item.iconBg }]}>
                <Icon name={item.icon as any} size={22} color={item.iconColor} />
              </View>
              <View style={[s.tagPill, { borderColor: item.tagColor + '50' }]}>
                <Text style={[s.tagText, { color: item.tagColor }]}>{t(item.tag)}</Text>
              </View>
              <Text style={s.dateText}>{t(item.date)}</Text>
            </View>

            {/* Content */}
            <Text style={s.cardTitle}>{t(item.title)}</Text>
            <Text style={s.cardBody}>{t(item.body)}</Text>

            {/* Read more — real URL */}
            <TouchableOpacity style={s.readMore}
              onPress={() => openArticle(item.title, item.url)}
              activeOpacity={0.75}>
              <Text style={s.readMoreText}> {t('dashboard.read_more')} </Text>
              <Icon name="arrow-forward" size={14} color={colors.gold} />
            </TouchableOpacity>
          </View>
        )}

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