import React from 'react';

import { Countdown } from '@usewaypoint/block-countdown';

import { CountdownProps } from './CountdownPropsSchema';

export default function CountdownEditor({ style, props }: CountdownProps) {
  return <Countdown style={style} props={props} />;
}
