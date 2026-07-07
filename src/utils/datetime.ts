/**
 * CoBuddy Companion App — Datetime Utility
 * Consistent date/time formatting across all screens.
 */

import i18next from 'i18next';

/** Format a date as "Mon, 20 Jun" */
export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(i18next.language || 'en-IN', {weekday: 'short', day: 'numeric', month: 'short'});
}

/** Format a date as "Monday, 20 June 2026" */
export function formatFullDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(i18next.language || 'en-IN', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
}

/** Format time as "3:30 PM" */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(i18next.language || 'en-IN', {hour: 'numeric', minute: '2-digit', hour12: true});
}

/** Format a date-time range as "3:00 PM – 5:00 PM" */
export function formatTimeRange(start: Date | string, end: Date | string): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

/** Format duration in minutes to "2h 30m" */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/** Get relative time string: "2 min ago", "Just now", "3 days ago" */
export function formatRelative(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return i18next.t('datetime.just_now');
  if (diffMin < 60) return i18next.t('datetime.min_ago', { count: diffMin });
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return i18next.t('datetime.hours_ago', { count: diffHr });
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return i18next.t('datetime.yesterday');
  if (diffDay < 7) return i18next.t('datetime.days_ago', { count: diffDay });
  return formatShortDate(d);
}

/** Check if a date is today */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

/** Format a countdown: "2h 14m remaining" */
export function formatCountdown(targetDate: Date | string): string {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return i18next.t('datetime.expired');
  const diffMin = Math.floor(diffMs / 60000);
  return i18next.t('datetime.remaining', { duration: formatDuration(diffMin) });
}
