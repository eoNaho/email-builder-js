import { z } from 'zod';

import { ColumnsContainerPropsSchema as BaseColumnsContainerPropsSchema } from '@usewaypoint/block-columns-container';
import { VISIBILITY_SCHEMA } from '@usewaypoint/document-core';

const BasePropsShape = BaseColumnsContainerPropsSchema.shape.props.unwrap().unwrap().shape;

const ColumnsContainerPropsSchema = z.object({
  style: BaseColumnsContainerPropsSchema.shape.style,
  props: z
    .object({
      ...BasePropsShape,
      columns: z.array(z.object({ childrenIds: z.array(z.string()) })).min(2).max(4),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
});

export type ColumnsContainerProps = z.infer<typeof ColumnsContainerPropsSchema>;
export default ColumnsContainerPropsSchema;
