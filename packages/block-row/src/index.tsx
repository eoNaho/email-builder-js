import React, { CSSProperties } from 'react';
import { z } from 'zod';

import { COLOR_SCHEMA, PADDING_SCHEMA, getPadding } from '@usewaypoint/document-core';

const FIXED_WIDTHS_SCHEMA = z.array(z.number().nullish()).optional().nullable();

export const RowColumnSchema = z.object({
  childrenIds: z.array(z.string()),
  padding: PADDING_SCHEMA,
  verticalAlign: z.enum(['top', 'middle', 'bottom']).optional().nullable(),
});

export const RowPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      backgroundImage: z.string().optional().nullable(),
      padding: PADDING_SCHEMA,
      borderWidth: z.number().optional().nullable(),
      borderColor: COLOR_SCHEMA,
      borderStyle: z.enum(['solid', 'dashed', 'dotted']).optional().nullable(),
      borderRadius: z.number().optional().nullable(),
      maxWidth: z.number().optional().nullable(),
      fullWidthBackground: COLOR_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      columnsCount: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional().nullable(),
      columnsGap: z.number().optional().nullable(),
      contentAlignment: z.enum(['top', 'middle', 'bottom']).optional().nullable(),
      fixedWidths: FIXED_WIDTHS_SCHEMA,
      columns: z.array(RowColumnSchema).min(1).max(4).optional().nullable(),
      mobileStacking: z.enum(['stack', 'side-by-side']).optional().nullable(),
      mobileStackOrder: z.enum(['normal', 'reverse']).optional().nullable(),
      visibility: z.enum(['all', 'desktop-only', 'mobile-only']).optional().nullable(),
      syncedRowId: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type RowColumn = z.infer<typeof RowColumnSchema>;
export type RowProps = z.infer<typeof RowPropsSchema>;

export const RowPropsDefaults = {
  columnsCount: 1,
  columnsGap: 0,
  contentAlignment: 'top',
  maxWidth: 600,
  mobileStacking: 'stack',
  mobileStackOrder: 'normal',
  visibility: 'all',
} as const;

type TColumn = JSX.Element | JSX.Element[] | null;

type RowComponentProps = RowProps & {
  columns?: TColumn[];
};

function getPaddingBefore(index: number, columnsCount: number, columnsGap: number): number | undefined {
  if (index === 0) return undefined;
  return columnsGap / columnsCount;
}

function getPaddingAfter(index: number, columnsCount: number, columnsGap: number): number | undefined {
  if (index === columnsCount - 1) return undefined;
  return columnsGap / columnsCount;
}

export function Row({ style, props, columns }: RowComponentProps) {
  const columnsCount = props?.columnsCount ?? RowPropsDefaults.columnsCount;
  const columnsGap = props?.columnsGap ?? RowPropsDefaults.columnsGap;
  const contentAlignment = props?.contentAlignment ?? RowPropsDefaults.contentAlignment;
  const maxWidth = style?.maxWidth ?? RowPropsDefaults.maxWidth;
  const visibility = props?.visibility ?? RowPropsDefaults.visibility;
  const fixedWidths = props?.fixedWidths;

  const outerStyle: CSSProperties = {
    backgroundColor: style?.fullWidthBackground ?? style?.backgroundColor ?? undefined,
    backgroundImage: style?.backgroundImage ? `url(${style.backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const innerStyle: CSSProperties = {
    margin: '0 auto',
    maxWidth,
    backgroundColor: style?.backgroundColor ?? undefined,
    padding: getPadding(style?.padding),
    borderWidth: style?.borderWidth ?? undefined,
    borderColor: style?.borderColor ?? undefined,
    borderStyle: style?.borderStyle ?? undefined,
    borderRadius: style?.borderRadius ?? undefined,
  };

  let visibilityClass: string | undefined;
  if (visibility === 'desktop-only') {
    visibilityClass = 'eb-desktop-only';
  } else if (visibility === 'mobile-only') {
    visibilityClass = 'eb-mobile-only';
  }

  const content = (
    <div style={outerStyle} className={visibilityClass}>
      <table
        align="center"
        width="100%"
        cellPadding="0"
        border={0}
        style={{ tableLayout: 'fixed', borderCollapse: 'collapse', ...innerStyle }}
        role="presentation"
      >
        <tbody>
          <tr style={{ width: '100%' }}>
            {Array.from({ length: columnsCount }, (_, i) => {
              if (!columns || i >= columns.length) return null;
              const colData = props?.columns?.[i];
              const tdStyle: CSSProperties = {
                boxSizing: 'content-box',
                verticalAlign: colData?.verticalAlign ?? contentAlignment,
                paddingLeft: getPaddingBefore(i, columnsCount, columnsGap),
                paddingRight: getPaddingAfter(i, columnsCount, columnsGap),
                padding: colData?.padding ? getPadding(colData.padding) : undefined,
                width: fixedWidths?.[i] ?? undefined,
              };
              return (
                <td key={i} style={tdStyle} className="eb-col">
                  {columns[i]}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );

  return content;
}
