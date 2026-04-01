import React from 'react';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useBrandKit } from '../../documents/editor/BrandKitContext';
import { NullableColorInput } from './ConfigurationPanel/input-panels/helpers/inputs/ColorInput';
import { NullableFontFamily } from './ConfigurationPanel/input-panels/helpers/inputs/FontFamily';

export default function BrandKitPanel() {
  const { brandKit, setBrandKit } = useBrandKit();

  const colors = brandKit.colors ?? {};
  const fonts = brandKit.fonts ?? {};

  return (
    <Stack spacing={0} divider={<Divider />}>
      <Box px={2} py={1.5}>
        <Typography variant="overline" color="text.secondary">
          Brand Colors
        </Typography>
        <Stack spacing={1.5} mt={1}>
          <NullableColorInput
            label="Primary"
            defaultValue={colors.primary ?? null}
            onChange={(v) => setBrandKit({ ...brandKit, colors: { ...colors, primary: v } })}
          />
          <NullableColorInput
            label="Secondary"
            defaultValue={colors.secondary ?? null}
            onChange={(v) => setBrandKit({ ...brandKit, colors: { ...colors, secondary: v } })}
          />
          <NullableColorInput
            label="Accent"
            defaultValue={colors.accent ?? null}
            onChange={(v) => setBrandKit({ ...brandKit, colors: { ...colors, accent: v } })}
          />
        </Stack>
      </Box>

      <Box px={2} py={1.5}>
        <Typography variant="overline" color="text.secondary">
          Typography
        </Typography>
        <Stack spacing={1.5} mt={1}>
          <NullableFontFamily
            label="Heading font"
            defaultValue={fonts.heading ?? null}
            onChange={(heading) => setBrandKit({ ...brandKit, fonts: { ...fonts, heading: heading as typeof fonts.heading } })}
          />
          <NullableFontFamily
            label="Body font"
            defaultValue={fonts.body ?? null}
            onChange={(body) => setBrandKit({ ...brandKit, fonts: { ...fonts, body: body as typeof fonts.body } })}
          />
        </Stack>
      </Box>
    </Stack>
  );
}
