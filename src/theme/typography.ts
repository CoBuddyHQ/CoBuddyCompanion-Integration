/**
 * CoBuddy Companion App — Typography Tokens
 * Fonts: Inter (UI) + Playfair Display (luxury headings only)
 * Material Icons: use react-native-vector-icons/MaterialIcons ONLY
 */

import {TextStyle} from 'react-native';

export const fontFamily = {
  // Inter — all UI text
  interRegular: 'Inter-Regular',
  interMedium: 'Inter-Medium',
  interSemiBold: 'Inter-SemiBold',
  interBold: 'Inter-Bold',
  // Playfair Display — luxury/display headings only
  playfairMedium: 'PlayfairDisplay-Medium',
  playfairSemiBold: 'PlayfairDisplay-SemiBold',
  playfairBold: 'PlayfairDisplay-Bold',
} as const;

/** Semantic text styles */
export const textStyles: Record<string, TextStyle> = {
  // ─── Display (Playfair — splash, hero only) ────────────────────────────────
  displayLg: {
    fontFamily: fontFamily.playfairBold,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  displayMd: {
    fontFamily: fontFamily.playfairSemiBold,
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -0.3,
  },

  // ─── Headlines (Playfair — screen titles, profile names) ──────────────────
  headlineLg: {
    fontFamily: fontFamily.playfairSemiBold,
    fontSize: 26,
    lineHeight: 34,
  },
  headlineMd: {
    fontFamily: fontFamily.playfairMedium,
    fontSize: 22,
    lineHeight: 30,
  },
  headlineSm: {
    fontFamily: fontFamily.playfairMedium,
    fontSize: 18,
    lineHeight: 26,
  },

  // ─── Body (Inter) ──────────────────────────────────────────────────────────
  bodyLg: {
    fontFamily: fontFamily.interRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMd: {
    fontFamily: fontFamily.interRegular,
    fontSize: 15,
    lineHeight: 22,
  },
  bodySm: {
    fontFamily: fontFamily.interRegular,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyXs: {
    fontFamily: fontFamily.interRegular,
    fontSize: 13,
    lineHeight: 18,
  },

  // ─── Labels (Inter) ────────────────────────────────────────────────────────
  labelLg: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  labelMd: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.3,
  },
  labelSm: {
    fontFamily: fontFamily.interMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  labelXs: {
    fontFamily: fontFamily.interMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.6,
  },

  // ─── Caps labels (Inter — category tags, status chips) ───────────────────
  capsLg: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  capsSm: {
    fontFamily: fontFamily.interMedium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },

  // ─── Numbers / Metrics ────────────────────────────────────────────────────
  metricLg: {
    fontFamily: fontFamily.interBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  metricMd: {
    fontFamily: fontFamily.interBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  metricSm: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 18,
    lineHeight: 24,
  },

  // ─── Button text ──────────────────────────────────────────────────────────
  buttonLg: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  buttonMd: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  buttonSm: {
    fontFamily: fontFamily.interMedium,
    fontSize: 13,
    lineHeight: 18,
  },
} as const;
