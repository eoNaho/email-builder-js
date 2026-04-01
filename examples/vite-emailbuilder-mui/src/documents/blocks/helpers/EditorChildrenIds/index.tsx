import React, { Fragment, useRef, useState } from 'react';

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { ContentCopyOutlined, DeleteOutlined, DragIndicatorOutlined } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';

import { TEditorBlock, TEditorConfiguration } from '../../../editor/core';
import EditorBlock from '../../../editor/EditorBlock';
import { setDocument, setSelectedBlockId, useDocument, useSelectedBlockId } from '../../../editor/EditorContext';

import AddBlockButton from './AddBlockMenu';

export type EditorChildrenChange = {
  blockId: string;
  block: TEditorBlock;
  childrenIds: string[];
};

let _idCounter = 0;
function generateId() {
  return `block-${Date.now()}-${++_idCounter}`;
}

// ── Deep-copy a block and all its descendants with fresh IDs ─────────────────
function deepCopyWithNewIds(doc: TEditorConfiguration, blockId: string): { rootBlock: TEditorBlock; extras: TEditorConfiguration } {
  const extras: TEditorConfiguration = {};

  const copyBlock = (id: string): TEditorBlock => {
    const block = doc[id];
    if (!block) return { type: 'Spacer', data: {} } as TEditorBlock;

    const remapData = (value: unknown): unknown => {
      if (!value || typeof value !== 'object') return value;
      if (Array.isArray(value)) return value.map(remapData);
      const obj = value as Record<string, unknown>;
      const result: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(obj)) {
        if (k === 'childrenIds' && Array.isArray(v)) {
          result[k] = (v as string[]).map((childId) => {
            const newChildId = generateId();
            extras[newChildId] = copyBlock(childId);
            return newChildId;
          });
        } else {
          result[k] = remapData(v);
        }
      }
      return result;
    };

    return { type: block.type, data: remapData(block.data) } as TEditorBlock;
  };

  return { rootBlock: copyBlock(blockId), extras };
}

// ── Floating block toolbar ───────────────────────────────────────────────────
type BlockToolbarProps = {
  dragRef: (el: HTMLElement | null) => void;
  dragAttributes: React.HTMLAttributes<HTMLElement>;
  dragListeners: SyntheticListenerMap | undefined;
  onDuplicate: () => void;
  onDelete: () => void;
};

function BlockToolbar({ dragRef, dragAttributes, dragListeners, onDuplicate, onDelete }: BlockToolbarProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 4,
        right: 4,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'primary.main',
        borderRadius: 0.75,
        overflow: 'hidden',
        boxShadow: 2,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Drag handle */}
      <Tooltip title="Drag to reorder" placement="top">
        <Box
          ref={dragRef}
          {...(dragAttributes as object)}
          {...(dragListeners as object)}
          sx={{
            px: 0.75,
            py: 0.5,
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          <DragIndicatorOutlined sx={{ fontSize: 14 }} />
        </Box>
      </Tooltip>

      {/* Duplicate */}
      <Tooltip title="Duplicate" placement="top">
        <Box
          component="button"
          onClick={onDuplicate}
          sx={{
            px: 0.75,
            py: 0.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            border: 'none',
            bgcolor: 'transparent',
            borderLeft: '1px solid rgba(255,255,255,0.2)',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          <ContentCopyOutlined sx={{ fontSize: 13 }} />
        </Box>
      </Tooltip>

      {/* Delete */}
      <Tooltip title="Delete" placement="top">
        <Box
          component="button"
          onClick={onDelete}
          sx={{
            px: 0.75,
            py: 0.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            border: 'none',
            bgcolor: 'transparent',
            borderLeft: '1px solid rgba(255,255,255,0.2)',
            '&:hover': { bgcolor: 'error.main' },
          }}
        >
          <DeleteOutlined sx={{ fontSize: 13 }} />
        </Box>
      </Tooltip>
    </Box>
  );
}

// ── Sortable block with toolbar ──────────────────────────────────────────────
type SortableBlockProps = {
  id: string;
  onDuplicate: () => void;
  onDelete: () => void;
};

function SortableBlock({ id, onDuplicate, onDelete }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  const [hovered, setHovered] = useState(false);
  const selectedBlockId = useSelectedBlockId();
  const showToolbar = hovered || selectedBlockId === id;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        position: 'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {showToolbar && (
        <BlockToolbar
          dragRef={setActivatorNodeRef}
          dragAttributes={attributes}
          dragListeners={listeners}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      )}
      <EditorBlock id={id} />
    </div>
  );
}

// ── EditorChildrenIds ────────────────────────────────────────────────────────
export type EditorChildrenIdsProps = {
  childrenIds: string[] | null | undefined;
  onChange: (val: EditorChildrenChange) => void;
  onReorder?: (newChildrenIds: string[]) => void;
  onRemoveBlock?: (blockId: string, newChildrenIds: string[]) => void;
  mode?: 'rows-only' | 'content-only' | 'all';
};

export default function EditorChildrenIds({ childrenIds, onChange, onReorder, onRemoveBlock, mode = 'content-only' }: EditorChildrenIdsProps) {
  const document = useDocument();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ── HTML5 drop zone ─────────────────────────────────────────────────────
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes('application/email-block')) return;
    dragCounter.current++;
    setIsDragOver(true);
  };
  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current <= 0) { dragCounter.current = 0; setIsDragOver(false); }
  };
  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/email-block')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragOver(false);
    const blockJson = e.dataTransfer.getData('application/email-block');
    if (!blockJson) return;
    try { appendBlock(JSON.parse(blockJson) as TEditorBlock); } catch { /* invalid */ }
  };
  // ────────────────────────────────────────────────────────────────────────

  const appendBlock = (block: TEditorBlock) => {
    const blockId = generateId();
    onChange({ blockId, block, childrenIds: [...(childrenIds || []), blockId] });
  };

  const insertBlock = (block: TEditorBlock, index: number) => {
    const blockId = generateId();
    const newChildrenIds = [...(childrenIds || [])];
    newChildrenIds.splice(index, 0, blockId);
    onChange({ blockId, block, childrenIds: newChildrenIds });
  };

  const duplicateBlock = (blockId: string, index: number) => {
    const { rootBlock, extras } = deepCopyWithNewIds(document, blockId);
    const newBlockId = generateId();
    const newChildrenIds = [...(childrenIds || [])];
    newChildrenIds.splice(index + 1, 0, newBlockId);
    onChange({ blockId: newBlockId, block: rootBlock, childrenIds: newChildrenIds });
    if (Object.keys(extras).length > 0) setDocument(extras);
    setSelectedBlockId(newBlockId);
  };

  const handleDeleteBlock = (blockId: string) => {
    const newChildrenIds = (childrenIds || []).filter((id) => id !== blockId);
    if (onRemoveBlock) onRemoveBlock(blockId, newChildrenIds);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !childrenIds || !onReorder) return;
    const oldIndex = childrenIds.indexOf(active.id as string);
    const newIndex = childrenIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(childrenIds, oldIndex, newIndex));
  };

  const dropZoneStyle: React.CSSProperties = isDragOver
    ? { outline: '2px dashed rgba(0,121,204,0.7)', outlineOffset: -2, borderRadius: 4, backgroundColor: 'rgba(0,121,204,0.04)' }
    : {};

  if (!childrenIds || childrenIds.length === 0) {
    return (
      <div
        style={{ ...dropZoneStyle, minHeight: 48 }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <AddBlockButton placeholder onSelect={appendBlock} mode={mode} />
      </div>
    );
  }

  return (
    <div
      style={dropZoneStyle}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={childrenIds} strategy={verticalListSortingStrategy}>
          {childrenIds.map((childId, i) => (
            <Fragment key={childId}>
              <AddBlockButton onSelect={(block) => insertBlock(block, i)} mode={mode} />
              <SortableBlock
                id={childId}
                onDuplicate={() => duplicateBlock(childId, i)}
                onDelete={() => handleDeleteBlock(childId)}
              />
            </Fragment>
          ))}
          <AddBlockButton onSelect={appendBlock} mode={mode} />
        </SortableContext>
      </DndContext>
    </div>
  );
}
