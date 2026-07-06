/**
 * CoBuddy Companion App — Availability Store (Zustand)
 * Single source of truth for live status, weekly schedule,
 * date overrides (day-off / block-time), vacation mode, and custom slots.
 * DEV: Mock data seeded below — replace with API before production.
 */
import {create} from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LeaveReason = 'Personal Leave' | 'Sick Leave' | 'Vacation' | 'Other';

export interface DaySchedule {
  day: string;
  active: boolean;
  times: string;
}

// Kept for calendar backward-compat (used in AvailabilityCalendarScreen)
export type DayHours = DaySchedule;

export interface DateOverride {
  id: string;
  startDate: string;   // Human-readable display string, e.g. '02 July 2026'
  endDate: string;
  reason: LeaveReason;
  note?: string;
  fullDay: boolean;
  startTime?: string;  // Only when fullDay = false
  endTime?: string;
}

export interface AvailabilitySlot {
  id: string;
  date: string;        // Human-readable display string, e.g. '05 July 2026'
  startTime: string;   // e.g. '09:00 AM'
  endTime: string;     // e.g. '01:00 PM'
  repeat: boolean;
}

export interface VacationModeState {
  enabled: boolean;
  awayFrom: string;
  returnOn: string;
}

interface AvailabilityState {
  // ── Live availability switch ─────────────────────────────────────────────
  isAvailable: boolean;

  // ── Vacation mode ────────────────────────────────────────────────────────
  vacationMode: VacationModeState;

  // ── Weekly recurring schedule ─────────────────────────────────────────────
  defaultHours: DaySchedule[];

  // ── Date-specific overrides (blocks / day-offs) ───────────────────────────
  dateOverrides: DateOverride[];

  // ── Custom one-off / repeating slots ─────────────────────────────────────
  slots: AvailabilitySlot[];

  // ── Actions ───────────────────────────────────────────────────────────────
  setLiveAvailable: (v: boolean) => void;

  setVacationMode: (enabled: boolean, awayFrom?: string, returnOn?: string) => void;

  toggleDay: (day: string) => void;
  setDayTimes: (day: string, times: string) => void;

  addOverride: (override: Omit<DateOverride, 'id'>) => void;
  removeOverride: (id: string) => void;

  addSlot: (slot: Omit<AvailabilitySlot, 'id'>) => void;
  updateSlot: (id: string, patch: Partial<Omit<AvailabilitySlot, 'id'>>) => void;
  removeSlot: (id: string) => void;
}

// ─── ID generator ─────────────────────────────────────────────────────────────

let _seq = 1;
function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${_seq++}`;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAvailabilityStore = create<AvailabilityState>(set => ({
  // ─── MOCK DATA — remove before production ────────────────────────────────
  isAvailable: true,

  vacationMode: {enabled: false, awayFrom: '', returnOn: ''},

  defaultHours: [
    {day: 'Mon', active: true,  times: '09:00 AM - 06:00 PM'},
    {day: 'Tue', active: true,  times: '09:00 AM - 06:00 PM'},
    {day: 'Wed', active: true,  times: '10:00 AM - 05:00 PM'},
    {day: 'Thu', active: true,  times: '09:00 AM - 06:00 PM'},
    {day: 'Fri', active: true,  times: '09:00 AM - 08:00 PM'},
    {day: 'Sat', active: true,  times: '10:00 AM - 04:00 PM'},
    {day: 'Sun', active: false, times: '09:00 AM - 05:00 PM'},
  ],

  dateOverrides: [],
  slots:         [],
  // ─────────────────────────────────────────────────────────────────────────

  setLiveAvailable: v => set({isAvailable: v}),

  setVacationMode: (enabled, awayFrom, returnOn) =>
    set(state => ({
      vacationMode: {
        enabled,
        awayFrom: awayFrom ?? state.vacationMode.awayFrom,
        returnOn: returnOn ?? state.vacationMode.returnOn,
      },
    })),

  toggleDay: day =>
    set(state => ({
      defaultHours: state.defaultHours.map(d =>
        d.day === day ? {...d, active: !d.active} : d,
      ),
    })),

  setDayTimes: (day, times) =>
    set(state => ({
      defaultHours: state.defaultHours.map(d =>
        d.day === day ? {...d, times} : d,
      ),
    })),

  addOverride: override =>
    set(state => ({
      dateOverrides: [{id: genId('OVR'), ...override}, ...state.dateOverrides],
    })),

  removeOverride: id =>
    set(state => ({
      dateOverrides: state.dateOverrides.filter(o => o.id !== id),
    })),

  addSlot: slot =>
    set(state => ({
      slots: [{id: genId('SLT'), ...slot}, ...state.slots],
    })),

  updateSlot: (id, patch) =>
    set(state => ({
      slots: state.slots.map(s => s.id === id ? {...s, ...patch} : s),
    })),

  removeSlot: id =>
    set(state => ({
      slots: state.slots.filter(s => s.id !== id),
    })),
}));
