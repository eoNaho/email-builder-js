import React, { CSSProperties } from 'react';
import { z } from 'zod';

import {
  COLOR_SCHEMA,
  MOBILE_OVERRIDES_SCHEMA,
  PADDING_SCHEMA,
  VISIBILITY_SCHEMA,
  getPadding,
} from '@usewaypoint/document-core';

export const ProgressBarPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      value: z.number().min(0).max(100).optional().nullable(),
      label: z.string().optional().nullable(),
      barColor: COLOR_SCHEMA,
      trackColor: COLOR_SCHEMA,
      height: z.number().min(2).max(48).optional().nullable(),
      borderRadius: z.number().min(0).max(24).optional().nullable(),
      showValue: z.boolean().optional().nullable(),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
  mobileOverrides: MOBILE_OVERRIDES_SCHEMA,
});

export type ProgressBarProps = z.infer<typeof ProgressBarPropsSchema>;

export const ProgressBarPropsDefaults = {
  value: 65,
  barColor: '#4F46E5',
  trackColor: '#E5E7EB',
  height: 12,
  borderRadius: 6,
  showValue: false,
} as const;

export function ProgressBar({ style, props }: ProgressBarProps) {
  const value = Math.min(100, Math.max(0, props?.value ?? ProgressBarPropsDefaults.value));
  const label = props?.label ?? undefined;
  const barColor = props?.barColor ?? ProgressBarPropsDefaults.barColor;
  const trackColor = props?.trackColor ?? ProgressBarPropsDefaults.trackColor;
  const height = props?.height ?? ProgressBarPropsDefaults.height;
  const borderRadius = props?.borderRadius ?? ProgressBarPropsDefaults.borderRadius;
  const showValue = props?.showValue ?? ProgressBarPropsDefaults.showValue;

  const wrapperStyle: CSSProperties = {
    backgroundColor: style?.backgroundColor ?? undefined,
    padding: getPadding(style?.padding),
  };

  const trackStyle: CSSProperties = {
    backgroundColor: trackColor ?? ProgressBarPropsDefaults.trackColor,
    borderRadius,
    height,
    width: '100%',
    overflow: 'hidden',
  };

  const fillStyle: CSSProperties = {
    backgroundColor: barColor ?? ProgressBarPropsDefaults.barColor,
    borderRadius,
    height: '100%',
    width: `${value}%`,
  };

  return (
    <div style={wrapperStyle}>
      {label && (
        <div style={{ marginBottom: 4, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
          <span>{label}</span>
          {showValue && <span>{value}%</span>}
        </div>
      )}
      {!label && showValue && (
        <div style={{ marginBottom: 4, fontSize: 14, textAlign: 'right' }}>{value}%</div>
      )}
      <div style={trackStyle}>
        <div style={fillStyle} />
      </div>
    </div>
  );
}
