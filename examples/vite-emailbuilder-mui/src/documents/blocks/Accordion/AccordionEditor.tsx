import React from 'react';

import { Accordion } from '@usewaypoint/block-accordion';

import { AccordionProps } from './AccordionPropsSchema';

export default function AccordionEditor({ style, props }: AccordionProps) {
  return <Accordion style={style} props={props} />;
}
