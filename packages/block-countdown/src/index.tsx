import React, { CSSProperties } from 'react';
import { z } from 'zod';

import {
  COLOR_SCHEMA,
  FONT_FAMILY_SCHEMA,
  MOBILE_OVERRIDES_SCHEMA,
  PADDING_SCHEMA,
  VISIBILITY_SCHEMA,
  getFontFamily,
  getPadding,
} from '@usewaypoint/document-core';

export const CountdownPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      padding: PADDING_SCHEMA,
      fontFamily: FONT_FAMILY_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      targetDate: z.string().optional().nullable(),
      timezone: z.string().optional().nullable(),
      expiredText: z.string().optional().nullable(),
      /** Pre-rendered image URL from the onGenerateCountdownImage callback */
      imageUrl: z.string().optional().nullable(),
      linkUrl: z.string().optional().nullable(),
      backgroundColor: COLOR_SCHEMA,
      textColor: COLOR_SCHEMA,
      fontSize: z.number().optional().nullable(),
      labels: z
        .object({
          days: z.string().optional().nullable(),
          hours: z.string().optional().nullable(),
          minutes: z.string().optional().nullable(),
          seconds: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
  mobileOverrides: MOBILE_OVERRIDES_SCHEMA,
});

export type CountdownProps = z.infer<typeof CountdownPropsSchema>;

export const CountdownPropsDefaults = {
  expiredText: 'Offer expired',
  backgroundColor: '#1E3A5F',
  textColor: '#FFFFFF',
  fontSize: 32,
  labels: { days: 'Days', hours: 'Hours', minutes: 'Mins', seconds: 'Secs' },
} as const;

/**
 * Countdown block.
 *
 * In email rendering, the countdown is rendered as a pre-generated image
 * (set via `props.imageUrl`, typically from the `onGenerateCountdownImage` callback).
 * In the editor, a static placeholder is shown.
 */
export function Countdown({ style, props }: CountdownProps) {
  const imageUrl = props?.imageUrl;
  const linkUrl = props?.linkUrl;
  const targetDate = props?.targetDate;

  const wrapperStyle: CSSProperties = {
    backgroundColor: style?.backgroundColor ?? undefined,
    padding: getPadding(style?.padding),
    fontFamily: getFontFamily(style?.fontFamily),
    textAlign: 'center',
  };

  if (imageUrl) {
    const img = (
      <img
        src={imageUrl}
        alt="Countdown timer"
        style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      />
    );
    return (
      <div style={wrapperStyle}>
        {linkUrl ? (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer">
            {img}
          </a>
        ) : (
          img
        )}
      </div>
    );
  }

  // Static fallback: show a simple countdown placeholder
  const bg = props?.backgroundColor ?? CountdownPropsDefaults.backgroundColor;
  const color = props?.textColor ?? CountdownPropsDefaults.textColor;
  const fontSize = props?.fontSize ?? CountdownPropsDefaults.fontSize;
  const labels = props?.labels ?? CountdownPropsDefaults.labels;

  const unitStyle: CSSProperties = {
    display: 'inline-block',
    textAlign: 'center',
    padding: '8px 16px',
    margin: '0 4px',
    backgroundColor: bg ?? '#1E3A5F',
    color: color ?? '#FFFFFF',
    borderRadius: 4,
    minWidth: 60,
  };

  const numberStyle: CSSProperties = {
    display: 'block',
    fontSize,
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: 4,
  };

  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: Math.max(10, (fontSize ?? 32) * 0.35),
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  };

  const units = [
    { value: targetDate ? '???' : '00', label: labels?.days ?? 'Days' },
    { value: targetDate ? '???' : '00', label: labels?.hours ?? 'Hours' },
    { value: targetDate ? '???' : '00', label: labels?.minutes ?? 'Mins' },
    { value: targetDate ? '???' : '00', label: labels?.seconds ?? 'Secs' },
  ];

  return (
    <div style={wrapperStyle}>
      {targetDate ? (
        <div>
          {units.map((u) => (
            <span key={u.label} style={unitStyle}>
              <span style={numberStyle}>{u.value}</span>
              <span style={labelStyle}>{u.label}</span>
            </span>
          ))}
          {!imageUrl && (
            <div style={{ marginTop: 8, fontSize: 11, opacity: 0.6 }}>
              Live countdown requires image generation callback
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            padding: '24px',
            background: '#f3f4f6',
            borderRadius: 4,
            color: '#6B7280',
            fontSize: 14,
          }}
        >
          Set a target date to enable countdown
        </div>
      )}
    </div>
  );
}
