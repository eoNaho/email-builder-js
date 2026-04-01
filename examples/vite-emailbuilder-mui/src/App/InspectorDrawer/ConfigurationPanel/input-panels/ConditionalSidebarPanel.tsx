import React, { useState } from 'react';
import { ZodError } from 'zod';

import { ToggleButton } from '@mui/material';
import { ConditionalProps, ConditionalPropsSchema } from '@usewaypoint/email-builder';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextInput from './helpers/inputs/TextInput';

type ConditionalSidebarPanelProps = {
  data: ConditionalProps;
  setData: (v: ConditionalProps) => void;
};
export default function ConditionalSidebarPanel({ data, setData }: ConditionalSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = ConditionalPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Conditional block">
      <TextInput
        label="Variable name"
        placeholder="e.g. firstName"
        defaultValue={data.props?.variable ?? ''}
        onChange={(variable) => updateData({ ...data, props: { ...data.props, variable } })}
      />
      <RadioGroupInput
        label="Operator"
        defaultValue={data.props?.operator ?? 'exists'}
        onChange={(operator) => updateData({ ...data, props: { ...data.props, operator } })}
      >
        <ToggleButton value="exists">Exists</ToggleButton>
        <ToggleButton value="not_exists">Not exists</ToggleButton>
        <ToggleButton value="equals">Equals</ToggleButton>
        <ToggleButton value="not_equals">Not equals</ToggleButton>
      </RadioGroupInput>
      <TextInput
        label="Value (for equals/not equals)"
        placeholder="e.g. premium"
        defaultValue={data.props?.value ?? ''}
        onChange={(value) => updateData({ ...data, props: { ...data.props, value } })}
      />
    </BaseSidebarPanel>
  );
}
