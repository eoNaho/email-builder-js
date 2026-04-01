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

const AccordionItemSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const AccordionPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      padding: PADDING_SCHEMA,
      fontFamily: FONT_FAMILY_SCHEMA,
      borderColor: COLOR_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      items: z.array(AccordionItemSchema).optional().nullable(),
      titleFontSize: z.number().optional().nullable(),
      contentFontSize: z.number().optional().nullable(),
      titleColor: COLOR_SCHEMA,
      contentColor: COLOR_SCHEMA,
      defaultOpen: z.boolean().optional().nullable(),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
  mobileOverrides: MOBILE_OVERRIDES_SCHEMA,
});

export type AccordionProps = z.infer<typeof AccordionPropsSchema>;

export const AccordionPropsDefaults = {
  items: [
    { title: 'Question 1', content: 'Answer to question 1' },
    { title: 'Question 2', content: 'Answer to question 2' },
  ],
  titleFontSize: 16,
  contentFontSize: 14,
  titleColor: '#111827',
  contentColor: '#4B5563',
  defaultOpen: false,
} as const;

export function Accordion({ style, props }: AccordionProps) {
  const items = props?.items ?? AccordionPropsDefaults.items;
  const titleFontSize = props?.titleFontSize ?? AccordionPropsDefaults.titleFontSize;
  const contentFontSize = props?.contentFontSize ?? AccordionPropsDefaults.contentFontSize;
  const titleColor = props?.titleColor ?? AccordionPropsDefaults.titleColor;
  const contentColor = props?.contentColor ?? AccordionPropsDefaults.contentColor;
  const defaultOpen = props?.defaultOpen ?? AccordionPropsDefaults.defaultOpen;

  const wrapperStyle: CSSProperties = {
    backgroundColor: style?.backgroundColor ?? undefined,
    padding: getPadding(style?.padding),
    fontFamily: getFontFamily(style?.fontFamily),
  };

  const borderColor = style?.borderColor ?? '#E5E7EB';

  return (
    <div style={wrapperStyle}>
      {items.map((item, idx) => (
        // Email clients that support <details> will show this as collapsible.
        // Others will render it expanded (MSO/Outlook fallback).
        <details
          key={idx}
          open={defaultOpen || undefined}
          style={{
            borderBottom: `1px solid ${borderColor}`,
            marginBottom: 0,
          }}
        >
          <summary
            style={{
              fontSize: titleFontSize,
              color: titleColor ?? '#111827',
              fontWeight: 600,
              padding: '12px 0',
              cursor: 'pointer',
              listStyle: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {item.title}
            <span style={{ fontSize: 18, lineHeight: 1 }}>&#9660;</span>
          </summary>
          <div
            style={{
              fontSize: contentFontSize,
              color: contentColor ?? '#4B5563',
              padding: '0 0 12px 0',
              lineHeight: 1.6,
            }}
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        </details>
      ))}
    </div>
  );
}
