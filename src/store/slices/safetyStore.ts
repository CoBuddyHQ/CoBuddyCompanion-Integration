/**
 * CoBuddy Companion App — Safety Store (Zustand)
 * Manages SOS state, safety timer, trusted contacts, and incident reports.
 * PRIVACY: Trusted contacts stored with masked phone only.
 * CRITICAL: SOS state must never be silently cleared while a session is live.
 */

import {create} from 'zustand';
import type {
  TrustedContact,
  SafetyTimerStatus,
} from '../types/store.types';

export interface SafetyTimerState {
  status: SafetyTimerStatus;
  durationMinutes: number;
  startedAt: string | null;
  expiresAt: number | null; // Changed to numeric timestamp for easy calculation
  sessionId: string | null;
}

export type SOSStatus = 'idle' | 'triggered' | 'confirmed' | 'resolved';

interface IncidentReport {
  reportId: string;
  sessionId: string | null;
  description: string;
  category: string;
  submittedAt: string;      // ISO datetime
  status: 'submitted' | 'under_review' | 'resolved';
}

interface SafetyState {
  // SOS
  sosStatus: SOSStatus;
  sosTriggeredAt: string | null;   // ISO datetime

  // Safety Timer
  timer: SafetyTimerState;

  // Trusted Contacts
  trustedContacts: TrustedContact[];

  // Incident Reports
  incidentReports: IncidentReport[];

  // Blocked Customers
  blockedCustomers: string[];

  // Venue Safety Flags
  currentVenueApproved: boolean;
  currentVenueName: string | null;

  // Loading
  isLoadingContacts: boolean;
  error: string | null;

  // SOS Actions
  triggerSOS: () => void;
  confirmSOS: () => void;
  resolveSOS: () => void;
  resetSOS: () => void;

  // Timer Actions
  startTimer: (durationMinutes: number, sessionId: string | null) => void;
  cancelTimer: () => void;
  expireTimer: () => void;
  setTimerStatus: (status: SafetyTimerStatus) => void;

  // Trusted Contacts
  setTrustedContacts: (contacts: TrustedContact[]) => void;
  addTrustedContact: (contact: TrustedContact) => void;
  updateTrustedContact: (contact: TrustedContact) => void;
  removeTrustedContact: (contactId: string) => void;

  // Incident Reports
  addIncidentReport: (report: IncidentReport) => void;
  setIncidentReports: (reports: IncidentReport[]) => void;

  // Blocked Customers
  blockCustomer: (customerName: string) => void;

  // Venue
  setCurrentVenue: (approved: boolean, venueName: string | null) => void;

  // Loading
  setLoadingContacts: (v: boolean) => void;
  setError: (error: string | null) => void;

  // ── Safety feature toggles ──────────────────────────────────────────────
  locationTracking: boolean;
  autoCheckIn:      boolean;
  disguisedCall:    boolean;
  toggleSetting: (key: 'locationTracking' | 'autoCheckIn' | 'disguisedCall') => void;

  // ── Screen-friendly contact helpers ────────────────────────────────────
  // These work with the local Contact shape: {id, name, phone, relation, isPrimary}
  addContact:    (c: {id: string; name: string; phone: string; relation: string; isPrimary: boolean}) => void;
  updateContact: (c: {id: string; name: string; phone: string; relation: string; isPrimary: boolean}) => void;
  removeContact: (id: string) => void;
}

const INITIAL_TIMER: SafetyTimerState = {
  status: 'idle',
  durationMinutes: 30,
  startedAt: null,
  expiresAt: null,
  sessionId: null,
};

export const useSafetyStore = create<SafetyState>(set => ({
  sosStatus: 'idle',
  sosTriggeredAt: null,
  timer: INITIAL_TIMER,
  trustedContacts: [],
  incidentReports: [],
  blockedCustomers: [],
  currentVenueApproved: false,
  currentVenueName: null,
  isLoadingContacts: false,
  error: null,

  // ── SOS ──────────────────────────────────────────────────────────────────
  triggerSOS: () =>
    set({sosStatus: 'triggered', sosTriggeredAt: new Date().toISOString()}),

  confirmSOS: () => set({sosStatus: 'confirmed'}),

  resolveSOS: () => set({sosStatus: 'resolved'}),

  resetSOS: () => set({sosStatus: 'idle', sosTriggeredAt: null}),

  // ── Timer ─────────────────────────────────────────────────────────────────
  startTimer: (durationMinutes, sessionId) => {
    const startedAt = new Date().toISOString();
    const expiresAt = Date.now() + durationMinutes * 60 * 1000;
    set({
      timer: {
        status: 'active',
        durationMinutes,
        startedAt,
        expiresAt,
        sessionId,
      },
    });
  },

  cancelTimer: () =>
    set({timer: {...INITIAL_TIMER, status: 'cancelled'}}),

  expireTimer: () =>
    set(state => ({
      timer: {...state.timer, status: 'expired'},
    })),

  setTimerStatus: status =>
    set(state => ({timer: {...state.timer, status}})),

  // ── Trusted Contacts ──────────────────────────────────────────────────────
  setTrustedContacts: contacts => set({trustedContacts: contacts}),

  addTrustedContact: contact =>
    set(state => ({
      trustedContacts: [...state.trustedContacts, contact],
    })),

  updateTrustedContact: contact =>
    set(state => ({
      trustedContacts: state.trustedContacts.map(c =>
        c.contactId === contact.contactId ? contact : c,
      ),
    })),

  removeTrustedContact: contactId =>
    set(state => ({
      trustedContacts: state.trustedContacts.filter(
        c => c.contactId !== contactId,
      ),
    })),

  // ── Incident Reports ──────────────────────────────────────────────────────
  addIncidentReport: report =>
    set(state => ({
      incidentReports: [report, ...state.incidentReports],
    })),

  setIncidentReports: reports => set({incidentReports: reports}),

  // ── Blocked Customers ──────────────────────────────────────────────────────
  blockCustomer: (customerName: string) =>
    set(state => ({
      blockedCustomers: [...state.blockedCustomers, customerName],
    })),

  // ── Venue ─────────────────────────────────────────────────────────────────
  setCurrentVenue: (approved, venueName) =>
    set({currentVenueApproved: approved, currentVenueName: venueName}),

  // ── Loading ───────────────────────────────────────────────────────────────
  setLoadingContacts: v => set({isLoadingContacts: v}),
  setError: error => set({error}),

  // ── Feature toggles ────────────────────────────────────────────────────────
  locationTracking: true,
  autoCheckIn:      true,
  disguisedCall:    false,
  toggleSetting: key => set(state => ({[key]: !state[key as keyof SafetyState]})),

  // ── Screen-friendly contact helpers ──────────────────────────────────────
  addContact: c =>
    set(state => {
      // If new contact is primary, demote all existing primaries
      const base: TrustedContact[] = c.isPrimary
        ? state.trustedContacts.map(t => ({...t, isEmergencyContact: false}))
        : [...state.trustedContacts];
      const newEntry: TrustedContact = {
        contactId: c.id,
        name: c.name,
        maskedPhone: c.phone,
        relationship: c.relation,
        isEmergencyContact: c.isPrimary,
      };
      return {trustedContacts: [...base, newEntry]};
    }),

  updateContact: c =>
    set(state => ({
      trustedContacts: state.trustedContacts.map(t => {
        if (t.contactId === c.id) {
          return {
            contactId: c.id,
            name: c.name,
            maskedPhone: c.phone,
            relationship: c.relation,
            isEmergencyContact: c.isPrimary,
          };
        }
        // If updated is primary, demote others
        if (c.isPrimary) {return {...t, isEmergencyContact: false};}
        return t;
      }),
    })),

  removeContact: id =>
    set(state => ({
      trustedContacts: state.trustedContacts.filter(t => t.contactId !== id),
    })),
}));
