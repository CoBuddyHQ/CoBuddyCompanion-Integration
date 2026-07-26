/**
 * CoBuddy Companion App — Availability Store (Zustand)
 * ✅ INTEGRATED: Real API calls via AvailabilityService.
 * Single source of truth for live status, weekly schedule,
 * date overrides (day-off / block-time), vacation mode, and custom slots.
 */
import { create } from 'zustand';
import { AvailabilityService } from '../../services/api/services/index';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LeaveReason = 'Personal Leave' | 'Sick Leave' | 'Vacation' | 'Other';

export interface DaySchedule {
  day: string;
  active: boolean;
  times: string; // e.g. '09:00 AM - 06:00 PM'
}

export type DayHours = DaySchedule;

export interface DateOverride {
  id: string;
  startDate: string;
  endDate: string;
  reason: LeaveReason;
  note?: string;
  fullDay: boolean;
  startTime?: string;
  endTime?: string;
}

export interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  repeat: boolean;
}

export interface VacationModeState {
  enabled: boolean;
  awayFrom: string;
  returnOn: string;
}

interface AvailabilityState {
  isAvailable: boolean;
  vacationMode: VacationModeState;
  defaultHours: DaySchedule[];
  dateOverrides: DateOverride[];
  slots: AvailabilitySlot[];

  isLoading: boolean;
  error: string | null;

  // ── API Actions ───────────────────────────────────────────────────────────
  fetchAvailability: () => Promise<void>;
  setLiveAvailable: (v: boolean) => Promise<void>;
  setVacationMode: (enabled: boolean, awayFrom?: string, returnOn?: string) => Promise<void>;
  toggleDay: (day: string) => Promise<void>;
  setDayTimes: (day: string, times: string) => Promise<void>;
  addOverride: (override: Omit<DateOverride, 'id'>) => Promise<void>;
  removeOverride: (id: string) => Promise<void>;
  addSlot: (slot: Omit<AvailabilitySlot, 'id'>) => Promise<void>;
  updateSlot: (id: string, patch: Partial<Omit<AvailabilitySlot, 'id'>>) => Promise<void>;
  removeSlot: (id: string) => Promise<void>;
  
  // ── Helpers ───────────────────────────────────────────────────────────────
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
}

export const useAvailabilityStore = create<AvailabilityState>((set, get) => ({
  isAvailable: false,
  vacationMode: { enabled: false, awayFrom: '', returnOn: '' },
  defaultHours: [
    { day: 'Mon', active: true,  times: '09:00 AM - 06:00 PM' },
    { day: 'Tue', active: true,  times: '09:00 AM - 06:00 PM' },
    { day: 'Wed', active: true,  times: '09:00 AM - 06:00 PM' },
    { day: 'Thu', active: true,  times: '09:00 AM - 06:00 PM' },
    { day: 'Fri', active: true,  times: '09:00 AM - 06:00 PM' },
    { day: 'Sat', active: true,  times: '09:00 AM - 06:00 PM' },
    { day: 'Sun', active: false, times: '09:00 AM - 06:00 PM' },
  ],
  dateOverrides: [],
  slots: [],
  isLoading: false,
  error: null,

  // ── API Actions ───────────────────────────────────────────────────────────

  fetchAvailability: async () => {
    set({ isLoading: true, error: null });
    try {
      const res: any = await AvailabilityService.getAvailability();
      set({
        isAvailable: res.isAvailable ?? false,
        vacationMode: res.vacationMode ?? { enabled: false, awayFrom: '', returnOn: '' },
        defaultHours: res.defaultHours ?? get().defaultHours,
        dateOverrides: res.dateOverrides ?? [],
        slots: res.slots ?? []
      });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch availability' });
    } finally {
      set({ isLoading: false });
    }
  },

  setLiveAvailable: async (v) => {
    const prev = get().isAvailable;
    set({ isAvailable: v, error: null }); // optimistic
    try {
      await AvailabilityService.setLive(v);
    } catch (e: unknown) {
      set({ isAvailable: prev, error: e instanceof Error ? e.message : 'Failed to set live status' });
    }
  },

  setVacationMode: async (enabled, awayFrom, returnOn) => {
    set({ isLoading: true, error: null });
    try {
      await AvailabilityService.setVacation({ enabled, awayFrom, returnOn });
      set(state => ({
        vacationMode: {
          enabled,
          awayFrom: awayFrom ?? state.vacationMode.awayFrom,
          returnOn: returnOn ?? state.vacationMode.returnOn,
        },
      }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to update vacation mode' });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleDay: async (day) => {
    const current = get().defaultHours.find(d => d.day === day)?.active;
    // Optimistic
    set(state => ({
      defaultHours: state.defaultHours.map(d =>
        d.day === day ? { ...d, active: !d.active } : d,
      ),
    }));
    try {
      await AvailabilityService.toggleDay(day);
    } catch (e: unknown) {
      // Revert
      set(state => ({
        defaultHours: state.defaultHours.map(d =>
          d.day === day ? { ...d, active: !!current } : d,
        ),
        error: e instanceof Error ? e.message : 'Failed to toggle day'
      }));
    }
  },

  setDayTimes: async (day, times) => {
    set({ isLoading: true, error: null });
    try {
      const [startTime, endTime] = times.split(' - ');
      await AvailabilityService.setDayTimes(day, { startTime, endTime });
      set(state => ({
        defaultHours: state.defaultHours.map(d =>
          d.day === day ? { ...d, times } : d,
        ),
      }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to update day times' });
    } finally {
      set({ isLoading: false });
    }
  },

  addOverride: async (override) => {
    set({ isLoading: true, error: null });
    try {
      const res: any = await AvailabilityService.addOverride({
        date: override.startDate, 
        isBlocked: true, 
        note: override.note
      });
      const newOverride = { id: res.id || `temp-${Date.now()}`, ...override };
      set(state => ({
        dateOverrides: [newOverride, ...state.dateOverrides],
      }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to add override' });
    } finally {
      set({ isLoading: false });
    }
  },

  removeOverride: async (id) => {
    const prev = get().dateOverrides;
    set(state => ({ dateOverrides: state.dateOverrides.filter(o => o.id !== id) }));
    try {
      await AvailabilityService.removeOverride(id);
    } catch (e: unknown) {
      set({ dateOverrides: prev, error: e instanceof Error ? e.message : 'Failed to remove override' });
    }
  },

  addSlot: async (slot) => {
    set({ isLoading: true, error: null });
    try {
      const res: any = await AvailabilityService.addSlot({
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
      const newSlot = { id: res.id || `temp-${Date.now()}`, ...slot };
      set(state => ({
        slots: [newSlot, ...state.slots],
      }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to add slot' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSlot: async (id, patch) => {
    set({ isLoading: true, error: null });
    try {
      await AvailabilityService.updateSlot(id, patch);
      set(state => ({
        slots: state.slots.map(s => s.id === id ? { ...s, ...patch } : s),
      }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to update slot' });
    } finally {
      set({ isLoading: false });
    }
  },

  removeSlot: async (id) => {
    const prev = get().slots;
    set(state => ({ slots: state.slots.filter(s => s.id !== id) }));
    try {
      await AvailabilityService.removeSlot(id);
    } catch (e: unknown) {
      set({ slots: prev, error: e instanceof Error ? e.message : 'Failed to remove slot' });
    }
  },

  setLoading: v => set({ isLoading: v }),
  setError: e => set({ error: e }),
}));
