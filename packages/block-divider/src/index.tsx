import React, { CSSProperties } from 'react';
import { z } from 'zod';

import { COLOR_SCHEMA, MOBILE_OVERRIDES_SCHEMA, PADDING_SCHEMA, VISIBILITY_SCHEMA, getPadding } from '@usewaypoint/document-core';

export const DividerPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      lineColor: COLOR_SCHEMA,
      lineHeight: z.number().optional().nullable(),
      lineStyle: z.enum(['solid', 'dashed', 'dotted', 'double']).optional().nullable(),
      gradient: z.object({ from: COLOR_SCHEMA, to: COLOR_SCHEMA }).optional().nullable(),
      width: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
  mobileOverrides: MOBILE_OVERRIDES_SCHEMA,
});

export type DividerProps = z.infer<typeof DividerPropsSchema>;

export const DividerPropsDefaults = {
  lineHeight: 1,
  lineColor: '#333333',
};

export function Divider({ style, props }: DividerProps) {
  const st: CSSProperties = {
    padding: getPadding(style?.padding),
    backgroundColor: style?.backgroundColor ?? undefined,
  };
  const borderTopWidth = props?.lineHeight ?? DividerPropsDefaults.lineHeight;
  const borderTopColor = props?.lineColor ?? DividerPropsDefaults.lineColor;
  const lineStyle = props?.lineStyle ?? 'solid';
  const gradient = props?.gradient;
  const width = props?.width ?? '100%';

  if (gradient?.from && gradient?.to) {
    return (
      <div style={st}>
        <div
          style={{
            width,
            height: borderTopWidth,
            background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
            margin: '0 auto',
          }}
        />
      </div>
    );
  }

  return (
    <div style={st}>
      <hr
        style={{
          width,
          border: 'none',
          borderTop: `${borderTopWidth}px ${lineStyle} ${borderTopColor}`,
          margin: '0 auto',
        }}
      />
    </div>
  );
}
