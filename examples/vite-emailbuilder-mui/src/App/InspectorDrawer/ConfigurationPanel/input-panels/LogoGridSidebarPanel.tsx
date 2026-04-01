import React, { useState } from 'react';
import { ZodError } from 'zod';

import { AddOutlined, DeleteOutlined, HeightOutlined, RoundedCornerOutlined, ViewColumnOutlined } from '@mui/icons-material';
import { Box, Button, Divider, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { LogoGridProps, LogoGridPropsDefaults, LogoGridPropsSchema } from '@usewaypoint/block-logo-grid';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import BooleanInput from './helpers/inputs/BooleanInput';
import SliderInput from './helpers/inputs/SliderInput';
import VisibilityInput from './helpers/inputs/VisibilityInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type LogoGridSidebarPanelProps = {
  data: LogoGridProps;
  setData: (v: LogoGridProps) => void;
};

type LogoItem = { src: string; alt?: string | null; url?: string | null; width?: number | null };

export default function LogoGridSidebarPanel({ data, setData }: LogoGridSidebarPanelProps) {
  const [, setErrors] = useState<ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = LogoGridPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const logos: LogoItem[] = data.props?.logos ?? [];

  const updateLogos = (newLogos: LogoItem[]) =>
    updateData({ ...data, props: { ...data.props, logos: newLogos } });

  const addLogo = () =>
    updateLogos([...logos, { src: '', alt: '', url: null }]);

  const removeLogo = (idx: number) =>
    updateLogos(logos.filter((_, i) => i !== idx));

  const updateLogo = (idx: number, patch: Partial<LogoItem>) => {
    const next = logos.map((l, i) => (i === idx ? { ...l, ...patch } : l));
    updateLogos(next);
  };

  return (
    <BaseSidebarPanel title="Logo Grid block">
      <SliderInput
        label="Columns"
        iconLabel={<ViewColumnOutlined sx={{ color: 'text.secondary' }} />}
        units=""
        step={1}
        min={2}
        max={6}
        defaultValue={data.props?.columns ?? LogoGridPropsDefaults.columns}
        onChange={(columns) => updateData({ ...data, props: { ...data.props, columns } })}
      />
      <SliderInput
        label="Gap"
        iconLabel={<RoundedCornerOutlined sx={{ color: 'text.secondary' }} />}
        units="px"
        step={4}
        min={0}
        max={64}
        defaultValue={data.props?.gap ?? LogoGridPropsDefaults.gap}
        onChange={(gap) => updateData({ ...data, props: { ...data.props, gap } })}
      />
      <SliderInput
        label="Logo height"
        iconLabel={<HeightOutlined sx={{ color: 'text.secondary' }} />}
        units="px"
        step={4}
        min={20}
        max={120}
        defaultValue={data.props?.logoHeight ?? LogoGridPropsDefaults.logoHeight}
        onChange={(logoHeight) => updateData({ ...data, props: { ...data.props, logoHeight } })}
      />
      <BooleanInput
        label="Grayscale"
        defaultValue={data.props?.grayscale ?? LogoGridPropsDefaults.grayscale}
        onChange={(grayscale) => updateData({ ...data, props: { ...data.props, grayscale } })}
      />

      <Divider />
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        Logos
      </Typography>
      <Stack spacing={1.5}>
        {logos.map((logo, idx) => (
          <Box key={idx} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="caption" color="text.secondary">Logo {idx + 1}</Typography>
              <Tooltip title="Remove">
                <IconButton size="small" onClick={() => removeLogo(idx)}>
                  <DeleteOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            <Stack spacing={0.5}>
              <TextField
                size="small"
                label="Image URL"
                value={logo.src}
                onChange={(e) => updateLogo(idx, { src: e.target.value })}
                fullWidth
                InputProps={{ sx: { fontSize: 12 } }}
              />
              <TextField
                size="small"
                label="Alt text"
                value={logo.alt ?? ''}
                onChange={(e) => updateLogo(idx, { alt: e.target.value || null })}
                fullWidth
                InputProps={{ sx: { fontSize: 12 } }}
              />
              <TextField
                size="small"
                label="Link URL (optional)"
                value={logo.url ?? ''}
                onChange={(e) => updateLogo(idx, { url: e.target.value || null })}
                fullWidth
                InputProps={{ sx: { fontSize: 12 } }}
              />
            </Stack>
          </Box>
        ))}
        <Button size="small" startIcon={<AddOutlined />} onClick={addLogo} variant="outlined" sx={{ textTransform: 'none' }}>
          Add logo
        </Button>
      </Stack>

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
