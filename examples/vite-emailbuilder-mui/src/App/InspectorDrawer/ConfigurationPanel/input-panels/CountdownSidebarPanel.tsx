import React, { useState } from 'react';
import { ZodError } from 'zod';

import { FormatSizeOutlined } from '@mui/icons-material';
import { InputLabel, Stack, TextField } from '@mui/material';
import { CountdownProps, CountdownPropsDefaults, CountdownPropsSchema } from '@usewaypoint/block-countdown';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import { NullableColorInput } from './helpers/inputs/ColorInput';
import SliderInput from './helpers/inputs/SliderInput';
import TextInput from './helpers/inputs/TextInput';
import VisibilityInput from './helpers/inputs/VisibilityInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type CountdownSidebarPanelProps = {
  data: CountdownProps;
  setData: (v: CountdownProps) => void;
};

export default function CountdownSidebarPanel({ data, setData }: CountdownSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = CountdownPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const labels = data.props?.labels ?? CountdownPropsDefaults.labels;

  return (
    <BaseSidebarPanel title="Countdown block">
      <Stack spacing={0.5}>
        <InputLabel shrink>Target date & time</InputLabel>
        <TextField
          type="datetime-local"
          size="small"
          fullWidth
          value={data.props?.targetDate ?? ''}
          onChange={(e) => updateData({ ...data, props: { ...data.props, targetDate: e.target.value || null } })}
          InputProps={{ sx: { fontSize: 13 } }}
        />
      </Stack>
      <TextInput
        label="Timezone (e.g. America/New_York)"
        defaultValue={data.props?.timezone ?? ''}
        onChange={(v) => updateData({ ...data, props: { ...data.props, timezone: v || null } })}
      />
      <TextInput
        label="Expired text"
        defaultValue={data.props?.expiredText ?? CountdownPropsDefaults.expiredText}
        onChange={(expiredText) => updateData({ ...data, props: { ...data.props, expiredText } })}
      />
      <NullableColorInput
        label="Background color"
        defaultValue={data.props?.backgroundColor ?? CountdownPropsDefaults.backgroundColor}
        onChange={(backgroundColor) => updateData({ ...data, props: { ...data.props, backgroundColor } })}
      />
      <NullableColorInput
        label="Text color"
        defaultValue={data.props?.textColor ?? CountdownPropsDefaults.textColor}
        onChange={(textColor) => updateData({ ...data, props: { ...data.props, textColor } })}
      />
      <SliderInput
        label="Font size"
        iconLabel={<FormatSizeOutlined sx={{ color: 'text.secondary' }} />}
        units="px"
        step={2}
        min={16}
        max={64}
        defaultValue={data.props?.fontSize ?? CountdownPropsDefaults.fontSize}
        onChange={(fontSize) => updateData({ ...data, props: { ...data.props, fontSize } })}
      />
      <TextInput
        label="Link URL (optional)"
        defaultValue={data.props?.linkUrl ?? ''}
        onChange={(v) => updateData({ ...data, props: { ...data.props, linkUrl: v || null } })}
      />

      <Stack spacing={0.5}>
        <InputLabel shrink>Labels</InputLabel>
        {(['days', 'hours', 'minutes', 'seconds'] as const).map((key) => (
          <TextField
            key={key}
            size="small"
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={labels?.[key] ?? key.charAt(0).toUpperCase() + key.slice(1)}
            onChange={(e) =>
              updateData({ ...data, props: { ...data.props, labels: { ...labels, [key]: e.target.value } } })
            }
            InputProps={{ sx: { fontSize: 12 } }}
          />
        ))}
      </Stack>

      <MultiStylePropertyPanel
        names={['backgroundColor', 'fontFamily', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
      <VisibilityInput
        defaultValue={data.visibility}
        onChange={(visibility) => updateData({ ...data, visibility })}
      />
    </BaseSidebarPanel>
  );
}
