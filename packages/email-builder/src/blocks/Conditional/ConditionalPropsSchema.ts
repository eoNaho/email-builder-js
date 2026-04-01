import { z } from 'zod';

const ConditionalPropsSchema = z.object({
  style: z.null().optional(),
  props: z
    .object({
      variable: z.string().optional().nullable(),
      operator: z.enum(['equals', 'not_equals', 'exists', 'not_exists']).optional().nullable(),
      value: z.string().optional().nullable(),
      childrenIds: z.array(z.string()).optional().nullable(),
    })
    .optional()
    .nullable(),
});

export default ConditionalPropsSchema;
export type ConditionalProps = z.infer<typeof ConditionalPropsSchema>;
