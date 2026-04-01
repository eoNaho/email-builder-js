import React from 'react';

import {
  BorderAllOutlined,
  SpaceBarOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignCenterOutlined,
  VerticalAlignTopOutlined,
} from '@mui/icons-material';
import { MenuItem, Select, Stack, ToggleButton, Typography } from '@mui/material';

import RowPropsSchema, { RowProps } from '../../../../documents/blocks/Row/RowPropsSchema';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import ColumnWidthsInput from './helpers/inputs/ColumnWidthsInput';
import { NullableColorInput } from './helpers/inputs/ColorInput';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import SliderInput from './helpers/inputs/SliderInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type Props = {
  data: RowProps;
  setData: (v: RowProps) => void;
};

export default function RowSidebarPanel({ data, setData }: Props) {
  const updateData = (d: unknown) => {
    const res = RowPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
    }
  };

  const columnsCount = data.props?.columnsCount ?? 1;
  const visibility = data.props?.visibility ?? 'all';
  const mobileStacking = data.props?.mobileStacking ?? 'stack';
  const borderStyle = data.style?.borderStyle ?? 'solid';

  return (
    <BaseSidebarPanel title="Row (Section)">
      {/* Column Layout */}
      <RadioGroupInput
        label="Column layout"
        defaultValue={String(columnsCount)}
        onChange={(v) => {
          const count = parseInt(v, 10) as 1 | 2 | 3 | 4;
          const existingCols = data.props?.columns ?? [];
          const emptyCol = { childrenIds: [] };
          const columns =
            count > existingCols.length
              ? [...existingCols, ...Array(count - existingCols.length).fill(emptyCol)]
              : existingCols.slice(0, count);
          updateData({ ...data, props: { ...data.props, columnsCount: count, columns } });
        }}
      >
        <ToggleButton value="1">1</ToggleButton>
        <ToggleButton value="2">2</ToggleButton>
        <ToggleButton value="3">3</ToggleButton>
        <ToggleButton value="4">4</ToggleButton>
      </RadioGroupInput>

      {columnsCount > 1 && (
        <>
          <ColumnWidthsInput
            defaultValue={
              data.props?.fixedWidths as
                | [number | null | undefined, number | null | undefined, number | null | undefined]
                | null
                | undefined
            }
            onChange={(fixedWidths) => updateData({ ...data, props: { ...data.props, fixedWidths } })}
          />
          <SliderInput
            label="Columns gap"
            iconLabel={<SpaceBarOutlined sx={{ color: 'text.secondary' }} />}
            units="px"
            step={4}
            marks
            min={0}
            max={80}
            defaultValue={data.props?.columnsGap ?? 0}
            onChange={(columnsGap) => updateData({ ...data, props: { ...data.props, columnsGap } })}
          />
          <RadioGroupInput
            label="Vertical alignment"
            defaultValue={data.props?.contentAlignment ?? 'top'}
            onChange={(contentAlignment) =>
              updateData({ ...data, props: { ...data.props, contentAlignment } })
            }
          >
            <ToggleButton value="top">
              <VerticalAlignTopOutlined fontSize="small" />
            </ToggleButton>
            <ToggleButton value="middle">
              <VerticalAlignCenterOutlined fontSize="small" />
            </ToggleButton>
            <ToggleButton value="bottom">
              <VerticalAlignBottomOutlined fontSize="small" />
            </ToggleButton>
          </RadioGroupInput>
        </>
      )}

      {/* Row max width */}
      <SliderInput
        label="Max width"
        iconLabel={<BorderAllOutlined sx={{ color: 'text.secondary' }} />}
        units="px"
        step={10}
        min={320}
        max={900}
        defaultValue={data.style?.maxWidth ?? 600}
        onChange={(maxWidth) => updateData({ ...data, style: { ...data.style, maxWidth } })}
      />

      {/* Background */}
      <NullableColorInput
        label="Background color"
        defaultValue={data.style?.backgroundColor ?? null}
        onChange={(backgroundColor) => updateData({ ...data, style: { ...data.style, backgroundColor } })}
      />
      <NullableColorInput
        label="Full-width background"
        defaultValue={data.style?.fullWidthBackground ?? null}
        onChange={(fullWidthBackground) =>
          updateData({ ...data, style: { ...data.style, fullWidthBackground } })
        }
      />
      <TextInput
        label="Background image URL"
        defaultValue={data.style?.backgroundImage ?? ''}
        onChange={(backgroundImage) =>
          updateData({ ...data, style: { ...data.style, backgroundImage: backgroundImage || null } })
        }
      />

      {/* Border */}
      <MultiStylePropertyPanel
        names={['borderRadius', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
      <SliderInput
        label="Border width"
        iconLabel={<BorderAllOutlined sx={{ color: 'text.secondary' }} />}
        units="px"
        step={1}
        min={0}
        max={8}
        defaultValue={data.style?.borderWidth ?? 0}
        onChange={(borderWidth) => updateData({ ...data, style: { ...data.style, borderWidth } })}
      />
      {(data.style?.borderWidth ?? 0) > 0 && (
        <>
          <NullableColorInput
            label="Border color"
            defaultValue={data.style?.borderColor ?? null}
            onChange={(borderColor) => updateData({ ...data, style: { ...data.style, borderColor } })}
          />
          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary">
              Border style
            </Typography>
            <Select
              size="small"
              value={borderStyle}
              onChange={(e) =>
                updateData({
                  ...data,
                  style: { ...data.style, borderStyle: e.target.value as 'solid' | 'dashed' | 'dotted' },
                })
              }
            >
              <MenuItem value="solid">Solid</MenuItem>
              <MenuItem value="dashed">Dashed</MenuItem>
              <MenuItem value="dotted">Dotted</MenuItem>
            </Select>
          </Stack>
        </>
      )}

      {/* Visibility */}
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          Visibility
        </Typography>
        <Select
          size="small"
          value={visibility}
          onChange={(e) =>
            updateData({
              ...data,
              props: {
                ...data.props,
                visibility: e.target.value as 'all' | 'desktop-only' | 'mobile-only',
              },
            })
          }
        >
          <MenuItem value="all">All devices</MenuItem>
          <MenuItem value="desktop-only">Desktop only</MenuItem>
          <MenuItem value="mobile-only">Mobile only</MenuItem>
        </Select>
      </Stack>

      {/* Mobile stacking */}
      {columnsCount > 1 && (
        <>
          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary">
              Mobile: column stacking
            </Typography>
            <Select
              size="small"
              value={mobileStacking}
              onChange={(e) =>
                updateData({
                  ...data,
                  props: {
                    ...data.props,
                    mobileStacking: e.target.value as 'stack' | 'side-by-side',
                  },
                })
              }
            >
              <MenuItem value="stack">Stack vertically</MenuItem>
              <MenuItem value="side-by-side">Keep side by side</MenuItem>
            </Select>
          </Stack>
          {mobileStacking === 'stack' && (
            <RadioGroupInput
              label="Stack order"
              defaultValue={data.props?.mobileStackOrder ?? 'normal'}
              onChange={(mobileStackOrder) =>
                updateData({ ...data, props: { ...data.props, mobileStackOrder } })
              }
            >
              <ToggleButton value="normal">Normal</ToggleButton>
              <ToggleButton value="reverse">Reverse</ToggleButton>
            </RadioGroupInput>
          )}
        </>
      )}
    </BaseSidebarPanel>
  );
}
