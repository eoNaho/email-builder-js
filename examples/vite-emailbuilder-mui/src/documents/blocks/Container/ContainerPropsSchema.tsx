import { z } from 'zod';

import { ContainerPropsSchema as BaseContainerPropsSchema } from '@usewaypoint/block-container';
import { VISIBILITY_SCHEMA } from '@usewaypoint/document-core';

const ContainerPropsSchema = z.object({
  style: BaseContainerPropsSchema.shape.style,
  props: z
    .object({
      childrenIds: z.array(z.string()).optional().nullable(),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
});

export default ContainerPropsSchema;

export type ContainerProps = z.infer<typeof ContainerPropsSchema>;
