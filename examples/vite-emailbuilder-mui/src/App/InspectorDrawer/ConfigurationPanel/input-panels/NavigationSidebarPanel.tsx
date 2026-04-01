import React, { useState } from 'react';
import { ZodError } from 'zod';

import { NavigationProps, NavigationPropsDefaults, NavigationPropsSchema } from '@usewaypoint/block-navigation';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import TextInput from './helpers/inputs/TextInput';
import VisibilityInput from './helpers/inputs/VisibilityInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type NavigationSidebarPanelProps = {
  data: NavigationProps;
  setData: (v: NavigationProps) => void;
};
export default function NavigationSidebarPanel({ data, setData }: NavigationSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = NavigationPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const links = data.props?.links ?? NavigationPropsDefaults.links;

  return (
    <BaseSidebarPanel title="Navigation block">
      {links.map((link, index) => (
        <React.Fragment key={index}>
          <TextInput
            label={`Link ${index + 1} text`}
            defaultValue={link.text}
            onChange={(text) => {
              const newLinks = links.map((l, i) => (i === index ? { ...l, text } : l));
              updateData({ ...data, props: { ...data.props, links: newLinks } });
            }}
          />
          <TextInput
            label={`Link ${index + 1} URL`}
            defaultValue={link.url}
            onChange={(url) => {
              const newLinks = links.map((l, i) => (i === index ? { ...l, url } : l));
              updateData({ ...data, props: { ...data.props, links: newLinks } });
            }}
          />
        </React.Fragment>
      ))}
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
