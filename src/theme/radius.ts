/**
 * CoBuddy Companion App — Border Radius Tokens
 * Soft & structural — not overly rounded (conveys professionalism, not consumer).
 */

export const radius = {
  /** 2px — micro elements */
  xs: 2,
  /** 4px — buttons, inputs (primary professional feel) */
  sm: 4,
  /** 8px — cards, chips */
  md: 8,
  /** 12px — modals, larger cards */
  lg: 12,
  /** 16px — floating cards, bottom sheets */
  xl: 16,
  /** 20px — large modals */
  xxl: 20,
  /** 24px — hero containers */
  xxxl: 24,
  /** 9999px — pill buttons, avatars */
  full: 9999,
} as const;

export type RadiusKey = keyof typeof radius;
