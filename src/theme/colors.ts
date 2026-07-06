/**
 * CoBuddy Companion App — Color Tokens
 * Source of truth: Stitch AI DESIGN.md + CoBuddy brand guidelines
 * DO NOT add random colors. All additions must come from the design system.
 */

export const colors = {
  // ─── Backgrounds ───────────────────────────────────────────────────────────
  rootBg: '#07111F',
  secondaryBg: '#0B1628',
  cardSurface: '#101B2D',
  elevatedSurface: '#132033',

  // ─── Accent / Brand ────────────────────────────────────────────────────────
  gold: '#D6A84F',
  goldDim: 'rgba(214, 168, 79, 0.60)',
  goldSubtle: 'rgba(214, 168, 79, 0.12)',
  bronze: '#B87A3D',
  bronzeDim: 'rgba(184, 122, 61, 0.60)',

  // ─── Text ──────────────────────────────────────────────────────────────────
  textPrimary: '#F8F3E8',
  textSecondary: '#B8C0CC',
  textMuted: '#7E8896',

  // ─── Status ────────────────────────────────────────────────────────────────
  safetyGreen: '#6DD6A5',
  safetyGreenSubtle: 'rgba(109, 214, 165, 0.12)',
  softWarning: '#D96C6C',
  softWarningSubtle: 'rgba(217, 108, 108, 0.12)',
  warningAmber: '#E6A817',
  warningAmberSubtle: 'rgba(230, 168, 23, 0.12)',
  errorRed: '#E05252',
  errorRedSubtle: 'rgba(224, 82, 82, 0.12)',
  infoBlue: '#5B9BD5',
  infoBlueSubtle: 'rgba(91, 155, 213, 0.12)',

  // ─── Borders ───────────────────────────────────────────────────────────────
  border: 'rgba(214, 168, 79, 0.22)',
  borderSubtle: 'rgba(214, 168, 79, 0.10)',
  borderSurface: 'rgba(184, 192, 204, 0.12)',

  // ─── Overlays ──────────────────────────────────────────────────────────────
  overlay: 'rgba(7, 17, 31, 0.85)',
  overlayLight: 'rgba(7, 17, 31, 0.60)',
  overlayMedium: 'rgba(7, 17, 31, 0.72)',

  // ─── Absolute ──────────────────────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof colors;
