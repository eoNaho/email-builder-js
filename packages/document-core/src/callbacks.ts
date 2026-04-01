import { z } from 'zod';

import { COLOR_SCHEMA, FONT_FAMILY_SCHEMA, PADDING_SCHEMA } from './shared';

// ─── Saved Rows ────────────────────────────────────────────────────────────────

export type SavedRow = {
  id: string;
  name: string;
  thumbnailUrl?: string;
  /** Serialized sub-document: the Row block + all its descendant blocks */
  document: Record<string, unknown>;
  syncedRowId?: string;
};

// ─── Brand Kit ─────────────────────────────────────────────────────────────────

export const BrandKitSchema = z.object({
  colors: z
    .object({
      primary: COLOR_SCHEMA,
      secondary: COLOR_SCHEMA,
      accent: COLOR_SCHEMA,
      neutral: z.array(COLOR_SCHEMA).optional().nullable(),
    })
    .optional()
    .nullable(),
  fonts: z
    .object({
      heading: FONT_FAMILY_SCHEMA,
      body: FONT_FAMILY_SCHEMA,
    })
    .optional()
    .nullable(),
  buttonDefaults: z
    .object({
      borderRadius: z.number().optional().nullable(),
      padding: PADDING_SCHEMA,
      backgroundColor: COLOR_SCHEMA,
      textColor: COLOR_SCHEMA,
    })
    .optional()
    .nullable(),
  linkDefaults: z
    .object({
      color: COLOR_SCHEMA,
      underline: z.boolean().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type BrandKit = z.infer<typeof BrandKitSchema>;

// ─── Link ──────────────────────────────────────────────────────────────────────

export const UtmParamsSchema = z.object({
  source: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  campaign: z.string().optional().nullable(),
  term: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
});

export const LinkConfigSchema = z.object({
  url: z.string(),
  protocol: z.enum(['https', 'mailto', 'tel', 'sms']).optional().nullable(),
  utm: UtmParamsSchema.optional().nullable(),
});

export type UtmParams = z.infer<typeof UtmParamsSchema>;
export type LinkConfig = z.infer<typeof LinkConfigSchema>;

// ─── Countdown Style ───────────────────────────────────────────────────────────

export type CountdownStyle = {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  labels?: { days?: string; hours?: string; minutes?: string; seconds?: string };
};

// ─── Main Callbacks Interface ──────────────────────────────────────────────────

/**
 * Extensibility callbacks for EmailBuilder.
 *
 * When integrating the editor into your application, provide these callbacks
 * via the `CallbacksContext` to enable features that require backend integration.
 *
 * All callbacks are optional — only implement the ones you need.
 */
export interface EmailBuilderCallbacks {
  // ── Media ──────────────────────────────────────────────────────────────────
  /**
   * Called when the user clicks "Upload Image".
   * Return the public URL of the uploaded image.
   */
  onUploadImage?: (file: File) => Promise<{ url: string }>;

  /**
   * Called when the user clicks "Browse Library".
   * Open your media library modal and return the selected image URL (or null if cancelled).
   */
  onBrowseMediaLibrary?: () => Promise<{ url: string } | null>;

  /**
   * Called when the user searches for stock photos.
   * Return a list of results with thumbnail and full URLs.
   */
  onSearchStockPhotos?: (query: string) => Promise<{ url: string; thumbnailUrl: string }[]>;

  // ── Saved Rows ─────────────────────────────────────────────────────────────
  /** Called when the user saves a row to their library. */
  onSaveRow?: (row: SavedRow) => Promise<void>;

  /** Called to load the user's saved row library. */
  onLoadSavedRows?: () => Promise<SavedRow[]>;

  /** Called when the user deletes a saved row. */
  onDeleteSavedRow?: (id: string) => Promise<void>;

  // ── Brand Kit ──────────────────────────────────────────────────────────────
  /** Called to load the brand kit configuration. */
  onLoadBrandKit?: () => Promise<BrandKit>;

  /** Called when the user saves changes to the brand kit. */
  onSaveBrandKit?: (kit: BrandKit) => Promise<void>;

  // ── Export ─────────────────────────────────────────────────────────────────
  /** Called when the user exports the email as HTML. */
  onExportHtml?: (html: string) => Promise<void>;

  /** Called when the user exports the email as JSON. */
  onExportJson?: (json: Record<string, unknown>) => Promise<void>;

  /** Called when the user exports the email as PDF (receives the HTML to convert). */
  onExportPdf?: (html: string) => Promise<void>;

  // ── Links ──────────────────────────────────────────────────────────────────
  /** Called when a link is clicked in the editor preview. */
  onLinkClick?: (url: string, blockId: string) => void;

  // ── Special Blocks ─────────────────────────────────────────────────────────
  /**
   * Called to generate a countdown timer image.
   * Required for the Countdown block to render in emails.
   * Return the URL of the generated image.
   */
  onGenerateCountdownImage?: (targetDate: string, style: CountdownStyle) => Promise<string>;

  // ── Fonts ──────────────────────────────────────────────────────────────────
  /**
   * Called when the user uploads a custom font file.
   * Return the font name and the URL to the .woff2 file.
   */
  onUploadFont?: (file: File) => Promise<{ name: string; url: string }>;

  // ── Persistence ────────────────────────────────────────────────────────────
  /**
   * Called automatically when the document changes (debounced).
   * Use this to implement auto-save.
   */
  onAutoSave?: (document: Record<string, unknown>) => Promise<void>;
}
