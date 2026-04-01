import React, { CSSProperties } from 'react';
import { z } from 'zod';

const COLOR_SCHEMA = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/)
  .nullable()
  .optional();

const PADDING_SCHEMA = z
  .object({
    top: z.number(),
    bottom: z.number(),
    right: z.number(),
    left: z.number(),
  })
  .optional()
  .nullable();

// Array instead of tuple for backwards-compatibility and 4-column support
const FIXED_WIDTHS_SCHEMA = z.array(z.number().nullish()).optional().nullable();

const getPadding = (padding: z.infer<typeof PADDING_SCHEMA>) =>
  padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined;

export const ColumnsContainerPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      fixedWidths: FIXED_WIDTHS_SCHEMA,
      columnsCount: z
        .union([z.literal(2), z.literal(3), z.literal(4)])
        .optional()
        .nullable(),
      columnsGap: z.number().optional().nullable(),
      contentAlignment: z.enum(['top', 'middle', 'bottom']).optional().nullable(),
    })
    .optional()
    .nullable(),
});

type TColumn = JSX.Element | JSX.Element[] | null;
export type ColumnsContainerProps = z.infer<typeof ColumnsContainerPropsSchema> & {
  columns?: TColumn[];
};

const ColumnsContainerPropsDefaults = {
  columnsCount: 2,
  columnsGap: 0,
  contentAlignment: 'middle',
} as const;

export function ColumnsContainer({ style, columns, props }: ColumnsContainerProps) {
  const wStyle: CSSProperties = {
    backgroundColor: style?.backgroundColor ?? undefined,
    padding: getPadding(style?.padding),
  };

  const blockProps = {
    columnsCount: props?.columnsCount ?? ColumnsContainerPropsDefaults.columnsCount,
    columnsGap: props?.columnsGap ?? ColumnsContainerPropsDefaults.columnsGap,
    contentAlignment: props?.contentAlignment ?? ColumnsContainerPropsDefaults.contentAlignment,
    fixedWidths: props?.fixedWidths,
  };

  return (
    <div style={wStyle}>
      <table
        align="center"
        width="100%"
        cellPadding="0"
        border={0}
        style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}
      >
        <tbody style={{ width: '100%' }}>
          <tr style={{ width: '100%' }}>
            <TableCell index={0} props={blockProps} columns={columns} />
            <TableCell index={1} props={blockProps} columns={columns} />
            <TableCell index={2} props={blockProps} columns={columns} />
            <TableCell index={3} props={blockProps} columns={columns} />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

type Props = {
  props: {
    fixedWidths: z.infer<typeof FIXED_WIDTHS_SCHEMA>;
    columnsCount: 2 | 3 | 4;
    columnsGap: number;
    contentAlignment: 'top' | 'middle' | 'bottom';
  };
  index: number;
  columns?: TColumn[];
};
function TableCell({ index, props, columns }: Props) {
  const contentAlignment = props?.contentAlignment ?? ColumnsContainerPropsDefaults.contentAlignment;
  const columnsCount = props?.columnsCount ?? ColumnsContainerPropsDefaults.columnsCount;

  if (index >= columnsCount) {
    return null;
  }

  const style: CSSProperties = {
    boxSizing: 'content-box',
    verticalAlign: contentAlignment,
    paddingLeft: getPaddingBefore(index, props),
    paddingRight: getPaddingAfter(index, props),
    width: props.fixedWidths?.[index] ?? undefined,
  };
  const children = (columns && columns[index]) ?? null;
  return <td style={style}>{children}</td>;
}

function getPaddingBefore(index: number, { columnsGap, columnsCount }: Props['props']) {
  if (index === 0) return 0;
  // Equal split: gap / columnsCount per side
  return columnsGap / columnsCount;
}

function getPaddingAfter(index: number, { columnsGap, columnsCount }: Props['props']) {
  if (index === columnsCount - 1) return 0;
  return columnsGap / columnsCount;
}
