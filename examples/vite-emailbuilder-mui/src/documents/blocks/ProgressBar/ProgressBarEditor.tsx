import React from 'react';

import { ProgressBar } from '@usewaypoint/block-progress-bar';

import { ProgressBarProps } from './ProgressBarPropsSchema';

export default function ProgressBarEditor({ style, props }: ProgressBarProps) {
  return <ProgressBar style={style} props={props} />;
}
