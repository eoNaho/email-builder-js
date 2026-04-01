import React from 'react';

import { Testimonial } from '@usewaypoint/block-testimonial';

import { TestimonialProps } from './TestimonialPropsSchema';

export default function TestimonialEditor({ style, props }: TestimonialProps) {
  return <Testimonial style={style} props={props} />;
}
