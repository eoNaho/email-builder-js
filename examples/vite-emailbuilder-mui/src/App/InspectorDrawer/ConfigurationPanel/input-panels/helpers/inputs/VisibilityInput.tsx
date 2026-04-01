import React from 'react';

import { MenuItem, Select, Stack, Typography } from '@mui/material';

type Props = {
  label?: string;
  defaultValue: 'all' | 'desktop-only' | 'mobile-only' | null | undefined;
  onChange: (v: 'all' | 'desktop-only' | 'mobile-only') => void;
};

export default function VisibilityInput({ label = 'Visibility', defaultValue, onChange }: Props) {
  return (
    <Stack spacing={1}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Select
        size="small"
        value={defaultValue ?? 'all'}
        onChange={(e) => onChange(e.target.value as 'all' | 'desktop-only' | 'mobile-only')}
      >
        <MenuItem value="all">All devices</MenuItem>
        <MenuItem value="desktop-only">Desktop only</MenuItem>
        <MenuItem value="mobile-only">Mobile only</MenuItem>
      </Select>
    </Stack>
  );
}
