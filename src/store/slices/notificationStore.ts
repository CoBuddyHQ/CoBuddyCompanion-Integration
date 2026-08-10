/**
 * CoBuddy Companion App — Notification Store (Zustand)
 * ✅ INTEGRATED: Real API calls via NotificationsService.
 * Manages in-app notifications with category tabs and unread tracking.
 * PRIVACY: Notifications never contain raw customer PII.
 */

import { create } from 'zustand';
import type { AppNotification, NotificationCategory } from '../types/store.types';
import { NotificationsService } from '../../services/api/services/index';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  activeTab: NotificationCategory | 'all';
  isLoading: boolean;
  error: string | null;

  // ── API Actions ────────────────────────────────────────────────────────────
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;

  // ── Local Actions (e.g. from WebSockets) ───────────────────────────────────
  addNotification: (notification: AppNotification) => void;
  removeNotification: (notificationId: string) => void;
  setActiveTab: (tab: NotificationCategory | 'all') => void;
  clearAll: () => void;
}

function countUnread(notifications: AppNotification[]): number {
  return notifications.filter((n) => !n.isRead).length;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  activeTab: 'all',
  isLoading: false,
  error: null,

  // ── API Actions ────────────────────────────────────────────────────────────
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await NotificationsService.getAll();
      set({ notifications, unreadCount: countUnread(notifications) });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to load notifications' });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (notificationId: string) => {
    // Optimistic update
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.notificationId === notificationId ? { ...n, isRead: true } : n
      );
      return { notifications, unreadCount: countUnread(notifications) };
    });

    try {
      await NotificationsService.markRead(notificationId);
    } catch (e: unknown) {
      // Revert if API fails (optional, ignoring for UX smoothness)
    }
  },

  markAllAsRead: async () => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0
    }));

    try {
      await NotificationsService.markAllRead();
    } catch (e: unknown) {
      // Revert if API fails (optional)
    }
  },

  // ── Local Actions ──────────────────────────────────────────────────────────
  addNotification: (notification) =>
    set((state) => {
      const id = (notification as any).id || notification.notificationId || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const safeNotif = { ...notification, notificationId: id };
      const filtered = state.notifications.filter(n => ((n as any).id || n.notificationId) !== id);
      const notifications = [safeNotif, ...filtered];
      return {
        notifications,
        unreadCount: countUnread(notifications)
      };
    }),

  removeNotification: (notificationId) =>
    set((state) => {
      const notifications = state.notifications.filter(
        (n) => n.notificationId !== notificationId
      );
      return { notifications, unreadCount: countUnread(notifications) };
    }),

  setActiveTab: (tab) => set({ activeTab: tab }),
  clearAll: () => set({ notifications: [], unreadCount: 0 })
}));