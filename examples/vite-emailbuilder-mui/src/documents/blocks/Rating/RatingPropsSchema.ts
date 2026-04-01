import { RatingPropsSchema } from '@usewaypoint/block-rating';

export { RatingPropsSchema };
export type RatingProps = import('zod').infer<typeof RatingPropsSchema>;
export default RatingPropsSchema;
