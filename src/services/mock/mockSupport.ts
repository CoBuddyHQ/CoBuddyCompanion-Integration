/**
 * CoBuddy Companion App — Mock Support & Dispute Data
 * Support tickets and dispute records for companion support module.
 * CONTENT RULE: All issues relate to earnings, sessions, safety, or platform policy.
 */

import type {SupportTicket} from '../../store/types/store.types';

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  {
    ticketId: 'TKT-CB-8821',
    category: 'earnings_payout',
    status: 'resolved',
    subject: 'Payout not credited after 3 business days',
    description:
      'My payout of \u20B918,600 requested on 12 June was not credited by the expected date. The payout ID is PAYOUT-CB-9120.',
    sessionId: null,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    ticketId: 'TKT-CB-8802',
    category: 'session_issue',
    status: 'in_progress',
    subject: 'Session earning under review for more than 48 hours',
    description:
      'The earning for session CB-SE-2044 (City Walk, 17 June) has been under review for over 48 hours. Expected clearance was within 24 hours.',
    sessionId: 'CB-SE-2044',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    resolvedAt: null,
  },
];

export interface MockDispute {
  disputeId: string;
  sessionId: string;
  status: 'open' | 'under_review' | 'resolved' | 'appeal_filed';
  category: string;
  description: string;
  customerInitials: string;
  raisedBy: 'companion' | 'customer' | 'system';
  resolutionSummary: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export const MOCK_DISPUTES: MockDispute[] = [
  {
    disputeId: 'DISP-CB-3301',
    sessionId: 'CB-SE-2035',
    status: 'resolved',
    category: 'Early Session End',
    description:
      'Customer left the approved venue 30 minutes before the session end time without formally requesting an early close through the app.',
    customerInitials: 'S.K.',
    raisedBy: 'companion',
    resolutionSummary:
      'CoBuddy reviewed the session timeline and check-in records. Earnings adjusted to reflect the completed time (60 of 90 minutes). No penalty applied to companion.',
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
