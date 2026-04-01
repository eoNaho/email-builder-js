import React, { useState } from 'react';
import { ZodError } from 'zod';

import { GradeOutlined } from '@mui/icons-material';
import { TestimonialProps, TestimonialPropsDefaults, TestimonialPropsSchema } from '@usewaypoint/block-testimonial';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import SliderInput from './helpers/inputs/SliderInput';
import TextInput from './helpers/inputs/TextInput';
import VisibilityInput from './helpers/inputs/VisibilityInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type TestimonialSidebarPanelProps = {
  data: TestimonialProps;
  setData: (v: TestimonialProps) => void;
};
export default function TestimonialSidebarPanel({ data, setData }: TestimonialSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = TestimonialPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Testimonial block">
      <TextInput
        label="Quote"
        rows={4}
        defaultValue={data.props?.quote ?? TestimonialPropsDefaults.quote}
        onChange={(quote) => updateData({ ...data, props: { ...data.props, quote } })}
      />
      <TextInput
        label="Author name"
        defaultValue={data.props?.authorName ?? TestimonialPropsDefaults.authorName}
        onChange={(authorName) => updateData({ ...data, props: { ...data.props, authorName } })}
      />
      <TextInput
        label="Author title"
        defaultValue={data.props?.authorTitle ?? TestimonialPropsDefaults.authorTitle}
        onChange={(authorTitle) => updateData({ ...data, props: { ...data.props, authorTitle } })}
      />
      <TextInput
        label="Avatar URL"
        defaultValue={data.props?.avatarUrl ?? TestimonialPropsDefaults.avatarUrl}
        onChange={(v) => {
          const avatarUrl = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, avatarUrl } });
        }}
      />
      <SliderInput
        label="Rating (0 = hide)"
        iconLabel={<GradeOutlined sx={{ color: 'text.secondary' }} />}
        units=""
        step={1}
        min={0}
        max={5}
        defaultValue={data.props?.rating ?? TestimonialPropsDefaults.rating}
        onChange={(rating) => updateData({ ...data, props: { ...data.props, rating } })}
      />
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
