/**
 * CoBuddy Companion App — Session Store (Zustand)
 * Manages upcoming, active, and historical sessions.
 * Tracks live session state (check-in, timer, SOS status).
 * PRIVACY: Customer data stored as summary with masked/initials only.
 */

import {create} from 'zustand';
import type {Session, SessionStatus} from '../types/store.types';

interface SessionState {
  // Lists
  upcomingSessions: Session[];
  sessionHistory: Session[];

  // Active session (one at a time)
  activeSession: Session | null;
  liveElapsedSeconds: number;    // Updated by timer tick
  safetyTimerActive: boolean;
  nextCheckInAt: string | null;  // ISO datetime — scheduled periodic check-in

  // Loading states
  isLoadingUpcoming: boolean;
  isLoadingHistory: boolean;
  isLoadingActive: boolean;
  error: string | null;

  // List actions
  setUpcomingSessions: (sessions: Session[]) => void;
  setSessionHistory: (sessions: Session[]) => void;
  upsertSession: (session: Session) => void;
  removeSessionById: (sessionId: string) => void;

  // Active session actions
  setActiveSession: (session: Session | null) => void;
  updateActiveSessionStatus: (status: SessionStatus) => void;
  setCheckInTime: (isoTime: string) => void;
  setCheckOutTime: (isoTime: string) => void;
  setSessionPassCode: (code: string) => void;
  setElapsedSeconds: (seconds: number) => void;
  setSafetyTimerActive: (active: boolean) => void;
  setNextCheckInAt: (isoTime: string | null) => void;
  setSessionNotes: (notes: string) => void;
  setConfirmedEarning: (amount: number) => void;

  // Bulk status update (used for check-in flow)
  updateSessionStatus: (sessionId: string, status: SessionStatus) => void;

  // Loading
  setLoadingUpcoming: (v: boolean) => void;
  setLoadingHistory: (v: boolean) => void;
  setLoadingActive: (v: boolean) => void;
  setError: (error: string | null) => void;
  clearActiveSession: () => void;
}

// ─── MOCK DATA — remove before production / replace with real API call ────────
const _now = Date.now();
const MOCK_UPCOMING: Session[] = [
  {
    sessionId: 'SES-101',
    status: 'upcoming',
    category: 'cafe_conversation',
    customer: {
      customerId: 'CUST-001',
      displayInitials: 'P.M.',
      trustScore: 98,
      isVerified: true,
      totalSessionsWithCompanion: 0,
      sessionCountOverall: 12,
      safetyConsent: true,
      identityVerified: true,
    },
    venue: {
      venueId: 'VEN-001',
      name: 'Café Coffee Day – MP Nagar',
      area: 'MP Nagar',
      city: 'Bhopal',
      isApproved: true,
      venueType: 'Public Café',
      meetingPoint: 'Main entrance seating',
      landmark: 'Near Zone-1 Square',
    },
    scheduledStart: new Date(_now + 86_400_000).toISOString(),
    scheduledEnd:   new Date(_now + 86_400_000 + 7_200_000).toISOString(),
    durationMinutes: 120,
    language: 'Hindi',
    baseEarning: 699,
    bonusEarning: 50,
    estimatedTotal: 749,
    confirmedEarning: null,
    checkInTime: null,
    checkOutTime: null,
    sessionPassCode: 'PM-642',
    safetyTimerActive: false,
    notes: null,
    createdAt: new Date(_now - 3_600_000).toISOString(),
  },
  {
    sessionId: 'SES-102',
    status: 'upcoming',
    category: 'city_walk',
    customer: {
      customerId: 'CUST-003',
      displayInitials: 'A.S.',
      trustScore: 76,
      isVerified: true,
      totalSessionsWithCompanion: 0,
      sessionCountOverall: 3,
      safetyConsent: true,
      identityVerified: false,
    },
    venue: {
      venueId: 'VEN-003',
      name: 'Upper Lake Park – Bhopal',
      area: 'Shyamla Hills',
      city: 'Bhopal',
      isApproved: true,
      venueType: 'Public Park',
      meetingPoint: 'Main gate near parking',
      landmark: 'Opposite CM Residence',
    },
    scheduledStart: new Date(_now + 172_800_000).toISOString(),
    scheduledEnd:   new Date(_now + 172_800_000 + 5_400_000).toISOString(),
    durationMinutes: 90,
    language: 'English',
    baseEarning: 550,
    bonusEarning: 0,
    estimatedTotal: 550,
    confirmedEarning: null,
    checkInTime: null,
    checkOutTime: null,
    sessionPassCode: 'AS-319',
    safetyTimerActive: false,
    notes: null,
    createdAt: new Date(_now - 7_200_000).toISOString(),
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export const useSessionStore = create<SessionState>(set => ({
  upcomingSessions: MOCK_UPCOMING,
  sessionHistory: [],
  activeSession: null,
  liveElapsedSeconds: 0,
  safetyTimerActive: false,
  nextCheckInAt: null,
  isLoadingUpcoming: false,
  isLoadingHistory: false,
  isLoadingActive: false,
  error: null,

  setUpcomingSessions: sessions => set({upcomingSessions: sessions}),
  setSessionHistory: sessions => set({sessionHistory: sessions}),

  upsertSession: session =>
    set(state => {
      const update = (list: Session[]) => {
        const idx = list.findIndex(s => s.sessionId === session.sessionId);
        if (idx >= 0) {
          const next = [...list];
          next[idx] = session;
          return next;
        }
        return [session, ...list];
      };
      return {
        upcomingSessions: update(state.upcomingSessions),
        // If session is completed/cancelled, also update active
        activeSession:
          state.activeSession?.sessionId === session.sessionId
            ? session
            : state.activeSession,
      };
    }),

  removeSessionById: sessionId =>
    set(state => ({
      upcomingSessions: state.upcomingSessions.filter(
        s => s.sessionId !== sessionId,
      ),
    })),

  setActiveSession: session => set({activeSession: session, liveElapsedSeconds: 0}),

  updateActiveSessionStatus: status =>
    set(state =>
      state.activeSession
        ? {activeSession: {...state.activeSession, status}}
        : state,
    ),

  setCheckInTime: isoTime =>
    set(state =>
      state.activeSession
        ? {activeSession: {...state.activeSession, checkInTime: isoTime}}
        : state,
    ),

  setCheckOutTime: isoTime =>
    set(state =>
      state.activeSession
        ? {activeSession: {...state.activeSession, checkOutTime: isoTime}}
        : state,
    ),

  setSessionPassCode: code =>
    set(state =>
      state.activeSession
        ? {activeSession: {...state.activeSession, sessionPassCode: code}}
        : state,
    ),

  setElapsedSeconds: seconds => set({liveElapsedSeconds: seconds}),
  setSafetyTimerActive: active => set({safetyTimerActive: active}),
  setNextCheckInAt: isoTime => set({nextCheckInAt: isoTime}),

  setSessionNotes: notes =>
    set(state =>
      state.activeSession
        ? {activeSession: {...state.activeSession, notes}}
        : state,
    ),

  setConfirmedEarning: amount =>
    set(state =>
      state.activeSession
        ? {activeSession: {...state.activeSession, confirmedEarning: amount}}
        : state,
    ),

  updateSessionStatus: (sessionId, status) =>
    set(state => {
      const session =
        state.upcomingSessions.find(s => s.sessionId === sessionId) ??
        (state.activeSession?.sessionId === sessionId ? state.activeSession : null);
      if (!session) {return state;}
      const updated = {...session, status};
      const isActive   = status === 'active' || status === 'checked_in' || status === 'pre_arrival';
      const isTerminal = status === 'completed' || status === 'cancelled' || status === 'no_show' || status === 'disputed';
      return {
        upcomingSessions: state.upcomingSessions.filter(s => s.sessionId !== sessionId),
        activeSession:  isActive   ? updated : isTerminal ? null : state.activeSession,
        sessionHistory: isTerminal ? [updated, ...state.sessionHistory] : state.sessionHistory,
      };
    }),

  setLoadingUpcoming: v => set({isLoadingUpcoming: v}),
  setLoadingHistory: v => set({isLoadingHistory: v}),
  setLoadingActive: v => set({isLoadingActive: v}),
  setError: error => set({error}),

  clearActiveSession: () =>
    set({
      activeSession: null,
      liveElapsedSeconds: 0,
      safetyTimerActive: false,
      nextCheckInAt: null,
    }),
}));
