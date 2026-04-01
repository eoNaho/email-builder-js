import React, { CSSProperties } from 'react';
import { z } from 'zod';

import { COLOR_SCHEMA, FONT_FAMILY_SCHEMA, MOBILE_OVERRIDES_SCHEMA, PADDING_SCHEMA, VISIBILITY_SCHEMA, getFontFamily, getPadding } from '@usewaypoint/document-core';

import EmailMarkdown from './EmailMarkdown';

export const TextPropsSchema = z.object({
  style: z
    .object({
      color: COLOR_SCHEMA,
      backgroundColor: COLOR_SCHEMA,
      fontSize: z.number().gte(0).optional().nullable(),
      fontFamily: FONT_FAMILY_SCHEMA,
      fontWeight: z.enum(['bold', 'normal']).optional().nullable(),
      textAlign: z.enum(['left', 'center', 'right']).optional().nullable(),
      padding: PADDING_SCHEMA,
      lineHeight: z.number().gte(0).optional().nullable(),
      letterSpacing: z.number().optional().nullable(),
    })
    .optional()
    .nullable(),
  props: z
    .object({
      markdown: z.boolean().optional().nullable(),
      text: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
  mobileOverrides: MOBILE_OVERRIDES_SCHEMA,
});

export type TextProps = z.infer<typeof TextPropsSchema>;

export const TextPropsDefaults = {
  text: '',
};

export function Text({ style, props }: TextProps) {
  const wStyle: CSSProperties = {
    color: style?.color ?? undefined,
    backgroundColor: style?.backgroundColor ?? undefined,
    fontSize: style?.fontSize ?? undefined,
    fontFamily: getFontFamily(style?.fontFamily),
    fontWeight: style?.fontWeight ?? undefined,
    textAlign: style?.textAlign ?? undefined,
    padding: getPadding(style?.padding),
    lineHeight: style?.lineHeight ?? undefined,
    letterSpacing: style?.letterSpacing != null ? `${style.letterSpacing}px` : undefined,
  };

  const text = props?.text ?? TextPropsDefaults.text;
  if (props?.markdown) {
    return <EmailMarkdown style={wStyle} markdown={text} />;
  }
  return <div style={wStyle}>{text}</div>;
}
