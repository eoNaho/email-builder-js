import React, { useState } from 'react';
import { ZodError } from 'zod';

import { PercentOutlined, HeightOutlined, RoundedCornerOutlined } from '@mui/icons-material';
import { ProgressBarProps, ProgressBarPropsDefaults, ProgressBarPropsSchema } from '@usewaypoint/block-progress-bar';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import BooleanInput from './helpers/inputs/BooleanInput';
import SliderInput from './helpers/inputs/SliderInput';
import TextInput from './helpers/inputs/TextInput';
import VisibilityInput from './helpers/inputs/VisibilityInput';
import { NullableColorInput } from './helpers/inputs/ColorInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type ProgressBarSidebarPanelProps = {
  data: ProgressBarProps;
  setData: (v: ProgressBarProps) => void;
};
export default function ProgressBarSidebarPanel({ data, setData }: ProgressBarSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = ProgressBarPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Progress Bar block">
      <SliderInput
        label="Value"
        iconLabel={<PercentOutlined sx={{ color: 'text.secondary' }} />}
        units="%"
        step={1}
        min={0}
        max={100}
        defaultValue={data.props?.value ?? ProgressBarPropsDefaults.value}
        onChange={(value) => updateData({ ...data, props: { ...data.props, value } })}
      />
      <TextInput
        label="Label (optional)"
        defaultValue={data.props?.label ?? ''}
        onChange={(v) => {
          const label = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, label } });
        }}
      />
      <BooleanInput
        label="Show percentage value"
        defaultValue={data.props?.showValue ?? ProgressBarPropsDefaults.showValue}
        onChange={(showValue) => updateData({ ...data, props: { ...data.props, showValue } })}
      />
      <NullableColorInput
        label="Bar color"
        defaultValue={data.props?.barColor ?? ProgressBarPropsDefaults.barColor}
        onChange={(barColor) => updateData({ ...data, props: { ...data.props, barColor } })}
      />
      <NullableColorInput
        label="Track color"
        defaultValue={data.props?.trackColor ?? ProgressBarPropsDefaults.trackColor}
        onChange={(trackColor) => updateData({ ...data, props: { ...data.props, trackColor } })}
      />
      <SliderInput
        label="Height"
        iconLabel={<HeightOutlined sx={{ color: 'text.secondary' }} />}
        units="px"
        step={1}
        min={2}
        max={48}
        defaultValue={data.props?.height ?? ProgressBarPropsDefaults.height}
        onChange={(height) => updateData({ ...data, props: { ...data.props, height } })}
      />
      <SliderInput
        label="Border radius"
        iconLabel={<RoundedCornerOutlined sx={{ color: 'text.secondary' }} />}
        units="px"
        step={1}
        min={0}
        max={24}
        defaultValue={data.props?.borderRadius ?? ProgressBarPropsDefaults.borderRadius}
        onChange={(borderRadius) => updateData({ ...data, props: { ...data.props, borderRadius } })}
      />
      <MultiStylePropertyPanel
        names={['backgroundColor', 'padding']}
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
