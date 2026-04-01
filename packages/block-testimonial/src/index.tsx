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

export const TestimonialPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      padding: PADDING_SCHEMA,
      fontFamily: FONT_FAMILY_SCHEMA,
      quoteColor: COLOR_SCHEMA,
      authorColor: COLOR_SCHEMA,
      borderColor: COLOR_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      quote: z.string().optional().nullable(),
      authorName: z.string().optional().nullable(),
      authorTitle: z.string().optional().nullable(),
      avatarUrl: z.string().optional().nullable(),
      rating: z.number().min(0).max(5).optional().nullable(),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
  mobileOverrides: MOBILE_OVERRIDES_SCHEMA,
});

export type TestimonialProps = z.infer<typeof TestimonialPropsSchema>;

export const TestimonialPropsDefaults = {
  quote: 'This product changed my life. Highly recommend to anyone looking for quality.',
  authorName: 'Jane Doe',
  authorTitle: 'CEO, Acme Inc.',
  avatarUrl: '',
  rating: 5,
} as const;

export function Testimonial({ style, props }: TestimonialProps) {
  const quote = props?.quote ?? TestimonialPropsDefaults.quote;
  const authorName = props?.authorName ?? TestimonialPropsDefaults.authorName;
  const authorTitle = props?.authorTitle ?? TestimonialPropsDefaults.authorTitle;
  const avatarUrl = props?.avatarUrl ?? TestimonialPropsDefaults.avatarUrl;
  const rating = props?.rating ?? 0;

  const wrapperStyle: CSSProperties = {
    backgroundColor: style?.backgroundColor ?? undefined,
    padding: getPadding(style?.padding),
    fontFamily: getFontFamily(style?.fontFamily),
    borderLeft: style?.borderColor ? `4px solid ${style.borderColor}` : '4px solid #4F46E5',
    paddingLeft: 16,
  };

  const quoteStyle: CSSProperties = {
    color: style?.quoteColor ?? '#374151',
    fontSize: 16,
    lineHeight: 1.6,
    fontStyle: 'italic',
    margin: '0 0 12px 0',
  };

  const authorStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const authorTextStyle: CSSProperties = {
    color: style?.authorColor ?? '#111827',
  };

  const stars =
    rating > 0
      ? Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ color: i < rating ? '#F59E0B' : '#D1D5DB', fontSize: 14 }}>
            ★
          </span>
        ))
      : null;

  return (
    <div style={wrapperStyle}>
      {stars && <div style={{ marginBottom: 8 }}>{stars}</div>}
      <p style={quoteStyle}>"{quote}"</p>
      <div style={authorStyle}>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={authorName ?? ''}
            width={36}
            height={36}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        <div style={authorTextStyle}>
          {authorName && <div style={{ fontWeight: 'bold', fontSize: 14 }}>{authorName}</div>}
          {authorTitle && <div style={{ fontSize: 12, opacity: 0.7 }}>{authorTitle}</div>}
        </div>
      </div>
    </div>
  );
}
