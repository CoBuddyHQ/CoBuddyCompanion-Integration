/**
 * CoBuddy Companion App — Theme Index
 * Central export for all design tokens.
 * Import ONLY from here: import { theme } from '@/theme'
 */

export {colors} from './colors';
export type {ColorKey} from './colors';

export {fontFamily, textStyles} from './typography';

export {spacing} from './spacing';
export type {SpacingKey} from './spacing';

export {radius} from './radius';
export type {RadiusKey} from './radius';

export {shadows} from './shadows';

/** Convenience re-export of the full theme object */
import {colors} from './colors';
import {fontFamily, textStyles} from './typography';
import {spacing} from './spacing';
import {radius} from './radius';
import {shadows} from './shadows';

export const theme = {
  colors,
  fontFamily,
  textStyles,
  spacing,
  radius,
  shadows,
} as const;

export type Theme = typeof theme;
