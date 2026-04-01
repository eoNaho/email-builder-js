import React, { CSSProperties } from 'react';
import { z } from 'zod';

import { COLOR_SCHEMA, MOBILE_OVERRIDES_SCHEMA, PADDING_SCHEMA, VISIBILITY_SCHEMA, getPadding } from '@usewaypoint/document-core';

const LogoItemSchema = z.object({
  src: z.string(),
  alt: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  width: z.number().optional().nullable(),
});

export const LogoGridPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      logos: z.array(LogoItemSchema).optional().nullable(),
      columns: z.number().min(2).max(6).optional().nullable(),
      gap: z.number().min(0).max(64).optional().nullable(),
      logoHeight: z.number().min(20).max(120).optional().nullable(),
      grayscale: z.boolean().optional().nullable(),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
  mobileOverrides: MOBILE_OVERRIDES_SCHEMA,
});

export type LogoGridProps = z.infer<typeof LogoGridPropsSchema>;

export const LogoGridPropsDefaults = {
  columns: 4,
  gap: 24,
  logoHeight: 40,
  grayscale: false,
  logos: [] as { src: string; alt?: string | null; url?: string | null; width?: number | null }[],
} as const;

export function LogoGrid({ style, props }: LogoGridProps) {
  const logos = props?.logos ?? LogoGridPropsDefaults.logos;
  const columns = props?.columns ?? LogoGridPropsDefaults.columns;
  const gap = props?.gap ?? LogoGridPropsDefaults.gap;
  const logoHeight = props?.logoHeight ?? LogoGridPropsDefaults.logoHeight;
  const grayscale = props?.grayscale ?? LogoGridPropsDefaults.grayscale;

  if (logos.length === 0) {
    return (
      <div
        style={{
          backgroundColor: style?.backgroundColor ?? undefined,
          padding: getPadding(style?.padding),
          textAlign: 'center',
          color: '#9CA3AF',
          fontSize: 14,
        }}
      >
        No logos added yet
      </div>
    );
  }

  const cellWidth = `${Math.floor(100 / columns)}%`;

  const wrapperStyle: CSSProperties = {
    backgroundColor: style?.backgroundColor ?? undefined,
    padding: getPadding(style?.padding),
  };

  const tableStyle: CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const rows: (typeof logos)[] = [];
  for (let i = 0; i < logos.length; i += columns) {
    rows.push(logos.slice(i, i + columns));
  }

  return (
    <div style={wrapperStyle}>
      <table style={tableStyle} role="presentation">
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((logo, colIdx) => {
                const imgStyle: CSSProperties = {
                  height: logoHeight,
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: grayscale ? 'grayscale(100%)' : undefined,
                  display: 'block',
                  margin: '0 auto',
                };
                const img = <img src={logo.src} alt={logo.alt ?? ''} style={imgStyle} />;
                return (
                  <td
                    key={colIdx}
                    style={{
                      width: cellWidth,
                      padding: gap / 2,
                      textAlign: 'center',
                      verticalAlign: 'middle',
                    }}
                  >
                    {logo.url ? (
                      <a href={logo.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
                        {img}
                      </a>
                    ) : (
                      img
                    )}
                  </td>
                );
              })}
              {/* Fill empty cells in last row */}
              {row.length < columns &&
                Array.from({ length: columns - row.length }).map((_, i) => (
                  <td key={`empty-${i}`} style={{ width: cellWidth }} />
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
