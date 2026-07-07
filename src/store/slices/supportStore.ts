import i18next from "i18next";import { create } from 'zustand';

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

  // Actions
  createTicket: (category: string, subject: string, description: string, priority: string) => string;
  addTicketReply: (ticketId: string, text: string) => void;
  fileDispute: (category: string, description: string) => void;
  submitDisputeAppeal: (disputeId: string, reason: string) => void;
  sendLiveChatMessage: (text: string) => void;
}

const nowTime = () => new Date().toLocaleTimeString(i18next.language || 'en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
const genId = (prefix: string) => `${prefix}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

const SEED_ARTICLES: HelpArticle[] = [
{
  id: 'general', title: i18next.t("content.slices.supportStore.help_center"), category: 'General', updatedDate: '15 Jun 2026',
  body: [
  'CoBuddy is a companion services platform that connects verified companions with customers for safe, public social experiences.',
  'All sessions must take place in approved public venues. Our guidelines exist to ensure the safety and dignity of all companions on the platform.',
  'If you have a question not covered here, please create a support ticket or start a live chat with our support team.']

},
{
  id: 'disp-001', title: i18next.t("content.slices.supportStore.how_to_dispute_a_review"), category: 'Reviews', updatedDate: '16 Jun 2026',
  body: [
  'If you believe a customer left a factually incorrect or malicious review, you can file a dispute through the Reviews Dashboard.',
  'Navigate to the review, tap the three dots, and select "Report Review". Our trust and safety team will evaluate the review against our community guidelines.']

},
{
  id: 'pay-002', title: i18next.t("content.slices.supportStore.understanding_payouts"), category: 'Payments', updatedDate: '16 Jun 2026',
  body: [
  'Payouts are batched and processed every Tuesday for all sessions completed in the prior week.',
  'If your payout is delayed, please ensure your bank details are up to date in the Settings > Bank Details screen before raising a ticket.']

},
{
  id: 'pay-001', title: i18next.t("content.slices.supportStore.how_does_payment_work"), category: 'Payments', updatedDate: '15 Jun 2026',
  body: [
  'CoBuddy processes payments automatically after each session is marked complete. Funds are transferred to your registered bank account within 3–5 business days.',
  'For sessions cancelled with less than 2 hours notice, you receive a 50% cancellation fee. Full payment is made for sessions where the customer is a no-show after 30 minutes.',
  'You can view all earnings, pending amounts, and payout history from the Earnings tab. Raise a payment dispute if you believe there is an error.']

},
{
  id: 'can-001', title: i18next.t("content.slices.supportStore.what_if_a_customer_cancels"), category: 'Sessions', updatedDate: '15 Jun 2026',
  body: [
  'If a customer cancels a confirmed session, you will be notified immediately via the app and SMS. You can accept a new booking or mark yourself unavailable for that slot.',
  'Cancellations with less than 2 hours notice qualify for a partial payment (50% of the session fee). This is processed automatically and appears in your earnings within 24 hours.',
  'Repeated cancellations by the same customer can be reported via the Report Customer flow. CoBuddy monitors cancellation patterns and may restrict customers who habitually cancel.']

},
{
  id: 'rep-001', title: i18next.t("content.slices.supportStore.how_to_report_unsafe_behavior"), category: 'Safety', updatedDate: '15 Jun 2026',
  body: [
  'Your safety is CoBuddy\'s top priority. If you feel unsafe at any point during a session, use the SOS button available in the Active Session screen or the Safety Hub.',
  'To report a customer after a session, go to Session Detail > Report Customer and select the appropriate category. Our safety team reviews every report within 24 hours.',
  'You can also file a detailed Incident Report via the Safety Hub. Attach screenshots or evidence to strengthen your report. All reports are treated with strict confidentiality.']

}];


const SEED_TICKETS: SupportTicket[] = [
{
  id: 'TKT-001',
  category: 'Payment Issue',
  subject: 'Payment not credited after session',
  description: 'I finished a session yesterday but the payment hasn\'t reflected.',
  priority: 'Normal',
  status: 'Open',
  date: 'Created today',
  messages: [
  { id: '1', from: 'agent', text: 'Thank you for contacting CoBuddy Support. We are looking into this.', time: '10:30 AM' },
  { id: '2', from: 'me', text: 'Please resolve this soon, it is affecting my earnings.', time: '10:45 AM' },
  { id: '3', from: 'agent', text: 'We have escalated this to our payments team. You\'ll hear from us shortly.', time: '11:00 AM' }]

}];


const SEED_DISPUTES: Dispute[] = [
{
  id: 'DIS-001',
  category: 'Payment not received',
  description: 'Customer did not show up.',
  sessionId: '28 Jun 2026',
  customerName: 'Arjun Mehta',
  amount: '₹1,500',
  status: 'Under Review',
  createdAgo: '3 days ago',
  timeline: [
  { date: '28 Jun, 10:00 AM', desc: 'Dispute filed by companion' },
  { date: '28 Jun, 02:00 PM', desc: 'Case assigned to review team' },
  { date: '29 Jun, 09:00 AM', desc: 'Under active review — evidence collected' }]

},
{
  id: 'DIS-002',
  category: 'Unfair cancellation',
  description: 'Customer cancelled last minute.',
  sessionId: '10 Jun 2026',
  customerName: 'Pooja Sharma',
  amount: '₹800',
  status: 'Resolved',
  outcome: 'Ruled in your favor',
  createdAgo: '18 days ago',
  timeline: [
  { date: '10 Jun, 10:00 AM', desc: 'Dispute filed by companion' },
  { date: '12 Jun, 02:00 PM', desc: 'Case resolved' }]

}];


export const useSupportStore = create<SupportState>((set) => ({
  articles: SEED_ARTICLES,
  tickets: SEED_TICKETS,
  disputes: SEED_DISPUTES,
  liveChatMessages: [
  { id: '1', from: 'agent', text: "Hi! I'm Maya from CoBuddy Support. How can I help you today?", time: nowTime() }],


  createTicket: (category, subject, desc, priority) => {
    const id = genId('TKT');
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
  },

  addTicketReply: (ticketId, text) => {
    const msg: Message = { id: String(Date.now()), from: 'me', text, time: nowTime() };
    set((state) => ({
      tickets: state.tickets.map((t) =>
      t.id === ticketId ?
      { ...t, messages: [...t.messages, msg] } :
      t
      )
    }));
  },

  fileDispute: (category, description) => {
    const id = genId('DIS');
    const newDispute: Dispute = {
      id,
      category,
      description,
      sessionId: new Date().toLocaleDateString(i18next.language || 'en-GB'),
      customerName: 'N/A', // Real app would pull from sessionStore
      amount: '₹0',
      status: 'Under Review',
      createdAgo: 'Just now',
      timeline: [{ date: new Date().toLocaleDateString(i18next.language || 'en-GB'), desc: 'Dispute filed by companion' }]
    };
    set((state) => ({
      disputes: [newDispute, ...state.disputes]
    }));
  },

  submitDisputeAppeal: (disputeId, reason) => {
    set((state) => ({
      disputes: state.disputes.map((d) =>
      d.id === disputeId ?
      {
        ...d,
        status: 'Under Review',
        outcome: undefined,
        timeline: [...d.timeline, { date: new Date().toLocaleDateString(i18next.language || 'en-GB'), desc: `Appeal filed: ${reason}` }]
      } :
      d
      )
    }));
  },

  sendLiveChatMessage: (text) => {
    const msg: Message = { id: String(Date.now()), from: 'me', text, time: nowTime() };
    set((state) => ({
      liveChatMessages: [...state.liveChatMessages, msg]
    }));

    // Simulate agent response
    setTimeout(() => {
      set((state) => ({
        liveChatMessages: [...state.liveChatMessages, {
          id: String(Date.now() + 1),
          from: 'agent',
          text: 'Thank you for reaching out! Let me check that for you right away.',
          time: nowTime()
        }]
      }));
    }, 1200);
  }
}));