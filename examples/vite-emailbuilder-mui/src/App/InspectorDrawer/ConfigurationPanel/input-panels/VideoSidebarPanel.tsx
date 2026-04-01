import React, { useState } from 'react';
import { ZodError } from 'zod';

import { VideoProps, VideoPropsDefaults, VideoPropsSchema } from '@usewaypoint/block-video';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import TextInput from './helpers/inputs/TextInput';
import VisibilityInput from './helpers/inputs/VisibilityInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type VideoSidebarPanelProps = {
  data: VideoProps;
  setData: (v: VideoProps) => void;
};
export default function VideoSidebarPanel({ data, setData }: VideoSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = VideoPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Video block">
      <TextInput
        label="Thumbnail URL"
        defaultValue={data.props?.thumbnailUrl ?? VideoPropsDefaults.thumbnailUrl}
        onChange={(thumbnailUrl) => updateData({ ...data, props: { ...data.props, thumbnailUrl } })}
      />
      <TextInput
        label="Video URL"
        defaultValue={data.props?.videoUrl ?? VideoPropsDefaults.videoUrl}
        onChange={(videoUrl) => updateData({ ...data, props: { ...data.props, videoUrl } })}
      />
      <TextInput
        label="Alt text"
        defaultValue={data.props?.alt ?? VideoPropsDefaults.alt}
        onChange={(alt) => updateData({ ...data, props: { ...data.props, alt } })}
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
