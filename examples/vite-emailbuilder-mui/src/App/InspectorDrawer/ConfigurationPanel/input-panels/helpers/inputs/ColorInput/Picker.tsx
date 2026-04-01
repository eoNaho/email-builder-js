import React, { useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';

import { Box, Divider, Stack, SxProps, Typography } from '@mui/material';

import { useBrandKit } from '../../../../../../../documents/editor/BrandKitContext';
import Swatch from './Swatch';

const DEFAULT_PRESET_COLORS = [
  '#E11D48',
  '#DB2777',
  '#C026D3',
  '#9333EA',
  '#7C3AED',
  '#4F46E5',
  '#2563EB',
  '#0284C7',
  '#0891B2',
  '#0D9488',
  '#059669',
  '#16A34A',
  '#65A30D',
  '#CA8A04',
  '#D97706',
  '#EA580C',
  '#DC2626',
  '#FFFFFF',
  '#FAFAFA',
  '#F5F5F5',
  '#E5E5E5',
  '#D4D4D4',
  '#A3A3A3',
  '#737373',
  '#525252',
  '#404040',
  '#262626',
  '#171717',
  '#0A0A0A',
  '#000000',
];

const SX: SxProps = {
  p: 1,
  '.react-colorful__pointer ': {
    width: 16,
    height: 16,
  },
  '.react-colorful__saturation': {
    mb: 1,
    borderRadius: '4px',
  },
  '.react-colorful__last-control': {
    borderRadius: '4px',
  },
  '.react-colorful__hue-pointer': {
    width: '4px',
    borderRadius: '4px',
    height: 24,
    cursor: 'col-resize',
  },
  '.react-colorful__saturation-pointer': {
    cursor: 'all-scroll',
  },
  input: {
    padding: 1,
    border: '1px solid',
    borderColor: 'grey.300',
    borderRadius: '4px',
    width: '100%',
  },
};

type Props = {
  value: string;
  onChange: (v: string) => void;
};
export default function Picker({ value, onChange }: Props) {
  const [internalValue, setInternalValue] = useState(value);
  const { brandKit } = useBrandKit();
  const handleChange = (v: string) => {
    setInternalValue(v);
    // Accept hex6 (#RRGGBB) or hex8 (#RRGGBBAA)
    if (/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(v)) {
      onChange(v);
    }
  };

  const brandColors = [
    brandKit.colors?.primary,
    brandKit.colors?.secondary,
    brandKit.colors?.accent,
    ...(brandKit.colors?.neutral ?? []),
  ].filter((c): c is string => typeof c === 'string' && c.length > 0);

  return (
    <Stack spacing={1} sx={SX}>
      <HexColorPicker color={value} onChange={handleChange} />
      {brandColors.length > 0 && (
        <>
          <Typography variant="caption" color="text.secondary">Brand colors</Typography>
          <Swatch paletteColors={brandColors} value={value} onChange={handleChange} />
          <Divider />
        </>
      )}
      <Swatch paletteColors={DEFAULT_PRESET_COLORS} value={value} onChange={handleChange} />
      <Box pt={1}>
        <HexColorInput prefixed color={internalValue} onChange={handleChange} />
      </Box>
    </Stack>
  );
}
