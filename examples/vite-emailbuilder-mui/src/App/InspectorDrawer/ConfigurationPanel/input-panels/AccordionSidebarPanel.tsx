import React, { useState } from 'react';
import { ZodError } from 'zod';

import { AddOutlined, DeleteOutlined, FormatSizeOutlined } from '@mui/icons-material';
import { Box, Button, Divider, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { AccordionProps, AccordionPropsDefaults, AccordionPropsSchema } from '@usewaypoint/block-accordion';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import BooleanInput from './helpers/inputs/BooleanInput';
import { NullableColorInput } from './helpers/inputs/ColorInput';
import SliderInput from './helpers/inputs/SliderInput';
import VisibilityInput from './helpers/inputs/VisibilityInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type AccordionSidebarPanelProps = {
  data: AccordionProps;
  setData: (v: AccordionProps) => void;
};

type AccordionItem = { title: string; content: string };

export default function AccordionSidebarPanel({ data, setData }: AccordionSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = AccordionPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const items: AccordionItem[] = data.props?.items ?? [...AccordionPropsDefaults.items];

  const updateItems = (newItems: AccordionItem[]) =>
    updateData({ ...data, props: { ...data.props, items: newItems } });

  const addItem = () =>
    updateItems([...items, { title: 'New question', content: 'Your answer here' }]);

  const removeItem = (idx: number) =>
    updateItems(items.filter((_, i) => i !== idx));

  const updateItem = (idx: number, patch: Partial<AccordionItem>) => {
    const next = items.map((item, i) => (i === idx ? { ...item, ...patch } : item));
    updateItems(next);
  };

  return (
    <BaseSidebarPanel title="Accordion / FAQ block">
      <SliderInput
        label="Title font size"
        iconLabel={<FormatSizeOutlined sx={{ color: 'text.secondary' }} />}
        units="px"
        step={1}
        min={12}
        max={28}
        defaultValue={data.props?.titleFontSize ?? AccordionPropsDefaults.titleFontSize}
        onChange={(titleFontSize) => updateData({ ...data, props: { ...data.props, titleFontSize } })}
      />
      <SliderInput
        label="Content font size"
        iconLabel={<FormatSizeOutlined sx={{ color: 'text.secondary' }} />}
        units="px"
        step={1}
        min={10}
        max={24}
        defaultValue={data.props?.contentFontSize ?? AccordionPropsDefaults.contentFontSize}
        onChange={(contentFontSize) => updateData({ ...data, props: { ...data.props, contentFontSize } })}
      />
      <NullableColorInput
        label="Title color"
        defaultValue={data.props?.titleColor ?? AccordionPropsDefaults.titleColor}
        onChange={(titleColor) => updateData({ ...data, props: { ...data.props, titleColor } })}
      />
      <NullableColorInput
        label="Content color"
        defaultValue={data.props?.contentColor ?? AccordionPropsDefaults.contentColor}
        onChange={(contentColor) => updateData({ ...data, props: { ...data.props, contentColor } })}
      />
      <BooleanInput
        label="Default open"
        defaultValue={data.props?.defaultOpen ?? AccordionPropsDefaults.defaultOpen}
        onChange={(defaultOpen) => updateData({ ...data, props: { ...data.props, defaultOpen } })}
      />

      <Divider />
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        Items
      </Typography>
      <Stack spacing={1.5}>
        {items.map((item, idx) => (
          <Box key={idx} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="caption" color="text.secondary">Item {idx + 1}</Typography>
              <Tooltip title="Remove">
                <IconButton size="small" onClick={() => removeItem(idx)} disabled={items.length <= 1}>
                  <DeleteOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            <Stack spacing={0.5}>
              <TextField
                size="small"
                label="Question / Title"
                value={item.title}
                onChange={(e) => updateItem(idx, { title: e.target.value })}
                fullWidth
                InputProps={{ sx: { fontSize: 12 } }}
              />
              <TextField
                size="small"
                label="Answer / Content (HTML allowed)"
                value={item.content}
                onChange={(e) => updateItem(idx, { content: e.target.value })}
                fullWidth
                multiline
                rows={3}
                InputProps={{ sx: { fontSize: 12 } }}
              />
            </Stack>
          </Box>
        ))}
        <Button size="small" startIcon={<AddOutlined />} onClick={addItem} variant="outlined" sx={{ textTransform: 'none' }}>
          Add item
        </Button>
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
