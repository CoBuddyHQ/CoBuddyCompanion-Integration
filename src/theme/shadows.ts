/**
 * CoBuddy Companion App — Shadow Tokens
 * Tonal layering approach: depth via color, not harsh drop shadows.
 * All shadows use dark navy tones, not black, for the luxury feel.
 */

import {ViewStyle} from 'react-native';

export const shadows: Record<string, ViewStyle> = {
  none: {},

  /** Subtle card lift */
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.24,
    shadowRadius: 4,
    elevation: 2,
  },

  /** Standard card */
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 4,
  },

  /** Elevated card / dropdown */
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.40,
    shadowRadius: 16,
    elevation: 8,
  },

  /** Bottom sheet / modal */
  xl: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.50,
    shadowRadius: 24,
    elevation: 16,
  },

  /** Gold glow — active/selected state on premium cards */
  goldGlow: {
    shadowColor: '#D6A84F',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
  },

  /** Warning/SOS glow */
  warningGlow: {
    shadowColor: '#D96C6C',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.40,
    shadowRadius: 16,
    elevation: 8,
  },

  /** Safety green glow — verified / safe status */
  safetyGlow: {
    shadowColor: '#6DD6A5',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;
