import React, { CSSProperties } from 'react';
import { z } from 'zod';

import {
  COLOR_SCHEMA,
  MOBILE_OVERRIDES_SCHEMA,
  PADDING_SCHEMA,
  VISIBILITY_SCHEMA,
  getPadding,
} from '@usewaypoint/document-core';

export const RatingPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      padding: PADDING_SCHEMA,
      textAlign: z.enum(['left', 'center', 'right']).optional().nullable(),
    })
    .optional()
    .nullable(),
  props: z
    .object({
      rating: z.number().min(0).max(10).optional().nullable(),
      maxStars: z.number().min(1).max(10).optional().nullable(),
      starSize: z.number().min(8).max(64).optional().nullable(),
      activeColor: COLOR_SCHEMA,
      inactiveColor: COLOR_SCHEMA,
      linkUrl: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
  mobileOverrides: MOBILE_OVERRIDES_SCHEMA,
});

export type RatingProps = z.infer<typeof RatingPropsSchema>;

export const RatingPropsDefaults = {
  rating: 4,
  maxStars: 5,
  starSize: 24,
  activeColor: '#F59E0B',
  inactiveColor: '#D1D5DB',
} as const;

function StarIcon({ filled, size, color }: { filled: boolean; size: number; color: string }) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export function Rating({ style, props }: RatingProps) {
  const rating = props?.rating ?? RatingPropsDefaults.rating;
  const maxStars = props?.maxStars ?? RatingPropsDefaults.maxStars;
  const starSize = props?.starSize ?? RatingPropsDefaults.starSize;
  const activeColor = props?.activeColor ?? RatingPropsDefaults.activeColor;
  const inactiveColor = props?.inactiveColor ?? RatingPropsDefaults.inactiveColor;
  const linkUrl = props?.linkUrl ?? undefined;

  const wrapperStyle: CSSProperties = {
    backgroundColor: style?.backgroundColor ?? undefined,
    padding: getPadding(style?.padding),
    textAlign: style?.textAlign ?? 'center',
  };

  const stars = Array.from({ length: maxStars }, (_, i) => (
    <span key={i} style={{ display: 'inline-block', lineHeight: 0 }}>
      <StarIcon
        filled={i < rating}
        size={starSize}
        color={i < rating ? (activeColor ?? RatingPropsDefaults.activeColor) : (inactiveColor ?? RatingPropsDefaults.inactiveColor)}
      />
    </span>
  ));

  const content = linkUrl ? (
    <a href={linkUrl} style={{ display: 'inline-block', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
      {stars}
    </a>
  ) : (
    <span style={{ display: 'inline-block' }}>{stars}</span>
  );

  return <div style={wrapperStyle}>{content}</div>;
}
