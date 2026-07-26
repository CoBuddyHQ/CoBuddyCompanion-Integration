import i18next from 'i18next';
/**
 * NotificationCenterScreen (CPN-065)
 * Connected to useNotificationStore — badge on HomeDashboard stays in sync.
 */
import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useNotificationStore } from '../../store/slices/notificationStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { AppNotification } from '../../store/types/store.types';
import { useTranslation } from "react-i18next";

// ─── Icon map per notification category ───────────────────────────────────────

function iconForCategory(cat: AppNotification['category']): {name: string;color: string;bg: string;} {
  switch (cat) {
    case 'request':return { name: 'event', color: colors.gold, bg: 'rgba(214,168,79,0.12)' };
    case 'payout':return { name: 'account-balance-wallet', color: colors.safetyGreen, bg: 'rgba(109,214,165,0.10)' };
    case 'safety':return { name: 'shield', color: '#E74C3C', bg: 'rgba(231,76,60,0.12)' };
    case 'session':return { name: 'schedule', color: '#74B9FF', bg: 'rgba(116,185,255,0.10)' };
    case 'system':return { name: 'campaign', color: '#FDCB6E', bg: 'rgba(253,203,110,0.10)' };
    case 'support':return { name: 'headset-mic', color: '#A29BFE', bg: 'rgba(162,155,254,0.10)' };
    case 'policy':return { name: 'gavel', color: '#FD79A8', bg: 'rgba(253,121,168,0.10)' };
    case 'training':return { name: 'school', color: '#55EFC4', bg: 'rgba(85,239,196,0.10)' };
    default:return { name: 'notifications', color: colors.textMuted, bg: 'rgba(255,255,255,0.06)' };
  }
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) {return 'Just now';}
  if (mins < 60) {return `${mins} min ago`;}
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) {return `${hrs} hr ago`;}
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Row card ─────────────────────────────────────────────────────────────────

const NotifCard: React.FC<{item: AppNotification;onPress: () => void;}> = ({ item, onPress }) => {
  const { name, color, bg } = iconForCategory(item.category);
  return (
    <TouchableOpacity accessibilityRole="button" style={[s.card, !item.isRead && s.cardUnread]}
    onPress={onPress} activeOpacity={0.8}>
      {!item.isRead && <View style={s.unreadDot} />}
      <View style={[s.iconWrap, { backgroundColor: bg }]}>
        <Icon name={name as any} size={20} color={color} />
      </View>
      <View style={s.cardText}>
        <Text style={[s.cardTitle, !item.isRead && s.cardTitleUnread]}>{i18next.t(item.title)}</Text>
        <Text style={s.cardSub} numberOfLines={2}>{item.body}</Text>
      </View>
      <Text style={s.cardTime}>{relativeTime(item.createdAt)}</Text>
    </TouchableOpacity>);

};

// Nested component extraction: ItemSeparator was defined inside NotificationCenterScreen render.
// It uses no parent state/props (only global spacing theme). Extracted to module level.
const ItemSeparator = () => <View style={{ height: spacing.sm }} />;

// ─── Screen ───────────────────────────────────────────────────────────────────

export function NotificationCenterScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const renderItem = ({ item }: {item: AppNotification;}) =>
  <NotifCard
    item={item}
    onPress={() => markAsRead(item.notificationId)} />;



  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        title={t('dashboard.notifications')}
        showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
        rightIcon={unreadCount > 0 ? 'done-all' : undefined}
        onRightPress={markAllAsRead} />
      
      <FlatList
        data={notifications}
        keyExtractor={(n) => n.notificationId}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={unreadCount > 0 ?
        <View style={s.banner}>
              <Icon name="notifications-active" size={14} color={colors.gold} />
              <Text style={s.bannerText}>{unreadCount}  {t('dashboard.unread')} </Text>
            </View> :
        null}
        ListEmptyComponent={
        <View style={s.empty}>
            <Icon name="notifications-none" size={40} color={colors.textMuted} />
            <Text style={s.emptyText}> {t('dashboard.no_notifications_yet')} </Text>
          </View>}
        ItemSeparatorComponent={ItemSeparator}
        ListFooterComponent={<View style={{ height: 40 }} />} />
      
    </SafeAreaView>);

}
export default NotificationCenterScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(214,168,79,0.08)',
    borderRadius: radius.lg, borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    padding: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  bannerText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.gold },
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md, position: 'relative' },
  cardUnread: { backgroundColor: 'rgba(214,168,79,0.06)', borderColor: 'rgba(214,168,79,0.20)' },
  unreadDot: { position: 'absolute', top: 12, left: 10,
    width: 7, height: 7, borderRadius: 4, backgroundColor: colors.gold },
  iconWrap: { width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardText: { flex: 1 },
  cardTitle: { fontFamily: fontFamily.interSemiBold, fontSize: 13,
    color: colors.textSecondary, lineHeight: 18, marginBottom: 2 },
  cardTitleUnread: { fontFamily: fontFamily.interBold, color: colors.textPrimary },
  cardSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  cardTime: { fontFamily: fontFamily.interRegular, fontSize: 11,
    color: colors.textMuted, flexShrink: 0, alignSelf: 'flex-start' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingTop: 80, gap: spacing.md },
  emptyText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted }
});