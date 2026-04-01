import { z } from 'zod';

import { RowPropsSchema as BaseRowPropsSchema } from '@usewaypoint/block-row';

const RowPropsSchema = z.object({
  style: BaseRowPropsSchema.shape.style,
  props: z
    .object({
      ...BaseRowPropsSchema.shape.props.unwrap().unwrap().shape,
      columns: z.array(z.object({ childrenIds: z.array(z.string()) })).min(1).max(4).optional().nullable(),
    })
    .optional()
    .nullable(),
});

export default RowPropsSchema;
export type RowProps = z.infer<typeof RowPropsSchema>;
