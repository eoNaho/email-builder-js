import { z } from 'zod';

export const FONT_FAMILY_SCHEMA = z
  .enum([
    'MODERN_SANS',
    'BOOK_SANS',
    'ORGANIC_SANS',
    'GEOMETRIC_SANS',
    'HEAVY_SANS',
    'ROUNDED_SANS',
    'MODERN_SERIF',
    'BOOK_SERIF',
    'MONOSPACE',
  ])
  .nullable()
  .optional();

export type FontFamily = z.infer<typeof FONT_FAMILY_SCHEMA>;

export function getFontFamily(fontFamily: FontFamily): string | undefined {
  switch (fontFamily) {
    case 'MODERN_SANS':
      return '"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif';
    case 'BOOK_SANS':
      return 'Optima, Candara, "Noto Sans", source-sans-pro, sans-serif';
    case 'ORGANIC_SANS':
      return 'Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif';
    case 'GEOMETRIC_SANS':
      return 'Avenir, "Avenir Next LT Pro", Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif';
    case 'HEAVY_SANS':
      return 'Bahnschrift, "DIN Alternate", "Franklin Gothic Medium", "Nimbus Sans Narrow", sans-serif-condensed, sans-serif';
    case 'ROUNDED_SANS':
      return 'ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, Manjari, "Arial Rounded MT Bold", Calibri, source-sans-pro, sans-serif';
    case 'MODERN_SERIF':
      return 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif';
    case 'BOOK_SERIF':
      return '"Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052, serif';
    case 'MONOSPACE':
      return '"Nimbus Mono PS", "Courier New", "Cutive Mono", monospace';
    default:
      return undefined;
  }
}

export const COLOR_SCHEMA = z
  .string()
  .regex(/^(#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[\d.]+\s*)?\))$/)
  .nullable()
  .optional();

export type Color = z.infer<typeof COLOR_SCHEMA>;

export const PADDING_SCHEMA = z
  .object({
    top: z.number(),
    bottom: z.number(),
    right: z.number(),
    left: z.number(),
  })
  .optional()
  .nullable();

export type Padding = z.infer<typeof PADDING_SCHEMA>;

export function getPadding(padding: Padding): string | undefined {
  return padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined;
}

// ─── Visibility ────────────────────────────────────────────────────────────────

export const VISIBILITY_SCHEMA = z.enum(['all', 'desktop-only', 'mobile-only']).optional().nullable();
export type Visibility = z.infer<typeof VISIBILITY_SCHEMA>;

// ─── Mobile Overrides ──────────────────────────────────────────────────────────

export const MOBILE_OVERRIDES_SCHEMA = z
  .object({
    padding: PADDING_SCHEMA,
    fontSize: z.number().optional().nullable(),
    textAlign: z.enum(['left', 'center', 'right']).optional().nullable(),
  })
  .optional()
  .nullable();
export type MobileOverrides = z.infer<typeof MOBILE_OVERRIDES_SCHEMA>;
