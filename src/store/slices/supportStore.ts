import { create } from 'zustand';
import { SupportService } from '../../services/api/services/index';

export interface HelpArticle {
  id: string;
  title: string;
  category: string;
  body: string[];
  updatedDate: string;
}

export interface Message {
  id: string;
  from: 'agent' | 'me';
  text: string;
  time: string;
}

export interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: 'Open' | 'Closed';
  date: string;
  messages: Message[];
}

export interface DisputeTimelineEvent {
  date: string;
  desc: string;
}

export interface Dispute {
  id: string;
  category: string;
  description: string;
  sessionId: string;
  customerName: string;
  amount: string;
  status: 'Under Review' | 'Resolved';
  outcome?: string;
  timeline: DisputeTimelineEvent[];
  createdAgo: string;
}

interface SupportState {
  articles: HelpArticle[];
  tickets: SupportTicket[];
  disputes: Dispute[];
  liveChatMessages: Message[];

  isLoading: boolean;
  error: string | null;

  // Actions
  fetchArticles: () => Promise<void>;
  fetchTickets: () => Promise<void>;
  createTicket: (category: string, subject: string, description: string, priority: string) => Promise<string>;
  addTicketReply: (ticketId: string, text: string) => Promise<void>;
  
  fetchDisputes: () => Promise<void>;
  fileDispute: (category: string, description: string, sessionId?: string) => Promise<void>;
  submitDisputeAppeal: (disputeId: string, reason: string) => Promise<void>;
  
  sendLiveChatMessage: (text: string) => void;
  receiveLiveChatMessage: (msg: any) => void;
}

const nowTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
const genId = (prefix: string) => `${prefix}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

export const useSupportStore = create<SupportState>((set, get) => ({
  articles: [
    // Retaining basic static articles for FAQ, can be replaced by an API call later
    {
      id: 'general', title: 'Help Center', category: 'General', updatedDate: '15 Jun 2026',
      body: [
      'CoBuddy is a companion services platform that connects verified companions with customers for safe, public social experiences.',
      'All sessions must take place in approved public venues. Our guidelines exist to ensure the safety and dignity of all companions on the platform.',
      'If you have a question not covered here, please create a support ticket or start a live chat with our support team.']
    },
    {
      id: 'disp-001', title: 'How to dispute a review', category: 'Reviews', updatedDate: '16 Jun 2026',
      body: [
      'If you believe a customer left a factually incorrect or malicious review, you can file a dispute through the Reviews Dashboard.',
      'Navigate to the review, tap the three dots, and select "Report Review". Our trust and safety team will evaluate the review against our community guidelines.']
    }
  ],
  tickets: [],
  disputes: [],
  liveChatMessages: [
    { id: '1', from: 'agent', text: "Hi! I'm Maya from CoBuddy Support. How can I help you today?", time: nowTime() }
  ],
  isLoading: false,
  error: null,

  fetchArticles: async () => {
    set({ isLoading: true, error: null });
    try {
      const res: any = await SupportService.getHelpCategories();
      const articles = Array.isArray(res) ? res : res?.articles ?? [];
      if (articles.length > 0) {
        set({ articles });
      }
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch help articles' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTickets: async () => {
    set({ isLoading: true, error: null });
    try {
      const tickets = await SupportService.getTickets();
      set({ tickets: Array.isArray(tickets) ? tickets : (tickets as any).tickets ?? [] });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch tickets' });
    } finally {
      set({ isLoading: false });
    }
  },

  createTicket: async (category, subject, desc, priority) => {
    set({ isLoading: true, error: null });
    try {
      const res: any = await SupportService.createTicket({ category, subject, description: desc });
      const id = res.id || genId('TKT');
      set((state) => ({
        tickets: [{
          id,
          category,
          subject,
          description: desc,
          priority,
          status: 'Open',
          date: 'Created just now',
          messages: []
        }, ...state.tickets]
      }));
      return id;
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to create ticket' });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  addTicketReply: async (ticketId, text) => {
    const msg: Message = { id: String(Date.now()), from: 'me', text, time: nowTime() };
    // Optimistic UI update
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId ? { ...t, messages: [...t.messages, msg] } : t
      )
    }));

    try {
      await SupportService.sendMessage(ticketId, text);
    } catch (e: unknown) {
      // Typically we'd revert the UI or show an error state on the message
    }
  },

  fetchDisputes: async () => {
    set({ isLoading: true, error: null });
    try {
      const disputes = await SupportService.getDisputes();
      set({ disputes: Array.isArray(disputes) ? disputes : (disputes as any).disputes ?? [] });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch disputes' });
    } finally {
      set({ isLoading: false });
    }
  },

  fileDispute: async (category, description, sessionId) => {
    set({ isLoading: true, error: null });
    try {
      const res: any = await SupportService.fileDispute({ reason: category, description, sessionId });
      const id = res.id || genId('DIS');
      const newDispute: Dispute = {
        id,
        category,
        description,
        sessionId: sessionId || 'N/A',
        customerName: 'N/A', // Real app would pull from sessionStore
        amount: '₹0',
        status: 'Under Review',
        createdAgo: 'Just now',
        timeline: [{ date: new Date().toLocaleDateString('en-GB'), desc: 'Dispute filed by companion' }]
      };
      set((state) => ({ disputes: [newDispute, ...state.disputes] }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to file dispute' });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  submitDisputeAppeal: async (disputeId, reason) => {
    set({ isLoading: true, error: null });
    try {
      await SupportService.appealDispute(disputeId, { reason });
      set((state) => ({
        disputes: state.disputes.map((d) =>
          d.id === disputeId ?
          {
            ...d,
            status: 'Under Review',
            outcome: undefined,
            timeline: [...d.timeline, { date: new Date().toLocaleDateString('en-GB'), desc: `Appeal filed: ${reason}` }]
          } : d
        )
      }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to submit appeal' });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  sendLiveChatMessage: (text) => {
    const newMsg: Message = { id: genId('msg'), from: 'me', text, time: nowTime() };
    set(state => ({ liveChatMessages: [...state.liveChatMessages, newMsg] }));
    // Note: Emitting to socket will be handled by UI layer calling socketService
  },

  receiveLiveChatMessage: (msg: any) => {
    const newMsg: Message = { 
      id: msg.id || genId('msg'), 
      from: msg.senderType === 'companion' ? 'me' : 'agent', 
      text: msg.text, 
      time: msg.time || new Date(msg.timestamp || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) 
    };
    set(state => ({ liveChatMessages: [...state.liveChatMessages, newMsg] }));
  }
}));