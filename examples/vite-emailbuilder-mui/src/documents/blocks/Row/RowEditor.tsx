import React, { CSSProperties } from 'react';

import { Row as BaseRow } from '@usewaypoint/block-row';

import { useCurrentBlockId } from '../../editor/EditorBlock';
import { deleteBlock, setDocument, setSelectedBlockId } from '../../editor/EditorContext';
import EditorChildrenIds, { EditorChildrenChange } from '../helpers/EditorChildrenIds';

import RowPropsSchema, { RowProps } from './RowPropsSchema';

const EMPTY_COLUMN = { childrenIds: [] };

export default function RowEditor({ style, props }: RowProps) {
  const currentBlockId = useCurrentBlockId();

  const columnsCount = props?.columnsCount ?? 1;
  const existingCols = props?.columns ?? [];
  const columnsValue =
    existingCols.length >= columnsCount
      ? existingCols.slice(0, columnsCount)
      : [...existingCols, ...Array(columnsCount - existingCols.length).fill(EMPTY_COLUMN)];

  const { columns: _cols, ...restProps } = props ?? {};

  const updateColumn = (columnIndex: number, { block, blockId, childrenIds }: EditorChildrenChange) => {
    const nColumns = [...columnsValue];
    nColumns[columnIndex] = { childrenIds };
    setDocument({
      [blockId]: block,
      [currentBlockId]: {
        type: 'Row',
        data: RowPropsSchema.parse({
          style,
          props: { ...restProps, columns: nColumns },
        }),
      },
    });
    setSelectedBlockId(blockId);
  };

  const reorderColumn = (columnIndex: number, newChildrenIds: string[]) => {
    const nColumns = [...columnsValue];
    nColumns[columnIndex] = { childrenIds: newChildrenIds };
    setDocument({
      [currentBlockId]: {
        type: 'Row',
        data: RowPropsSchema.parse({
          style,
          props: { ...restProps, columns: nColumns },
        }),
      },
    });
  };

  const removeFromColumn = (columnIndex: number, blockId: string, newChildrenIds: string[]) => {
    const nColumns = [...columnsValue];
    nColumns[columnIndex] = { childrenIds: newChildrenIds };
    deleteBlock(blockId, {
      [currentBlockId]: {
        type: 'Row',
        data: RowPropsSchema.parse({ style, props: { ...restProps, columns: nColumns } }),
      },
    });
  };

  const colElements: (JSX.Element | JSX.Element[] | null)[] = Array.from({ length: columnsCount }, (_, i) => (
    <EditorChildrenIds
      key={i}
      childrenIds={columnsValue[i]?.childrenIds}
      onChange={(change) => updateColumn(i, change)}
      onReorder={(newIds) => reorderColumn(i, newIds)}
      onRemoveBlock={(blockId, newChildrenIds) => removeFromColumn(i, blockId, newChildrenIds)}
    />
  ));

  // Row wrapper style for the editor — no outer padding applied so background shows
  const outerEditorStyle: CSSProperties = {
    backgroundColor: style?.backgroundColor ?? undefined,
    backgroundImage: style?.backgroundImage ? `url(${style.backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderWidth: style?.borderWidth ?? undefined,
    borderColor: style?.borderColor ?? undefined,
    borderStyle: style?.borderStyle ?? undefined,
    borderRadius: style?.borderRadius ?? undefined,
    padding: style?.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
  };

  return (
    <div style={outerEditorStyle}>
      <BaseRow style={style} props={{ ...restProps, columns: columnsValue }} columns={colElements} />
    </div>
  );
}
