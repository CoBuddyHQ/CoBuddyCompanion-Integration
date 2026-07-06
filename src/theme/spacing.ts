/**
 * CoBuddy Companion App — Spacing Tokens
 * Base unit: 8px. All values are multiples of 4 for consistency.
 */

export const spacing = {
  /** 2px */
  xxs: 2,
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 20px */
  xl: 20,
  /** 24px */
  xxl: 24,
  /** 32px */
  xxxl: 32,
  /** 40px */
  xxxxl: 40,
  /** 48px */
  huge: 48,
  /** 64px */
  massive: 64,

  // ─── Screen gutters ────────────────────────────────────────────────────────
  /** Horizontal padding for all screens */
  screenH: 20,
  /** Vertical top padding for screen content */
  screenTop: 16,
  /** Vertical bottom padding (above tab bar) */
  screenBottom: 24,

  // ─── Section spacing ───────────────────────────────────────────────────────
  /** Space between sections */
  section: 32,
  /** Space between cards in a list */
  cardGap: 12,
  /** Card internal padding */
  cardPad: 16,

  // ─── Icon sizes ────────────────────────────────────────────────────────────
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  iconXl: 28,
  iconHuge: 32,

  // ─── Avatar sizes ──────────────────────────────────────────────────────────
  avatarSm: 32,
  avatarMd: 48,
  avatarLg: 64,
  avatarXl: 80,
  avatarHero: 96,

  // ─── Component heights ─────────────────────────────────────────────────────
  inputHeight: 52,
  buttonHeightLg: 52,
  buttonHeightMd: 44,
  buttonHeightSm: 36,
  tabBarHeight: 64,
  headerHeight: 56,
  chipHeight: 28,
} as const;

export type SpacingKey = keyof typeof spacing;
