import i18next from "i18next";
import { useTranslation } from "react-i18next"; /**
 * CoBuddy Companion App — Notification Store (Zustand)
 * Manages in-app notifications with category tabs and unread tracking.
 * PRIVACY: Notifications never contain raw customer PII.
 */

import { create } from 'zustand';
import type { AppNotification, NotificationCategory } from '../types/store.types';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  activeTab: NotificationCategory | 'all';
  isLoading: boolean;
  error: string | null;

  // Actions
  setNotifications: (notifications: AppNotification[]) => void;
  addNotification: (notification: AppNotification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  setActiveTab: (tab: NotificationCategory | 'all') => void;
  setLoading: (v: boolean) => void;
  setError: (error: string | null) => void;
  clearAll: () => void;
}

function countUnread(notifications: AppNotification[]): number {
  return notifications.filter((n) => !n.isRead).length;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
  {
    notificationId: 'NOTIF-001',
    category: 'request',
    priority: 'high',
    title: i18next.t("content.slices.notificationStore.new_booking_request_from_p_m"),
    body: 'Café Conversation · Today, 6:30 PM · MP Nagar · ₹749. Tap to review and accept or decline.',
    isRead: false,
    actionRoute: 'BookingRequestsInbox',
    actionParams: null,
    createdAt: new Date(Date.now() - 5 * 60_000).toISOString() // 5 min ago
  },
  {
    notificationId: 'NOTIF-002',
    category: 'payout',
    priority: 'normal',
    title: i18next.t("content.slices.notificationStore.payout_of_3_500_successful"),
    body: 'Your withdrawal has been processed and transferred to your registered bank account.',
    isRead: false,
    actionRoute: 'EarningsDashboard',
    actionParams: null,
    createdAt: new Date(Date.now() - 60 * 60_000).toISOString() // 1 hr ago
  },
  {
    notificationId: 'NOTIF-003',
    category: 'system',
    priority: 'low',
    title: i18next.t("content.slices.notificationStore.welcome_to_cobuddy_companion"),
    body: 'Your profile is live. Complete your first session to unlock the Rising Star badge.',
    isRead: true,
    actionRoute: null,
    actionParams: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60_000).toISOString() // Yesterday
  }],

  unreadCount: 2,
  activeTab: 'all',
  isLoading: false,
  error: null,

  setNotifications: (notifications) =>
  set({ notifications, unreadCount: countUnread(notifications) }),

  addNotification: (notification) =>
  set((state) => {
    const notifications = [notification, ...state.notifications];
    return {
      notifications,
      unreadCount: countUnread(notifications)
    };
  }),

  markAsRead: (notificationId) =>
  set((state) => {
    const notifications = state.notifications.map((n) =>
    n.notificationId === notificationId ? { ...n, isRead: true } : n
    );
    return { notifications, unreadCount: countUnread(notifications) };
  }),

  markAllAsRead: () =>
  set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    unreadCount: 0
  })),

  removeNotification: (notificationId) =>
  set((state) => {
    const notifications = state.notifications.filter(
      (n) => n.notificationId !== notificationId
    );
    return { notifications, unreadCount: countUnread(notifications) };
  }),

  setActiveTab: (tab) => set({ activeTab: tab }),
  setLoading: (v) => set({ isLoading: v }),
  setError: (error) => set({ error }),
  clearAll: () => set({ notifications: [], unreadCount: 0 })
}));