import i18next from "i18next"; /**
 * CoBuddy Companion App — Mock Notifications Data
 * Covers all notification categories: request, session, safety, payout, support, policy.
 * PRIVACY: Customer names as initials only. No raw PII in notification body.
 * CONTENT RULE: Safety alerts are always highest priority and never filtered.
 */

import type { AppNotification } from '../../store/types/store.types';
import { Routes } from '../../navigation/routes';

export const MOCK_NOTIFICATIONS: AppNotification[] = [
// ── SAFETY — CRITICAL ───────────────────────────────────────────────────────
{
  notificationId: 'NOTIF-CB-9901',
  category: 'safety',
  priority: 'critical',
  title: i18next.t("content.mock.mockNotifications.safety_timer_check_in_required"),
  body: 'Your safety timer will expire in 5 minutes. Please check in to confirm you are safe.',
  isRead: false,
  actionRoute: Routes.SAFETY_TIMER,
  actionParams: null,
  createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
},

// ── REQUEST — HIGH ──────────────────────────────────────────────────────────
{
  notificationId: 'NOTIF-CB-9902',
  category: 'request',
  priority: 'high',
  title: i18next.t("content.mock.mockNotifications.new_booking_request_expiring_soon"),
  body: 'A verified customer has sent a Café Conversation request. Respond within 18 minutes.',
  isRead: false,
  actionRoute: Routes.BOOKING_REQUESTS_INBOX,
  actionParams: null,
  createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
},

// ── SESSION — HIGH ──────────────────────────────────────────────────────────
{
  notificationId: 'NOTIF-CB-9903',
  category: 'session',
  priority: 'high',
  title: i18next.t("content.mock.mockNotifications.session_reminder_starts_in_2_hours"),
  body: 'Your Café Conversation session at The Artisan Roastery, MP Nagar begins at 6:30 PM.',
  isRead: false,
  actionRoute: Routes.SESSION_DETAIL,
  actionParams: { sessionId: 'CB-SE-2048' },
  createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
},

// ── PAYOUT — NORMAL ─────────────────────────────────────────────────────────
{
  notificationId: 'NOTIF-CB-9904',
  category: 'payout',
  priority: 'normal',
  title: i18next.t("content.mock.mockNotifications.payout_credited_18_600"),
  body: 'Your payout of \u20B918,600 has been credited to your verified bank account. UTR available in Earnings.',
  isRead: true,
  actionRoute: Routes.COMPLETED_PAYOUTS,
  actionParams: null,
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
},

// ── SUPPORT — NORMAL ────────────────────────────────────────────────────────
{
  notificationId: 'NOTIF-CB-9905',
  category: 'support',
  priority: 'normal',
  title: i18next.t("content.mock.mockNotifications.support_ticket_update"),
  body: 'CoBuddy support has responded to your ticket TKT-CB-8802. Session earning cleared.',
  isRead: true,
  actionRoute: Routes.SUPPORT_TICKET_DETAIL,
  actionParams: { ticketId: 'TKT-CB-8802' },
  createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
},

// ── POLICY — NORMAL ─────────────────────────────────────────────────────────
{
  notificationId: 'NOTIF-CB-9906',
  category: 'policy',
  priority: 'normal',
  title: i18next.t("content.mock.mockNotifications.policy_update_public_venue_rules_v2_4"),
  body: 'CoBuddy has updated the Public Venue & Safety Rules. Please review and acknowledge before your next session.',
  isRead: false,
  actionRoute: Routes.POLICY_CENTER,
  actionParams: null,
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
},

// ── TRAINING — LOW ──────────────────────────────────────────────────────────
{
  notificationId: 'NOTIF-CB-9907',
  category: 'training',
  priority: 'low',
  title: i18next.t("content.mock.mockNotifications.new_training_module_available"),
  body: 'The "Handling No-Show Situations" training module is now available. Complete it to boost your trust score.',
  isRead: true,
  actionRoute: Routes.TRAINING_HUB,
  actionParams: null,
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
},

// ── SYSTEM — LOW ────────────────────────────────────────────────────────────
{
  notificationId: 'NOTIF-CB-9908',
  category: 'system',
  priority: 'low',
  title: i18next.t("content.mock.mockNotifications.scheduled_maintenance_friday_11_pm"),
  body: 'CoBuddy will perform scheduled maintenance on Friday at 11 PM IST for approximately 30 minutes.',
  isRead: true,
  actionRoute: null,
  actionParams: null,
  createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
}];


/**
 * Filter notifications by category tab.
 * 'all' returns all notifications sorted by date descending.
 */
export function filterNotifications(
notifications: AppNotification[],
tab: 'all' | AppNotification['category'])
: AppNotification[] {
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (tab === 'all') {return sorted;}
  return sorted.filter((n) => n.category === tab);
}