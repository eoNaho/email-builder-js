import { TestimonialPropsSchema } from '@usewaypoint/block-testimonial';

export { TestimonialPropsSchema };
export type TestimonialProps = import('zod').infer<typeof TestimonialPropsSchema>;
export default TestimonialPropsSchema;
