import { CountdownPropsSchema } from '@usewaypoint/block-countdown';

export { CountdownPropsSchema };
export type CountdownProps = import('zod').infer<typeof CountdownPropsSchema>;
export default CountdownPropsSchema;
