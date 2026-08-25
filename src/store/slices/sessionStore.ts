/**
 * CoBuddy Companion App — Session Store (Zustand)
 * ✅ INTEGRATED: Real API calls via SessionsService.
 * Manages upcoming, active, and historical sessions.
 * Tracks live session state (check-in, timer, SOS status).
 * PRIVACY: Customer data stored as summary with masked/initials only.
 */

import { create } from 'zustand';
import type { Session, SessionStatus } from '../types/store.types';
import { SessionsService } from '../../services/api/services/sessions.service';

export interface ChatMessage {
  id: string;
  senderId?: string;
  senderType?: 'companion' | 'customer';
  sender?: 'companion' | 'customer'; // legacy support for UI
  text: string;
  time?: string;
  timestamp?: string;
  status?: 'sent' | 'read';
}

interface SessionState {
  // Lists
  upcomingSessions: Session[];
  sessionHistory: Session[];

  // Active session (one at a time)
  activeSession: Session | null;
  liveElapsedSeconds: number;    // Updated by timer tick
  safetyTimerActive: boolean;
  nextCheckInAt: string | null;  // ISO datetime — scheduled periodic check-in
  
  // Real-time Chat
  chatMessages: ChatMessage[];

  // Loading states
  isLoadingUpcoming: boolean;
  isLoadingHistory: boolean;
  isLoadingActive: boolean;
  error: string | null;

  // ── API Actions ────────────────────────────────────────────────────────────
  fetchUpcomingSessions: () => Promise<void>;
  fetchSessionHistory: (page?: number, limit?: number) => Promise<void>;
  fetchActiveSession: () => Promise<void>;

  /** Start a session (pre_arrival -> active via backend) */
  startSession: (sessionId: string, passCode: string) => Promise<void>;
  /** End a session (active -> completed via backend) */
  endSession: (sessionId: string) => Promise<void>;

  checkInSession: (sessionId: string) => Promise<void>;
  requestExtension: (sessionId: string, extraMinutes: number) => Promise<void>;
  confirmExtension: (sessionId: string, extraMinutes: number) => Promise<void>;
  endEarly: (sessionId: string, reason?: string) => Promise<void>;
  cancelSession: (sessionId: string, reason: string, details?: string) => Promise<void>;
  markNoShow: (sessionId: string) => Promise<void>;
  saveNotes: (sessionId: string, notes: string, isPrivate?: boolean) => Promise<void>;
  rateCustomer: (sessionId: string, rating: number, highlights?: string[], comment?: string, isPublic?: boolean) => Promise<void>;
  fetchChatMessages: (sessionId: string) => Promise<void>;
  sendChatMessage: (sessionId: string, message: string) => Promise<void>;
  getCallToken: (sessionId: string) => Promise<string>;
  updateLocation: (sessionId: string, latitude: number, longitude: number, accuracy?: number) => Promise<void>;
  stopLocationSharing: (sessionId: string) => Promise<void>;

  // ── List actions (local state updates) ─────────────────────────────────────
  setUpcomingSessions: (sessions: Session[]) => void;
  setSessionHistory: (sessions: Session[]) => void;
  upsertSession: (session: Session) => void;
  removeSessionById: (sessionId: string) => void;

  // ── Active session actions ─────────────────────────────────────────────────
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

  // Chat
  addChatMessage: (msg: any) => void;
  setChatMessages: (msgs: ChatMessage[]) => void;

  // Loading
  setLoadingUpcoming: (v: boolean) => void;
  setLoadingHistory: (v: boolean) => void;
  setLoadingActive: (v: boolean) => void;
  setError: (error: string | null) => void;
  clearActiveSession: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  upcomingSessions: [],
  sessionHistory: [],
  activeSession: null,
  liveElapsedSeconds: 0,
  safetyTimerActive: false,
  nextCheckInAt: null,
  chatMessages: [],
  isLoadingUpcoming: false,
  isLoadingHistory: false,
  isLoadingActive: false,
  error: null,

  // ── fetchUpcomingSessions ──────────────────────────────────────────────────
  fetchUpcomingSessions: async () => {
    set({ isLoadingUpcoming: true, error: null });
    try {
      const res = await SessionsService.getUpcoming();
      // res could be { sessions: Session[] } or Session[] based on backend
      const sessions = Array.isArray(res) ? res : (res as any).sessions ?? [];
      set({ upcomingSessions: sessions });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to load upcoming sessions' });
    } finally {
      set({ isLoadingUpcoming: false });
    }
  },

  // ── fetchSessionHistory ────────────────────────────────────────────────────
  fetchSessionHistory: async (page = 1, limit = 20) => {
    set({ isLoadingHistory: true, error: null });
    try {
      const res = await SessionsService.getHistory(page, limit);
      const sessions = Array.isArray(res) ? res : (res as any).sessions ?? [];
      
      set(state => ({
        // Append if paginating, replace if first page
        sessionHistory: page === 1 ? sessions : [...state.sessionHistory, ...sessions]
      }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to load session history' });
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  // ── fetchActiveSession ─────────────────────────────────────────────────────
  fetchActiveSession: async () => {
    set({ isLoadingActive: true, error: null });
    try {
      // Logic assumes you list upcoming and find the 'active' one.
      // Alternatively, you can add an endpoint for GET /companion/sessions/active
      const res = await SessionsService.getUpcoming();
      const sessions = Array.isArray(res) ? res : (res as any).sessions ?? [];
      
      const active = sessions.find((s: Session) => 
        ['pre_arrival', 'checked_in', 'active'].includes(s.status)
      );
      
      if (active) {
        set({ activeSession: active, liveElapsedSeconds: 0 }); // reset timer locally on load
      } else {
        set({ activeSession: null });
      }
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to load active session' });
    } finally {
      set({ isLoadingActive: false });
    }
  },

  // ── startSession ───────────────────────────────────────────────────────────
  startSession: async (sessionId, passCode) => {
    set({ isLoadingActive: true, error: null });
    try {
      await SessionsService.verifyCustomer(sessionId, { passCode });
      
      // Update local state directly so UI responds instantly
      get().updateSessionStatus(sessionId, 'active');
      set({ liveElapsedSeconds: 0 });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to start session' });
      throw e;
    } finally {
      set({ isLoadingActive: false });
    }
  },

  // ── endSession ─────────────────────────────────────────────────────────────
  endSession: async (sessionId) => {
    set({ isLoadingActive: true, error: null });
    try {
      await SessionsService.completeSession(sessionId);
      
      // Move to history
      get().updateSessionStatus(sessionId, 'completed');
      set({ activeSession: null, liveElapsedSeconds: 0, safetyTimerActive: false });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to end session' });
      throw e;
    } finally {
      set({ isLoadingActive: false });
    }
  },

  checkInSession: async (sessionId) => {
    set({ isLoadingActive: true, error: null });
    try {
      await SessionsService.checkIn(sessionId);
      get().updateSessionStatus(sessionId, 'checked_in');
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to check in' });
      throw e;
    } finally {
      set({ isLoadingActive: false });
    }
  },

  requestExtension: async (sessionId, extraMinutes) => {
    set({ isLoadingActive: true, error: null });
    try {
      await SessionsService.requestExtension(sessionId, { extraMinutes });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to request extension' });
      throw e;
    } finally {
      set({ isLoadingActive: false });
    }
  },

  confirmExtension: async (sessionId, extraMinutes) => {
    set({ isLoadingActive: true, error: null });
    try {
      await SessionsService.confirmExtension(sessionId, { extraMinutes });
      const current = get().activeSession;
      if (current && current.sessionId === sessionId) {
        set({
          activeSession: {
            ...current,
            durationMinutes: current.durationMinutes + extraMinutes,
          },
        });
      }
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to confirm extension' });
      throw e;
    } finally {
      set({ isLoadingActive: false });
    }
  },

  endEarly: async (sessionId, reason) => {
    set({ isLoadingActive: true, error: null });
    try {
      await SessionsService.endEarly(sessionId, { reason });
      get().updateSessionStatus(sessionId, 'completed');
      set({ activeSession: null, liveElapsedSeconds: 0, safetyTimerActive: false });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to end session early' });
      throw e;
    } finally {
      set({ isLoadingActive: false });
    }
  },

  cancelSession: async (sessionId, reason, details) => {
    set({ isLoadingActive: true, error: null });
    try {
      await SessionsService.cancelSession(sessionId, { reason, details });
      get().updateSessionStatus(sessionId, 'cancelled');
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to cancel session' });
      throw e;
    } finally {
      set({ isLoadingActive: false });
    }
  },

  markNoShow: async (sessionId) => {
    set({ isLoadingActive: true, error: null });
    try {
      await SessionsService.markNoShow(sessionId);
      get().updateSessionStatus(sessionId, 'no_show');
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to mark no-show' });
      throw e;
    } finally {
      set({ isLoadingActive: false });
    }
  },

  saveNotes: async (sessionId, notes, isPrivate = true) => {
    set({ error: null });
    try {
      await SessionsService.saveNotes(sessionId, { notes, isPrivate });
      get().setSessionNotes(notes);
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to save notes' });
      throw e;
    }
  },

  rateCustomer: async (sessionId, rating, highlights = [], comment = '', isPublic = false) => {
    set({ error: null });
    try {
      await SessionsService.rateCustomer(sessionId, { rating, highlights, comment, isPublic });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to rate customer' });
      throw e;
    }
  },

  fetchChatMessages: async (sessionId) => {
    set({ error: null });
    try {
      const res = await SessionsService.getChatHistory(sessionId);
      if (res && Array.isArray(res)) {
        get().setChatMessages(res);
      }
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch chat messages' });
    }
  },

  sendChatMessage: async (sessionId, text) => {
    set({ error: null });
    try {
      const res = await SessionsService.sendChatMessage(sessionId, { message: text });

      get().addChatMessage(res);
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to send message' });
      throw e;
    }
  },

  getCallToken: async (sessionId) => {
    set({ error: null });
    try {
      const res = await SessionsService.getCallToken(sessionId);
      return (res as any)?.token || '';

    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to get call token' });
      throw e;
    }
  },

  updateLocation: async (sessionId, latitude, longitude, accuracy) => {
    try {
      await SessionsService.updateLocation(sessionId, { latitude, longitude, accuracy });
    } catch (e: unknown) {
      console.warn('Failed to update location', e);
    }
  },

  stopLocationSharing: async (sessionId) => {
    try {
      await SessionsService.stopLocationSharing(sessionId);
    } catch (e: unknown) {
      console.warn('Failed to stop location sharing', e);
    }
  },

  // ── Local Setters ──────────────────────────────────────────────────────────
  setUpcomingSessions: sessions => set({ upcomingSessions: sessions }),
  setSessionHistory: sessions => set({ sessionHistory: sessions }),

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

  setActiveSession: session => set({ activeSession: session, liveElapsedSeconds: 0 }),

  updateActiveSessionStatus: status =>
    set(state =>
      state.activeSession
        ? { activeSession: { ...state.activeSession, status } }
        : state,
    ),

  setCheckInTime: isoTime =>
    set(state =>
      state.activeSession
        ? { activeSession: { ...state.activeSession, checkInTime: isoTime } }
        : state,
    ),

  setCheckOutTime: isoTime =>
    set(state =>
      state.activeSession
        ? { activeSession: { ...state.activeSession, checkOutTime: isoTime } }
        : state,
    ),

  setSessionPassCode: code =>
    set(state =>
      state.activeSession
        ? { activeSession: { ...state.activeSession, sessionPassCode: code } }
        : state,
    ),

  setElapsedSeconds: seconds => set({ liveElapsedSeconds: seconds }),
  setSafetyTimerActive: active => set({ safetyTimerActive: active }),
  setNextCheckInAt: isoTime => set({ nextCheckInAt: isoTime }),

  setSessionNotes: notes =>
    set(state =>
      state.activeSession
        ? { activeSession: { ...state.activeSession, notes } }
        : state,
    ),

  setConfirmedEarning: amount =>
    set(state =>
      state.activeSession
        ? { activeSession: { ...state.activeSession, confirmedEarning: amount } }
        : state,
    ),

  // ── Chat Actions ───────────────────────────────────────────────────────────
  addChatMessage: (msg: any) => {
    // Map backend format to UI format if needed
    const mapped: ChatMessage = {
      id: msg.id || String(Date.now()),
      text: msg.text,
      sender: msg.senderType === 'companion' || msg.sender === 'companion' ? 'companion' : 'customer',
      time: msg.time || new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      status: msg.status || 'sent',
    };
    set(state => ({ chatMessages: [...state.chatMessages, mapped] }));
  },
  
  setChatMessages: (msgs: ChatMessage[]) => set({ chatMessages: msgs }),

  updateSessionStatus: (sessionId, status) =>
    set(state => {
      const session =
        state.upcomingSessions.find(s => s.sessionId === sessionId) ??
        (state.activeSession?.sessionId === sessionId ? state.activeSession : null);
      if (!session) { return state; }
      
      const updated = { ...session, status };
      const isActive   = status === 'active' || status === 'checked_in' || status === 'pre_arrival';
      const isTerminal = status === 'completed' || status === 'cancelled' || status === 'no_show' || status === 'disputed';
      
      return {
        upcomingSessions: state.upcomingSessions.filter(s => s.sessionId !== sessionId),
        activeSession:  isActive   ? updated : isTerminal ? null : state.activeSession,
        sessionHistory: isTerminal ? [updated, ...state.sessionHistory] : state.sessionHistory,
      };
    }),

  setLoadingUpcoming: v => set({ isLoadingUpcoming: v }),
  setLoadingHistory: v => set({ isLoadingHistory: v }),
  setLoadingActive: v => set({ isLoadingActive: v }),
  setError: error => set({ error }),

  clearActiveSession: () =>
    set({
      activeSession: null,
      liveElapsedSeconds: 0,
      safetyTimerActive: false,
      nextCheckInAt: null,
    }),
}));
