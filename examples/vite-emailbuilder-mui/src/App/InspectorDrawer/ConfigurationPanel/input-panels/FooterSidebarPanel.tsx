import React, { useState } from 'react';
import { ZodError } from 'zod';

import { FooterProps, FooterPropsDefaults, FooterPropsSchema } from '@usewaypoint/block-footer';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import TextInput from './helpers/inputs/TextInput';
import VisibilityInput from './helpers/inputs/VisibilityInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type FooterSidebarPanelProps = {
  data: FooterProps;
  setData: (v: FooterProps) => void;
};
export default function FooterSidebarPanel({ data, setData }: FooterSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = FooterPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Footer block">
      <TextInput
        label="Company name"
        defaultValue={data.props?.companyName ?? FooterPropsDefaults.companyName}
        onChange={(companyName) => updateData({ ...data, props: { ...data.props, companyName } })}
      />
      <TextInput
        label="Address"
        rows={3}
        defaultValue={data.props?.address ?? FooterPropsDefaults.address}
        onChange={(address) => updateData({ ...data, props: { ...data.props, address } })}
      />
      <TextInput
        label="Copyright"
        defaultValue={data.props?.copyright ?? FooterPropsDefaults.copyright}
        onChange={(copyright) => updateData({ ...data, props: { ...data.props, copyright } })}
      />
      <TextInput
        label="Unsubscribe URL"
        defaultValue={data.props?.unsubscribeUrl ?? FooterPropsDefaults.unsubscribeUrl}
        onChange={(unsubscribeUrl) => updateData({ ...data, props: { ...data.props, unsubscribeUrl } })}
      />
      <TextInput
        label="Unsubscribe text"
        defaultValue={data.props?.unsubscribeText ?? FooterPropsDefaults.unsubscribeText}
        onChange={(unsubscribeText) => updateData({ ...data, props: { ...data.props, unsubscribeText } })}
      />
      <MultiStylePropertyPanel
        names={['color', 'backgroundColor', 'fontFamily', 'fontSize', 'textAlign', 'padding']}
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
