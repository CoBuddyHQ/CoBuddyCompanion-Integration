/**
 * CoBuddy Companion — Training Store (Zustand)
 * ✅ INTEGRATED: Real API calls via TrainingService.
 */
import { create } from 'zustand';
import { TrainingService } from '../../services/api/services/index';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  required: boolean;
  body: string[];
  takeaways: string[];
}

interface TrainingState {
  lessons: Lesson[];
  completedLessons: string[];
  isLoading: boolean;
  error: string | null;

  fetchLessons: () => Promise<void>;
  markLessonCompleted: (lessonId: string) => Promise<void>;
}

export const useTrainingStore = create<TrainingState>((set, get) => ({
  lessons: [
    // Retaining basic static lessons, to be hydrated by fetchLessons
    {
      id: '1',
      title: 'Platform Safety Basics',
      duration: '5 min',
      required: true,
      body: [
      'CoBuddy operates exclusively in safe, public, vetted venues. Before every session, both companion and customer must verify the location on the platform. Never agree to meet in private residences.',
      'Your safety toolkit is always available via the Safety Hub. This includes the SOS button, live location sharing with trusted contacts, and direct access to CoBuddy\'s 24/7 safety line.',
      'If at any point you feel uncomfortable during a session, you have every right to end it early. Use the Early End Session button in the Active Session screen. Your safety always comes first.'],
      takeaways: [
      'Always verify venue before session starts',
      'SOS and location sharing are available at all times',
      'You can end any session early — no questions asked']
    },
    {
      id: '2',
      title: 'Handling Difficult Situations',
      duration: '8 min',
      required: true,
      body: [
      'Difficult situations can arise even with the most thorough vetting. Stay calm — use neutral, non-confrontational language. Acknowledge the customer\'s concern without agreeing or escalating.',
      'CoBuddy\'s guidelines prohibit any requests that make you feel unsafe or violate the platform\'s code of conduct. Politely decline and end the session if needed. Document what happened immediately after.',
      'After any difficult situation, file an Incident Report via the Safety Hub. Include as much detail as possible. Reports are reviewed within 24 hours and help keep the platform safe for all companions.'],
      takeaways: [
      'Stay calm and use neutral language',
      'Decline and leave if you feel unsafe',
      'Always file an Incident Report afterward']
    },
    {
      id: '3',
      title: 'How to Maximize Earnings',
      duration: '6 min',
      required: false,
      body: [
      'Your earnings depend on how well your profile showcases your strengths. Use high-quality photos, a compelling bio, and keep your categories updated. Profiles with complete information get 3× more views.',
      'Peak booking times are evenings and weekends. Block your calendar strategically — stay available during these windows while protecting your personal time. Consistent availability improves your ranking.',
      'Ask customers for a review after every successful session. Companions with 20+ reviews earn significantly more per booking. A polite in-app nudge sent within 30 minutes of session end gets the best response rate.'],
      takeaways: [
      'Complete profiles earn 3× more bookings',
      'Stay available on evenings and weekends',
      'Request reviews within 30 min of session end']
    }
  ],
  completedLessons: [],
  isLoading: false,
  error: null,

  fetchLessons: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await TrainingService.getModules();
      const lessons = Array.isArray(res) ? res : (res as any).modules ?? [];
      if (lessons.length > 0) {
        set({ lessons });
      }
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch training modules' });
    } finally {
      set({ isLoading: false });
    }
  },

  markLessonCompleted: async (lessonId) => {
    const prev = get().completedLessons;
    if (prev.includes(lessonId)) return;

    // Optimistic
    set({ completedLessons: [...prev, lessonId] });
    
    try {
      await TrainingService.completeModule(lessonId);
    } catch (e: unknown) {
      set({ completedLessons: prev, error: e instanceof Error ? e.message : 'Failed to complete module' });
    }
  }
}));