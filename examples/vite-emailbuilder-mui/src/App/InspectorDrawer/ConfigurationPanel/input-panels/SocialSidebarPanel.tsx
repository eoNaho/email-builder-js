import React, { useState } from 'react';
import { ZodError } from 'zod';

import { OpenWith, SpaceBar } from '@mui/icons-material';
import { SocialProps, SocialPropsDefaults, SocialPropsSchema } from '@usewaypoint/block-social';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import SliderInput from './helpers/inputs/SliderInput';
import TextInput from './helpers/inputs/TextInput';
import VisibilityInput from './helpers/inputs/VisibilityInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type SocialSidebarPanelProps = {
  data: SocialProps;
  setData: (v: SocialProps) => void;
};
export default function SocialSidebarPanel({ data, setData }: SocialSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = SocialPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const platforms = data.props?.platforms ?? SocialPropsDefaults.platforms;
  const size = data.props?.size ?? SocialPropsDefaults.size;
  const gap = data.props?.gap ?? SocialPropsDefaults.gap;

  return (
    <BaseSidebarPanel title="Social links block">
      <SliderInput
        label="Icon size"
        iconLabel={<OpenWith sx={{ color: 'text.secondary' }} />}
        units="px"
        step={4}
        min={16}
        max={64}
        defaultValue={size}
        onChange={(size) => updateData({ ...data, props: { ...data.props, size } })}
      />
      <SliderInput
        label="Gap between icons"
        iconLabel={<SpaceBar sx={{ color: 'text.secondary' }} />}
        units="px"
        step={2}
        min={0}
        max={32}
        defaultValue={gap}
        onChange={(gap) => updateData({ ...data, props: { ...data.props, gap } })}
      />
      {platforms.map((item, index) => (
        <TextInput
          key={index}
          label={`${item.platform} URL`}
          defaultValue={item.url}
          onChange={(url) => {
            const newPlatforms = platforms.map((p, i) => (i === index ? { ...p, url } : p));
            updateData({ ...data, props: { ...data.props, platforms: newPlatforms } });
          }}
        />
      ))}
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
