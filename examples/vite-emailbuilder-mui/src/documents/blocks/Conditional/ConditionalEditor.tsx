import React from 'react';

import { ConditionalProps } from '@usewaypoint/email-builder';

import { useCurrentBlockId } from '../../editor/EditorBlock';
import { setDocument, setSelectedBlockId, useDocument } from '../../editor/EditorContext';
import EditorChildrenIds from '../helpers/EditorChildrenIds';

export default function ConditionalEditor({ props }: ConditionalProps) {
  const childrenIds = props?.childrenIds ?? [];

  const document = useDocument();
  const currentBlockId = useCurrentBlockId();

  return (
    <EditorChildrenIds
      childrenIds={childrenIds}
      onChange={({ block, blockId, childrenIds: newChildrenIds }) => {
        const currentData = document[currentBlockId].data as any;
        setDocument({
          [blockId]: block,
          [currentBlockId]: {
            type: 'Conditional',
            data: {
              props: {
                ...currentData.props,
                childrenIds: newChildrenIds,
              },
            },
          },
        } as any);
        setSelectedBlockId(blockId);
      }}
      onReorder={(newChildrenIds) => {
        const currentData = document[currentBlockId].data as any;
        setDocument({
          [currentBlockId]: {
            type: 'Conditional',
            data: {
              props: {
                ...currentData.props,
                childrenIds: newChildrenIds,
              },
            },
          },
        } as any);
      }}
    />
  );
}
