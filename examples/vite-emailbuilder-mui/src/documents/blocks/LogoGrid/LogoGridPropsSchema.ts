import { LogoGridPropsSchema } from '@usewaypoint/block-logo-grid';

export { LogoGridPropsSchema };
export type LogoGridProps = import('zod').infer<typeof LogoGridPropsSchema>;
export default LogoGridPropsSchema;
