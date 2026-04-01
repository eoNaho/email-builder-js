import React, { CSSProperties } from 'react';
import { z } from 'zod';

import { COLOR_SCHEMA, MOBILE_OVERRIDES_SCHEMA, PADDING_SCHEMA, VISIBILITY_SCHEMA, getPadding } from '@usewaypoint/document-core';

const PLATFORM_COLORS: Record<string, string> = {
  facebook: '#1877F2',
  twitter: '#000000',
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  youtube: '#FF0000',
  tiktok: '#010101',
  whatsapp: '#25D366',
  pinterest: '#E60023',
  github: '#181717',
};

const PLATFORM_LABELS: Record<string, string> = {
  facebook: 'f',
  twitter: 'X',
  instagram: 'in',
  linkedin: 'in',
  youtube: '▶',
  tiktok: 't',
  whatsapp: 'w',
  pinterest: 'p',
  github: 'g',
};

export const SocialPropsSchema = z.object({
  style: z
    .object({
      padding: PADDING_SCHEMA,
      backgroundColor: COLOR_SCHEMA,
      textAlign: z.enum(['left', 'center', 'right']).optional().nullable(),
    })
    .optional()
    .nullable(),
  props: z
    .object({
      platforms: z
        .array(
          z.object({
            platform: z.string(),
            url: z.string(),
          })
        )
        .optional()
        .nullable(),
      size: z.number().optional().nullable(),
      gap: z.number().optional().nullable(),
      borderRadius: z.number().optional().nullable(),
      iconTextColor: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
  mobileOverrides: MOBILE_OVERRIDES_SCHEMA,
});

export type SocialProps = z.infer<typeof SocialPropsSchema>;

export const SocialPropsDefaults = {
  platforms: [
    { platform: 'facebook', url: 'https://facebook.com' },
    { platform: 'twitter', url: 'https://twitter.com' },
    { platform: 'instagram', url: 'https://instagram.com' },
  ],
  size: 32,
  gap: 8,
  borderRadius: 50,
  iconTextColor: '#FFFFFF',
  textAlign: 'center',
} as const;

export function Social({ style, props }: SocialProps) {
  const platforms = props?.platforms ?? SocialPropsDefaults.platforms;
  const size = props?.size ?? SocialPropsDefaults.size;
  const gap = props?.gap ?? SocialPropsDefaults.gap;
  const borderRadius = props?.borderRadius ?? SocialPropsDefaults.borderRadius;
  const iconTextColor = props?.iconTextColor ?? SocialPropsDefaults.iconTextColor;

  const wrapperStyle: CSSProperties = {
    padding: getPadding(style?.padding),
    backgroundColor: style?.backgroundColor ?? undefined,
    textAlign: style?.textAlign ?? SocialPropsDefaults.textAlign,
  };

  const tableStyle: CSSProperties = {
    display: 'inline-table',
    borderCollapse: 'collapse',
  };

  return (
    <div style={wrapperStyle}>
      <table style={tableStyle} cellPadding={0} cellSpacing={0} role="presentation">
        <tbody>
          <tr>
            {platforms.map((item, index) => {
              const platform = item.platform.toLowerCase();
              const bgColor = PLATFORM_COLORS[platform] ?? '#999999';
              const label = PLATFORM_LABELS[platform] ?? platform.charAt(0).toUpperCase();

              const tdStyle: CSSProperties = {
                paddingLeft: index === 0 ? 0 : gap,
              };

              const circleStyle: CSSProperties = {
                display: 'inline-block',
                width: size,
                height: size,
                lineHeight: `${size}px`,
                borderRadius: `${borderRadius}%`,
                backgroundColor: bgColor,
                textAlign: 'center',
                verticalAlign: 'middle',
                fontSize: Math.floor(size * 0.45),
                fontWeight: 'bold',
                color: iconTextColor,
                fontFamily: 'Arial, sans-serif',
                textDecoration: 'none',
              };

              const linkStyle: CSSProperties = {
                display: 'inline-block',
                textDecoration: 'none',
                color: iconTextColor,
              };

              return (
                <td key={`${platform}-${index}`} style={tdStyle}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                    <span style={circleStyle}>{label}</span>
                  </a>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
