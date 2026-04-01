import React, { useState } from 'react';

import { PhoneIphoneOutlined } from '@mui/icons-material';
import { Box, Collapse, Divider, Stack, Typography } from '@mui/material';

import { MobileOverrides } from '@usewaypoint/document-core';

import PaddingInput from './PaddingInput';
import TextAlignInput from './TextAlignInput';
import FontSizeInput from './FontSizeInput';

type MobileOverridesInputProps = {
  defaultValue: MobileOverrides;
  onChange: (v: MobileOverrides) => void;
  /** Which overrides to show. Default: all */
  fields?: ('padding' | 'fontSize' | 'textAlign')[];
};

export default function MobileOverridesInput({
  defaultValue,
  onChange,
  fields = ['padding', 'fontSize', 'textAlign'],
}: MobileOverridesInputProps) {
  const [open, setOpen] = useState(false);
  const hasOverrides =
    defaultValue?.padding != null || defaultValue?.fontSize != null || defaultValue?.textAlign != null;

  return (
    <Box>
      <Divider sx={{ mb: 1 }} />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ cursor: 'pointer', py: 0.5 }}
        onClick={() => setOpen((o) => !o)}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <PhoneIphoneOutlined fontSize="small" sx={{ color: hasOverrides ? 'primary.main' : 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: hasOverrides ? 'primary.main' : 'text.secondary', fontWeight: hasOverrides ? 600 : 400 }}>
            Mobile overrides {hasOverrides ? '(active)' : ''}
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.disabled">
          {open ? '▲' : '▼'}
        </Typography>
      </Stack>
      <Collapse in={open}>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {fields.includes('padding') && (
            <PaddingInput
              label="Mobile padding"
              defaultValue={defaultValue?.padding ?? null}
              onChange={(padding) => onChange({ ...defaultValue, padding })}
            />
          )}
          {fields.includes('fontSize') && (
            <FontSizeInput
              label="Mobile font size"
              defaultValue={defaultValue?.fontSize ?? 16}
              onChange={(fontSize) => onChange({ ...defaultValue, fontSize })}
            />
          )}
          {fields.includes('textAlign') && (
            <TextAlignInput
              label="Mobile text align"
              defaultValue={defaultValue?.textAlign ?? null}
              onChange={(textAlign) => onChange({ ...defaultValue, textAlign: textAlign as 'left' | 'center' | 'right' | null })}
            />
          )}
        </Stack>
      </Collapse>
    </Box>
  );
}
