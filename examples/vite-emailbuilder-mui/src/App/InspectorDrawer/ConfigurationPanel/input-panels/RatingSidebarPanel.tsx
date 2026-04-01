import React, { useState } from 'react';
import { ZodError } from 'zod';

import { GradeOutlined, StarOutlineOutlined, FormatSizeOutlined } from '@mui/icons-material';
import { RatingProps, RatingPropsDefaults, RatingPropsSchema } from '@usewaypoint/block-rating';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import SliderInput from './helpers/inputs/SliderInput';
import TextInput from './helpers/inputs/TextInput';
import VisibilityInput from './helpers/inputs/VisibilityInput';
import { NullableColorInput } from './helpers/inputs/ColorInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type RatingSidebarPanelProps = {
  data: RatingProps;
  setData: (v: RatingProps) => void;
};
export default function RatingSidebarPanel({ data, setData }: RatingSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = RatingPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Rating block">
      <SliderInput
        label="Rating value"
        iconLabel={<GradeOutlined sx={{ color: 'text.secondary' }} />}
        units=""
        step={0.5}
        min={0}
        max={data.props?.maxStars ?? RatingPropsDefaults.maxStars}
        defaultValue={data.props?.rating ?? RatingPropsDefaults.rating}
        onChange={(rating) => updateData({ ...data, props: { ...data.props, rating } })}
      />
      <SliderInput
        label="Max stars"
        iconLabel={<StarOutlineOutlined sx={{ color: 'text.secondary' }} />}
        units=""
        step={1}
        min={1}
        max={10}
        defaultValue={data.props?.maxStars ?? RatingPropsDefaults.maxStars}
        onChange={(maxStars) => updateData({ ...data, props: { ...data.props, maxStars } })}
      />
      <SliderInput
        label="Star size"
        iconLabel={<FormatSizeOutlined sx={{ color: 'text.secondary' }} />}
        units="px"
        step={2}
        min={8}
        max={64}
        defaultValue={data.props?.starSize ?? RatingPropsDefaults.starSize}
        onChange={(starSize) => updateData({ ...data, props: { ...data.props, starSize } })}
      />
      <NullableColorInput
        label="Active color"
        defaultValue={data.props?.activeColor ?? RatingPropsDefaults.activeColor}
        onChange={(activeColor) => updateData({ ...data, props: { ...data.props, activeColor } })}
      />
      <NullableColorInput
        label="Inactive color"
        defaultValue={data.props?.inactiveColor ?? RatingPropsDefaults.inactiveColor}
        onChange={(inactiveColor) => updateData({ ...data, props: { ...data.props, inactiveColor } })}
      />
      <TextInput
        label="Link URL (optional)"
        defaultValue={data.props?.linkUrl ?? ''}
        onChange={(v) => {
          const linkUrl = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, linkUrl } });
        }}
      />
      <MultiStylePropertyPanel
        names={['backgroundColor', 'textAlign', 'padding']}
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
