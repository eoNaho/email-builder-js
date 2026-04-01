import React from 'react';

import { ReaderBlock } from '../../Reader/core';
import { useVariables } from '../../VariablesContext';

import { ConditionalProps } from './ConditionalPropsSchema';

function evaluateCondition(
  variable: string | null | undefined,
  operator: string | null | undefined,
  value: string | null | undefined,
  variables: Record<string, string>
): boolean {
  if (!variable) return true;
  const varValue = variables[variable];
  switch (operator ?? 'exists') {
    case 'equals':
      return varValue === (value ?? '');
    case 'not_equals':
      return varValue !== (value ?? '');
    case 'exists':
      return varValue !== undefined && varValue !== '';
    case 'not_exists':
      return varValue === undefined || varValue === '';
    default:
      return true;
  }
}

export default function ConditionalReader({ props }: ConditionalProps) {
  const variables = useVariables();
  const childrenIds = props?.childrenIds ?? [];

  const shouldRender = evaluateCondition(props?.variable, props?.operator, props?.value, variables);

  return (
    <>
      {shouldRender
        ? childrenIds.map((childId) => <ReaderBlock key={childId} id={childId} />)
        : null}
    </>
  );
}
