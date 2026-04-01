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

export const NavigationPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      padding: PADDING_SCHEMA,
      textAlign: z.enum(['left', 'center', 'right']).optional().nullable(),
      fontFamily: FONT_FAMILY_SCHEMA,
      fontSize: z.number().gte(0).optional().nullable(),
      fontWeight: z.enum(['bold', 'normal']).optional().nullable(),
    })
    .optional()
    .nullable(),
  props: z
    .object({
      links: z
        .array(z.object({ text: z.string(), url: z.string() }))
        .optional()
        .nullable(),
      separator: z.string().optional().nullable(),
      linkColor: COLOR_SCHEMA,
      gap: z.number().gte(0).optional().nullable(),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
  mobileOverrides: MOBILE_OVERRIDES_SCHEMA,
});

export type NavigationProps = z.infer<typeof NavigationPropsSchema>;

export const NavigationPropsDefaults = {
  links: [
    { text: 'Home', url: '#' },
    { text: 'About', url: '#' },
    { text: 'Contact', url: '#' },
  ] as { text: string; url: string }[],
  separator: '|',
  linkColor: '#374151',
  gap: 16,
} as const;

export function Navigation({ style, props }: NavigationProps) {
  const links = props?.links ?? NavigationPropsDefaults.links;
  const separator = props?.separator ?? NavigationPropsDefaults.separator;
  const linkColor = props?.linkColor ?? NavigationPropsDefaults.linkColor;
  const gap = props?.gap ?? NavigationPropsDefaults.gap;

  const wrapperStyle: CSSProperties = {
    backgroundColor: style?.backgroundColor ?? undefined,
    padding: getPadding(style?.padding),
    textAlign: style?.textAlign ?? 'center',
    fontFamily: getFontFamily(style?.fontFamily),
    fontSize: style?.fontSize ?? 14,
    fontWeight: style?.fontWeight ?? undefined,
  };

  const linkStyle: CSSProperties = {
    display: 'inline',
    color: linkColor ?? undefined,
    textDecoration: 'none',
  };

  const separatorStyle: CSSProperties = {
    display: 'inline',
    padding: `0 ${gap / 2}px`,
    color: linkColor ?? undefined,
  };

  return (
    <div style={wrapperStyle}>
      {(links ?? []).map((link, index) => (
        <React.Fragment key={index}>
          {index > 0 ? (
            <span style={separatorStyle}>{separator}</span>
          ) : null}
          <a href={link.url} style={linkStyle} target="_blank" rel="noopener noreferrer">
            {link.text}
          </a>
        </React.Fragment>
      ))}
    </div>
  );
}
