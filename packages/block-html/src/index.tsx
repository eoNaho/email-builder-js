import insane from 'insane';
import React, { CSSProperties } from 'react';
import { z } from 'zod';

import { COLOR_SCHEMA, FONT_FAMILY_SCHEMA, MOBILE_OVERRIDES_SCHEMA, PADDING_SCHEMA, VISIBILITY_SCHEMA, getFontFamily, getPadding } from '@usewaypoint/document-core';

// Cast to string[] because @types/insane has an incomplete AllowedTags union
const HTML_ALLOWED_TAGS = [
  'a',
  'abbr',
  'article',
  'b',
  'blockquote',
  'br',
  'caption',
  'center',
  'cite',
  'code',
  'col',
  'colgroup',
  'del',
  'details',
  'div',
  'em',
  'font',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'ins',
  'kbd',
  'li',
  'main',
  'ol',
  'p',
  'pre',
  'section',
  'small',
  'span',
  'strong',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
] as string[];

const GENERIC_ATTRS = ['style', 'class', 'id', 'title', 'align', 'valign', 'width', 'height', 'bgcolor', 'color'];

function sanitizeHtml(html: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return insane(html, {
    allowedTags: HTML_ALLOWED_TAGS as any,
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedAttributes: {
      ...HTML_ALLOWED_TAGS.reduce<Record<string, string[]>>((res, tag) => {
        res[tag] = [...GENERIC_ATTRS];
        return res;
      }, {}),
      a: ['href', 'target', 'rel', ...GENERIC_ATTRS],
      img: ['src', 'alt', 'border', ...GENERIC_ATTRS],
      table: ['border', 'cellspacing', 'cellpadding', 'role', ...GENERIC_ATTRS],
      td: ['colspan', 'rowspan', ...GENERIC_ATTRS],
      th: ['colspan', 'rowspan', 'scope', ...GENERIC_ATTRS],
      ol: ['start', 'type', ...GENERIC_ATTRS],
      ul: ['type', ...GENERIC_ATTRS],
    },
    filter: (token) => {
      if (token.tag === 'a' && 'href' in token.attrs && token.attrs.href === undefined) {
        token.attrs.href = '';
      }
      if (token.tag === 'img' && 'src' in token.attrs && token.attrs.src === undefined) {
        token.attrs.src = '';
      }
      return true;
    },
  });
}

export const HtmlPropsSchema = z.object({
  style: z
    .object({
      color: COLOR_SCHEMA,
      backgroundColor: COLOR_SCHEMA,
      fontFamily: FONT_FAMILY_SCHEMA,
      fontSize: z.number().min(0).optional().nullable(),
      textAlign: z.enum(['left', 'right', 'center']).optional().nullable(),
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      contents: z.string().optional().nullable(),
      /**
       * When true, HTML is rendered without sanitization.
       * Only use this in trusted server-side contexts where the HTML
       * source is controlled. Never set this to true for user-supplied content.
       */
      allowUnsanitized: z.boolean().optional().nullable(),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
  mobileOverrides: MOBILE_OVERRIDES_SCHEMA,
});

export type HtmlProps = z.infer<typeof HtmlPropsSchema>;

export function Html({ style, props }: HtmlProps) {
  const contents = props?.contents;
  const cssStyle: CSSProperties = {
    color: style?.color ?? undefined,
    backgroundColor: style?.backgroundColor ?? undefined,
    fontFamily: getFontFamily(style?.fontFamily),
    fontSize: style?.fontSize ?? undefined,
    textAlign: style?.textAlign ?? undefined,
    padding: getPadding(style?.padding),
  };
  if (!contents) {
    return <div style={cssStyle} />;
  }
  const html = props?.allowUnsanitized ? contents : sanitizeHtml(contents);
  return <div style={cssStyle} dangerouslySetInnerHTML={{ __html: html }} />;
}
