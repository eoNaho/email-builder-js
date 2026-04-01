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

export const FooterPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      padding: PADDING_SCHEMA,
      textAlign: z.enum(['left', 'center', 'right']).optional().nullable(),
      color: COLOR_SCHEMA,
      fontSize: z.number().gte(0).optional().nullable(),
      fontFamily: FONT_FAMILY_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      companyName: z.string().optional().nullable(),
      address: z.string().optional().nullable(),
      unsubscribeUrl: z.string().optional().nullable(),
      unsubscribeText: z.string().optional().nullable(),
      copyright: z.string().optional().nullable(),
      links: z
        .array(z.object({ text: z.string(), url: z.string() }))
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
  mobileOverrides: MOBILE_OVERRIDES_SCHEMA,
});

export type FooterProps = z.infer<typeof FooterPropsSchema>;

export const FooterPropsDefaults = {
  companyName: '',
  address: '',
  unsubscribeUrl: '',
  unsubscribeText: 'Unsubscribe',
  copyright: `© ${new Date().getFullYear()} Company Name`,
  links: [] as { text: string; url: string }[],
} as const;

export function Footer({ style, props }: FooterProps) {
  const fontSize = style?.fontSize ?? 12;
  const color = style?.color ?? undefined;

  const wrapperStyle: CSSProperties = {
    backgroundColor: style?.backgroundColor ?? undefined,
    padding: getPadding(style?.padding),
    textAlign: style?.textAlign ?? 'center',
    fontFamily: getFontFamily(style?.fontFamily),
    fontSize,
    color,
  };

  const companyName = props?.companyName ?? FooterPropsDefaults.companyName;
  const address = props?.address ?? FooterPropsDefaults.address;
  const unsubscribeUrl = props?.unsubscribeUrl ?? FooterPropsDefaults.unsubscribeUrl;
  const unsubscribeText = props?.unsubscribeText ?? FooterPropsDefaults.unsubscribeText;
  const copyright = props?.copyright ?? FooterPropsDefaults.copyright;
  const links = props?.links ?? FooterPropsDefaults.links;

  const linkStyle: CSSProperties = {
    color: color ?? 'inherit',
    textDecoration: 'underline',
    display: 'inline',
  };

  const separatorStyle: CSSProperties = {
    display: 'inline',
    padding: '0 6px',
  };

  return (
    <div style={wrapperStyle}>
      {companyName ? (
        <div style={{ fontSize: fontSize + 2, fontWeight: 'bold', marginBottom: 4 }}>
          {companyName}
        </div>
      ) : null}

      {address ? (
        <div style={{ marginBottom: 4 }}>
          {address.split('\n').map((line, index, arr) => (
            <React.Fragment key={index}>
              {line}
              {index < arr.length - 1 ? <br /> : null}
            </React.Fragment>
          ))}
        </div>
      ) : null}

      {links && links.length > 0 ? (
        <div style={{ marginBottom: 4 }}>
          {links.map((link, index) => (
            <React.Fragment key={index}>
              {index > 0 ? <span style={separatorStyle}>|</span> : null}
              <a href={link.url} style={linkStyle} target="_blank" rel="noopener noreferrer">
                {link.text}
              </a>
            </React.Fragment>
          ))}
        </div>
      ) : null}

      {unsubscribeUrl ? (
        <div style={{ marginBottom: 4 }}>
          <a href={unsubscribeUrl} style={linkStyle} target="_blank" rel="noopener noreferrer">
            {unsubscribeText}
          </a>
        </div>
      ) : null}

      {copyright ? <div>{copyright}</div> : null}
    </div>
  );
}
