import React from 'react';

import { ColumnsContainer as BaseColumnsContainer } from '@usewaypoint/block-columns-container';

import { useCurrentBlockId } from '../../editor/EditorBlock';
import { deleteBlock, setDocument, setSelectedBlockId } from '../../editor/EditorContext';
import EditorChildrenIds, { EditorChildrenChange } from '../helpers/EditorChildrenIds';

import ColumnsContainerPropsSchema, { ColumnsContainerProps } from './ColumnsContainerPropsSchema';

const EMPTY_COLUMNS = [{ childrenIds: [] }, { childrenIds: [] }, { childrenIds: [] }];

export default function ColumnsContainerEditor({ style, props }: ColumnsContainerProps) {
  const currentBlockId = useCurrentBlockId();

  const { columns, ...restProps } = props ?? {};
  const columnsCount = props?.columnsCount ?? 2;
  const columnsValue = columns ?? EMPTY_COLUMNS.slice(0, columnsCount);

  const updateColumn = (columnIndex: number, { block, blockId, childrenIds }: EditorChildrenChange) => {
    const nColumns = [...columnsValue];
    nColumns[columnIndex] = { childrenIds };
    setDocument({
      [blockId]: block,
      [currentBlockId]: {
        type: 'ColumnsContainer',
        data: ColumnsContainerPropsSchema.parse({
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
        type: 'ColumnsContainer',
        data: ColumnsContainerPropsSchema.parse({
          style,
          props: { ...restProps, columns: nColumns },
        }),
      },
    });
  };

  const removeFromColumn = (colIdx: number, blockId: string, newChildrenIds: string[]) => {
    const nColumns = [...columnsValue];
    nColumns[colIdx] = { childrenIds: newChildrenIds };
    deleteBlock(blockId, {
      [currentBlockId]: {
        type: 'ColumnsContainer',
        data: ColumnsContainerPropsSchema.parse({ style, props: { ...restProps, columns: nColumns } }),
      },
    });
  };

  const colElements = Array.from({ length: columnsCount }, (_, i) => (
    <EditorChildrenIds
      key={i}
      childrenIds={columnsValue[i]?.childrenIds}
      onChange={(change) => updateColumn(i, change)}
      onReorder={(newIds) => reorderColumn(i, newIds)}
      onRemoveBlock={(blockId, newIds) => removeFromColumn(i, blockId, newIds)}
    />
  ));

  return <BaseColumnsContainer props={restProps} style={style} columns={colElements} />;
}
