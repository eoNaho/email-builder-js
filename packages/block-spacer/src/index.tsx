import React, { CSSProperties } from 'react';
import { z } from 'zod';

import { MOBILE_OVERRIDES_SCHEMA, VISIBILITY_SCHEMA } from '@usewaypoint/document-core';

export const SpacerPropsSchema = z.object({
  props: z
    .object({
      height: z.number().gte(0).optional().nullish(),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
  mobileOverrides: MOBILE_OVERRIDES_SCHEMA,
});

export type SpacerProps = z.infer<typeof SpacerPropsSchema>;

export const SpacerPropsDefaults = {
  height: 16,
};

export function Spacer({ props }: SpacerProps) {
  const style: CSSProperties = {
    height: props?.height ?? SpacerPropsDefaults.height,
  };
  return <div style={style} />;
}
