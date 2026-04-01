import React from 'react';

import { LogoGrid } from '@usewaypoint/block-logo-grid';

import { LogoGridProps } from './LogoGridPropsSchema';

export default function LogoGridEditor({ style, props }: LogoGridProps) {
  return <LogoGrid style={style} props={props} />;
}
