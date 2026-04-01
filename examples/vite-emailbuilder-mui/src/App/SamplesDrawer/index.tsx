import React, { useCallback, useEffect, useState } from 'react';

import { BookmarkAddOutlined, DeleteOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { SavedRow } from '@usewaypoint/document-core';

import { TEditorBlock, TEditorConfiguration } from '../../documents/editor/core';
import { useCallbacks } from '../../documents/editor/CallbacksContext';
import {
  setDocument,
  setSelectedBlockId,
  useDocument,
  useSamplesDrawerOpen,
  useSelectedBlockId,
} from '../../documents/editor/EditorContext';

type ColumnContext = {
  containerId: string;
  containerBlock: TEditorBlock;
  colIndex: number;
};

/** Finds which Row or ColumnsContainer column contains the selected block.
 *  Returns the container id, block, and column index, or null if not applicable. */
function findColumnContext(document: TEditorConfiguration, selectedBlockId: string | null): ColumnContext | null {
  if (!selectedBlockId) return null;

  // If the selected block itself is a Row or ColumnsContainer → use first column
  const sel = document[selectedBlockId];
  if (sel?.type === 'Row' || sel?.type === 'ColumnsContainer') {
    return { containerId: selectedBlockId, containerBlock: sel, colIndex: 0 };
  }

  // Search for which Row/ColumnsContainer contains the selected block
  for (const [id, block] of Object.entries(document)) {
    if (block.type !== 'Row' && block.type !== 'ColumnsContainer') continue;
    const cols =
      (((block.data as Record<string, unknown>).props as Record<string, unknown>)?.columns as {
        childrenIds: string[];
      }[]) ?? [];
    for (let i = 0; i < cols.length; i++) {
      if (cols[i].childrenIds.includes(selectedBlockId)) {
        return { containerId: id, containerBlock: block, colIndex: i };
      }
    }
  }

  return null;
}
import BlockButton from '../../documents/blocks/helpers/EditorChildrenIds/AddBlockMenu/BlockButton';
import { CONTENT_BUTTONS, ROW_BUTTONS } from '../../documents/blocks/helpers/EditorChildrenIds/AddBlockMenu/buttons';

import SidebarButton from './SidebarButton';
import logo from './waypoint.svg';

export const SAMPLES_DRAWER_WIDTH = 260;

let _idCounter = 0;
function generateId() {
  return `block-${Date.now()}-${++_idCounter}`;
}

/** Adds a block directly to the EmailLayout root (for Rows) */
function useAddToLayout() {
  const document = useDocument();
  return (block: TEditorBlock) => {
    const emailLayoutEntry = Object.entries(document).find(([, b]) => b.type === 'EmailLayout');
    if (!emailLayoutEntry) return;
    const [layoutId, layoutBlock] = emailLayoutEntry;
    const newBlockId = generateId();
    const currentChildrenIds: string[] = (layoutBlock.data as { childrenIds?: string[] }).childrenIds ?? [];
    setDocument({
      [newBlockId]: block,
      [layoutId]: {
        type: 'EmailLayout',
        data: { ...layoutBlock.data, childrenIds: [...currentChildrenIds, newBlockId] },
      },
    });
    setSelectedBlockId(newBlockId);
  };
}

// ─── Column-layout preview icon ────────────────────────────────────────────
function ColumnPreview({ widths }: { widths: number[] }) {
  return (
    <Box sx={{ display: 'flex', gap: '3px', width: 40, height: 22, flexShrink: 0 }}>
      {widths.map((w, i) => (
        <Box
          key={i}
          sx={{
            flex: w,
            backgroundColor: 'primary.main',
            opacity: 0.25,
            borderRadius: '3px',
            height: '100%',
            border: '1.5px solid',
            borderColor: 'primary.main',
          }}
        />
      ))}
    </Box>
  );
}

const ROW_PRESETS = [
  { label: '1 column', widths: [1], block: ROW_BUTTONS[0].block },
  { label: '2 columns', widths: [1, 1], block: ROW_BUTTONS[1].block },
  { label: '3 columns', widths: [1, 1, 1], block: ROW_BUTTONS[2].block },
  {
    label: '2/3 + 1/3',
    widths: [2, 1],
    block: (): TEditorBlock => ({
      type: 'Row',
      data: {
        props: {
          columnsCount: 2,
          columnsGap: 16,
          fixedWidths: [null, null],
          columns: [{ childrenIds: [] }, { childrenIds: [] }],
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: '1/3 + 2/3',
    widths: [1, 2],
    block: (): TEditorBlock => ({
      type: 'Row',
      data: {
        props: {
          columnsCount: 2,
          columnsGap: 16,
          fixedWidths: [null, null],
          columns: [{ childrenIds: [] }, { childrenIds: [] }],
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: '4 columns',
    widths: [1, 1, 1, 1],
    block: (): TEditorBlock => ({
      type: 'Row',
      data: {
        props: {
          columnsCount: 4,
          columnsGap: 8,
          columns: [{ childrenIds: [] }, { childrenIds: [] }, { childrenIds: [] }, { childrenIds: [] }],
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
];

function RowsPalette() {
  const addToLayout = useAddToLayout();
  return (
    <Box sx={{ p: 1.5 }}>
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'text.disabled',
          mb: 1.5,
          display: 'block',
          px: 0.5,
        }}
      >
        Clique ou arraste um layout
      </Typography>
      <Stack spacing={1}>
        {ROW_PRESETS.map((preset, i) => (
          <Box
            key={i}
            onClick={() => addToLayout(preset.block())}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 1.5,
              py: 1.25,
              borderRadius: 1.5,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'white',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              },
            }}
          >
            <ColumnPreview widths={preset.widths} />
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'text.primary' }}>
              {preset.label}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function ContentPalette() {
  const document = useDocument();
  const selectedBlockId = useSelectedBlockId();

  const ctx = findColumnContext(document, selectedBlockId);
  const hasContext = !!ctx;

  const handleContentClick = (block: TEditorBlock) => {
    if (!ctx) return;
    const { containerId, containerBlock, colIndex } = ctx;
    const newBlockId = generateId();
    const cols = [
      ...(((containerBlock.data as Record<string, unknown>).props as Record<string, unknown>).columns as {
        childrenIds: string[];
      }[]),
    ];

    // If Row/ColumnsContainer itself is selected → append to first column;
    // otherwise insert after the currently selected content block.
    let newChildren: string[];
    if (selectedBlockId === containerId) {
      newChildren = [...cols[colIndex].childrenIds, newBlockId];
    } else {
      const insertAfter = cols[colIndex].childrenIds.indexOf(selectedBlockId!);
      const arr = [...cols[colIndex].childrenIds];
      arr.splice(insertAfter + 1, 0, newBlockId);
      newChildren = arr;
    }

    cols[colIndex] = { ...cols[colIndex], childrenIds: newChildren };

    setDocument({
      [newBlockId]: block,
      [containerId]: {
        type: containerBlock.type,
        data: {
          ...(containerBlock.data as Record<string, unknown>),
          props: {
            ...((containerBlock.data as Record<string, unknown>).props as Record<string, unknown>),
            columns: cols,
          },
        },
      } as TEditorBlock,
    });
    setSelectedBlockId(newBlockId);
  };

  return (
    <Box sx={{ p: 1.5 }}>
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'text.disabled',
          mb: 1.5,
          display: 'block',
          px: 0.5,
        }}
      >
        {hasContext ? 'Clique ou arraste um bloco' : 'Arraste para uma linha'}
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
        {CONTENT_BUTTONS.map((btn, i) => (
            <Box
              key={i}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/email-block', JSON.stringify(btn.block()));
                e.dataTransfer.effectAllowed = 'copy';
              }}
              sx={{
                opacity: hasContext ? 1 : 0.6,
                cursor: 'grab',
                '&:active': { cursor: 'grabbing' },
              }}
            >
              <BlockButton label={btn.label} icon={btn.icon} onClick={() => handleContentClick(btn.block())} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── Saved Rows helpers ─────────────────────────────────────────────────────

function extractSubDocument(document: TEditorConfiguration, blockId: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  function extract(id: string) {
    const block = document[id];
    if (!block || result[id]) return;
    result[id] = block;

    const data = block.data as Record<string, unknown>;
    switch (block.type) {
      case 'Row': {
        const cols = ((data.props as Record<string, unknown>)?.columns as { childrenIds: string[] }[]) ?? [];
        for (const col of cols) for (const child of col.childrenIds ?? []) extract(child);
        break;
      }
      case 'Container': {
        for (const child of ((data.props as Record<string, unknown>)?.childrenIds as string[]) ?? []) extract(child);
        break;
      }
      case 'ColumnsContainer': {
        const cols = ((data.props as Record<string, unknown>)?.columns as { childrenIds: string[] }[]) ?? [];
        for (const col of cols) for (const child of col.childrenIds ?? []) extract(child);
        break;
      }
    }
  }

  extract(blockId);
  return result;
}

function insertSavedRow(
  currentDocument: TEditorConfiguration,
  savedDoc: Record<string, unknown>,
  rootBlockId: string
): { document: TEditorConfiguration; newRootId: string } {
  // Generate new IDs for all blocks to avoid collisions
  const idMap: Record<string, string> = {};
  for (const id of Object.keys(savedDoc)) {
    idMap[id] = `block-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
  }

  const remapIds = (ids: string[]) => ids.map((id) => idMap[id] ?? id);

  const newBlocks: TEditorConfiguration = {};
  for (const [oldId, block] of Object.entries(savedDoc)) {
    const b = block as TEditorBlock;
    const newId = idMap[oldId];
    let newData = structuredClone(b.data) as Record<string, unknown>;

    if (b.type === 'Row') {
      const cols = ((newData.props as Record<string, unknown>)?.columns as { childrenIds: string[] }[]) ?? [];
      (newData.props as Record<string, unknown>).columns = cols.map((col) => ({
        ...col,
        childrenIds: remapIds(col.childrenIds),
      }));
    } else if (b.type === 'Container') {
      (newData.props as Record<string, unknown>).childrenIds = remapIds(
        ((newData.props as Record<string, unknown>)?.childrenIds as string[]) ?? []
      );
    } else if (b.type === 'ColumnsContainer') {
      const cols = ((newData.props as Record<string, unknown>)?.columns as { childrenIds: string[] }[]) ?? [];
      (newData.props as Record<string, unknown>).columns = cols.map((col) => ({
        ...col,
        childrenIds: remapIds(col.childrenIds),
      }));
    }

    newBlocks[newId] = { type: b.type, data: newData } as TEditorBlock;
  }

  return { document: newBlocks, newRootId: idMap[rootBlockId] };
}

function SavedRowsPanel() {
  const { onSaveRow, onLoadSavedRows, onDeleteSavedRow } = useCallbacks();
  const document = useDocument();
  const selectedBlockId = useSelectedBlockId();
  const [rows, setRows] = useState<SavedRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rowName, setRowName] = useState('');

  const selectedBlock = selectedBlockId ? document[selectedBlockId] : null;
  const canSave = !!onSaveRow && !!selectedBlockId && !!selectedBlock;

  const loadRows = useCallback(async () => {
    if (!onLoadSavedRows) return;
    setLoading(true);
    try {
      const result = await onLoadSavedRows();
      setRows(result);
    } finally {
      setLoading(false);
    }
  }, [onLoadSavedRows]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const handleSave = async () => {
    if (!onSaveRow || !selectedBlockId) return;
    setSaving(true);
    try {
      const subDoc = extractSubDocument(document, selectedBlockId);
      await onSaveRow({
        id: `saved-${Date.now()}`,
        name: rowName.trim() || `Saved block ${rows.length + 1}`,
        document: subDoc,
        syncedRowId: selectedBlockId,
      });
      setRowName('');
      await loadRows();
    } finally {
      setSaving(false);
    }
  };

  const handleInsert = (row: SavedRow) => {
    const emailLayoutEntry = Object.entries(document).find(([, b]) => b.type === 'EmailLayout');
    if (!emailLayoutEntry) return;

    const [layoutId, layoutBlock] = emailLayoutEntry;
    const savedDoc = row.document as TEditorConfiguration;
    const rootId = Object.keys(savedDoc)[0];
    if (!rootId) return;

    const { document: newBlocks, newRootId } = insertSavedRow(document, savedDoc, rootId);
    const currentChildren = (layoutBlock.data as { childrenIds?: string[] }).childrenIds ?? [];

    setDocument({
      ...newBlocks,
      [layoutId]: {
        type: 'EmailLayout',
        data: { ...layoutBlock.data, childrenIds: [...currentChildren, newRootId] },
      },
    });
    setSelectedBlockId(newRootId);
  };

  const handleDelete = async (row: SavedRow) => {
    if (!onDeleteSavedRow) return;
    await onDeleteSavedRow(row.id);
    await loadRows();
  };

  if (!onSaveRow && !onLoadSavedRows) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Saved rows require <code>onSaveRow</code> and <code>onLoadSavedRows</code> callbacks.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1.5 }}>
      {canSave && (
        <Stack spacing={1} mb={2}>
          <TextField
            size="small"
            fullWidth
            placeholder="Row name..."
            value={rowName}
            onChange={(e) => setRowName(e.target.value)}
            InputProps={{ sx: { fontSize: 13 } }}
          />
          <Button
            size="small"
            variant="outlined"
            startIcon={saving ? <CircularProgress size={14} /> : <BookmarkAddOutlined fontSize="small" />}
            onClick={handleSave}
            disabled={saving}
            sx={{ textTransform: 'none' }}
          >
            Save selected block
          </Button>
        </Stack>
      )}

      <Divider sx={{ mb: 1 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={20} />
        </Box>
      ) : rows.length === 0 ? (
        <Typography variant="caption" color="text.secondary">
          No saved rows yet.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {rows.map((row) => (
            <Stack key={row.id} direction="row" alignItems="center" spacing={1}>
              <Button
                size="small"
                variant="text"
                sx={{ flex: 1, justifyContent: 'flex-start', textTransform: 'none', fontSize: 13 }}
                onClick={() => handleInsert(row)}
              >
                {row.name}
              </Button>
              {onDeleteSavedRow && (
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => handleDelete(row)}>
                    <DeleteOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}

function TemplatesList() {
  return (
    <Stack spacing={2} sx={{ '& .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } }}>
      <Stack alignItems="flex-start">
        <SidebarButton href="#">Empty</SidebarButton>
        <SidebarButton href="#sample/welcome">Welcome email</SidebarButton>
        <SidebarButton href="#sample/one-time-password">One-time passcode (OTP)</SidebarButton>
        <SidebarButton href="#sample/reset-password">Reset password</SidebarButton>
        <SidebarButton href="#sample/order-ecomerce">E-commerce receipt</SidebarButton>
        <SidebarButton href="#sample/subscription-receipt">Subscription receipt</SidebarButton>
        <SidebarButton href="#sample/reservation-reminder">Reservation reminder</SidebarButton>
        <SidebarButton href="#sample/post-metrics-report">Post metrics</SidebarButton>
        <SidebarButton href="#sample/respond-to-message">Respond to inquiry</SidebarButton>
      </Stack>

      <Divider />

      <Stack>
        <Button size="small" href="https://www.usewaypoint.com/open-source/emailbuilderjs" target="_blank">
          Learn more
        </Button>
        <Button size="small" href="https://github.com/usewaypoint/email-builder-js" target="_blank">
          View on GitHub
        </Button>
      </Stack>
    </Stack>
  );
}

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const [activeTab, setActiveTab] = useState<'rows' | 'content' | 'saved' | 'templates'>('content');
  const document = useDocument();
  const selectedBlockId = useSelectedBlockId();

  // Auto-switch to Content when a Row or content block is selected
  useEffect(() => {
    if (!selectedBlockId) return;
    const sel = document[selectedBlockId];
    if (sel?.type === 'Row' || !!findColumnContext(document, selectedBlockId)) {
      setActiveTab((t) => (t === 'rows' ? 'content' : t));
    }
  }, [selectedBlockId, document]);

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={samplesDrawerOpen}
      sx={{
        width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
      }}
    >
      <Stack width={SAMPLES_DRAWER_WIDTH} height="100%" overflow="hidden">
        <Box
          px={2}
          py={1.25}
          sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.25 }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 0.75,
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 11, lineHeight: 1 }}>EB</Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            E-mail Builder | Reprotel
          </Typography>
        </Box>
        <Box px={0} pt={0} pb={0}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 38 }}
          >
            <Tab label="Linhas" value="rows" sx={{ minHeight: 38, py: 0, fontSize: 11, fontWeight: 600 }} />
            <Tab label="Conteúdo" value="content" sx={{ minHeight: 38, py: 0, fontSize: 11, fontWeight: 600 }} />
            <Tab label="Salvos" value="saved" sx={{ minHeight: 38, py: 0, fontSize: 11, fontWeight: 600 }} />
            <Tab label="Templates" value="templates" sx={{ minHeight: 38, py: 0, fontSize: 11, fontWeight: 600 }} />
          </Tabs>
        </Box>

        <Box flex={1} overflow="auto" bgcolor="#F9FAFB">
          {activeTab === 'rows' ? (
            <RowsPalette />
          ) : activeTab === 'content' ? (
            <ContentPalette />
          ) : activeTab === 'saved' ? (
            <SavedRowsPanel />
          ) : (
            <Box px={2} py={1}>
              <TemplatesList />
            </Box>
          )}
        </Box>

        <Box px={2} py={2} borderTop="1px solid" sx={{ borderColor: 'divider' }}>
          <Stack spacing={1.5}>
            <Link href="https://usewaypoint.com?utm_source=emailbuilderjs" target="_blank" sx={{ lineHeight: 1 }}>
              <Box component="img" src={logo} width={28} />
            </Link>
            <Typography variant="caption" color="text.secondary">
              Looking to send emails?{' '}
              <Link href="https://usewaypoint.com?utm_source=emailbuilderjs" target="_blank">
                Try Waypoint
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Drawer>
  );
}
