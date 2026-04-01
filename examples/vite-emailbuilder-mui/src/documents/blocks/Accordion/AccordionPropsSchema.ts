import { AccordionPropsSchema } from '@usewaypoint/block-accordion';

export { AccordionPropsSchema };
export type AccordionProps = import('zod').infer<typeof AccordionPropsSchema>;
export default AccordionPropsSchema;
