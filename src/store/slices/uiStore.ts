/**
 * CoBuddy Companion App — UI Store (Zustand)
 * Global UI state: loading, toasts, modals, network status,
 * and app-wide display preferences (dark mode, language, text size).
 */

import {create} from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type AppLanguage = 'en' | 'hi' | 'mr' | 'gu' | 'ta';
export type TextSize = 'Small' | 'Default' | 'Large';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface UIState {
  isLoading:     boolean;
  loadingMessage: string;
  toasts:        Toast[];
  networkStatus: 'online' | 'offline';
  activeModal:   string | null;

  // ─── Display Preferences ──────────────────────────────────────────────────
  isDarkMode:    boolean;
  language:      AppLanguage;
  textSize:      TextSize;
  highContrast:  boolean;

  // Actions — system
  setLoading:       (val: boolean, message?: string) => void;
  showToast:        (type: ToastType, message: string, duration?: number) => void;
  dismissToast:     (id: string) => void;
  setNetworkStatus: (status: 'online' | 'offline') => void;
  setActiveModal:   (modal: string | null) => void;

  // Actions — display preferences
  setDarkMode:    (val: boolean)       => void;
  setLanguage:    (lang: AppLanguage)  => void;
  setTextSize:    (size: TextSize)     => void;
  setHighContrast:(val: boolean)       => void;
}

let toastCounter = 0;

export const useUIStore = create<UIState>(set => ({
  isLoading:      false,
  loadingMessage: '',
  toasts:         [],
  networkStatus:  'online',
  activeModal:    null,

  // Display preferences — defaults
  isDarkMode:   true,      // App is dark-first
  language:     'en',
  textSize:     'Default',
  highContrast: false,

  setLoading: (val, message = '') => set({isLoading: val, loadingMessage: message}),

  showToast: (type, message, duration = 3000) => {
    const id = `toast_${++toastCounter}_${Date.now()}`;
    set(state => ({toasts: [...state.toasts, {id, type, message, duration}]}));
    // Auto-dismiss
    setTimeout(() => {
      set(state => ({toasts: state.toasts.filter(t => t.id !== id)}));
    }, duration);
  },

  dismissToast: id =>
    set(state => ({toasts: state.toasts.filter(t => t.id !== id)})),

  setNetworkStatus: status => set({networkStatus: status}),
  setActiveModal:   modal  => set({activeModal: modal}),

  // Display preference setters
  setDarkMode:    val  => set({isDarkMode: val}),
  setLanguage:    lang => set({language: lang}),
  setTextSize:    size => set({textSize: size}),
  setHighContrast:val  => set({highContrast: val}),
}));
