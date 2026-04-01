import { ProgressBarPropsSchema } from '@usewaypoint/block-progress-bar';

export { ProgressBarPropsSchema };
export type ProgressBarProps = import('zod').infer<typeof ProgressBarPropsSchema>;
export default ProgressBarPropsSchema;
