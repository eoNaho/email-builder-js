import React from 'react';

import { Rating } from '@usewaypoint/block-rating';

import { RatingProps } from './RatingPropsSchema';

export default function RatingEditor({ style, props }: RatingProps) {
  return <Rating style={style} props={props} />;
}
