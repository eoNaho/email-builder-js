import { TReaderDocument } from '../Reader/core';

/**
 * Migrates an old-format document (where EmailLayout.childrenIds contains blocks directly)
 * to the new Row-based format (EmailLayout -> Rows -> columns -> blocks).
 *
 * Each non-Row direct child of EmailLayout is wrapped in a new single-column Row block.
 *
 * @param document - The document to migrate
 * @returns A new document in Row format (original is not mutated)
 */
export function migrateDocumentToRows(document: TReaderDocument): TReaderDocument {
  const result: TReaderDocument = { ...document };

  // Find the EmailLayout block
  const emailLayoutEntry = Object.entries(result).find(([, block]) => block.type === 'EmailLayout');
  if (!emailLayoutEntry) {
    return result;
  }

  const [layoutId, layoutBlock] = emailLayoutEntry;
  const childrenIds: string[] = (layoutBlock.data as { childrenIds?: string[] }).childrenIds ?? [];

  // Check if migration is needed (any non-Row child)
  const hasNonRowChildren = childrenIds.some((id) => result[id]?.type !== 'Row');
  if (!hasNonRowChildren) {
    return result;
  }

  const newChildrenIds: string[] = [];

  for (const childId of childrenIds) {
    const child = result[childId];
    if (!child) continue;

    if (child.type === 'Row') {
      // Already a Row, keep as-is
      newChildrenIds.push(childId);
    } else {
      // Wrap in a single-column Row
      const rowId = `row-migrated-${childId}`;
      result[rowId] = {
        type: 'Row',
        data: {
          props: {
            columnsCount: 1,
            columns: [{ childrenIds: [childId] }],
          },
        },
      } as TReaderDocument[string];
      newChildrenIds.push(rowId);
    }
  }

  // Update EmailLayout with new childrenIds
  result[layoutId] = {
    ...layoutBlock,
    data: {
      ...(layoutBlock.data as object),
      childrenIds: newChildrenIds,
    },
  } as TReaderDocument[string];

  return result;
}
