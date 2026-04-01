import { create } from 'zustand';

import getConfiguration from '../../getConfiguration';

import { TEditorConfiguration } from './core';

const HISTORY_MAX = 50;

type TValue = {
  document: TEditorConfiguration;
  history: TEditorConfiguration[];
  historyIndex: number;

  selectedBlockId: string | null;
  selectedSidebarTab: 'block-configuration' | 'styles' | 'brand-kit' | 'links';
  selectedMainTab: 'editor' | 'preview' | 'json' | 'html';
  selectedScreenSize: 'desktop' | 'mobile';

  inspectorDrawerOpen: boolean;
  samplesDrawerOpen: boolean;
  zoomLevel: number;
  isFullscreen: boolean;
};

const initialDocument = getConfiguration(window.location.hash);

const editorStateStore = create<TValue>(() => ({
  document: initialDocument,
  history: [initialDocument],
  historyIndex: 0,
  selectedBlockId: null,
  selectedSidebarTab: 'styles',
  selectedMainTab: 'editor',
  selectedScreenSize: 'desktop',

  inspectorDrawerOpen: true,
  samplesDrawerOpen: true,
  zoomLevel: 1,
  isFullscreen: false,
}));

export function useDocument() {
  return editorStateStore((s) => s.document);
}

export function useSelectedBlockId() {
  return editorStateStore((s) => s.selectedBlockId);
}

export function useSelectedScreenSize() {
  return editorStateStore((s) => s.selectedScreenSize);
}

export function useSelectedMainTab() {
  return editorStateStore((s) => s.selectedMainTab);
}

export function setSelectedMainTab(selectedMainTab: TValue['selectedMainTab']) {
  return editorStateStore.setState({ selectedMainTab });
}

export function useSelectedSidebarTab() {
  return editorStateStore((s) => s.selectedSidebarTab);
}

export function useInspectorDrawerOpen() {
  return editorStateStore((s) => s.inspectorDrawerOpen);
}

export function useSamplesDrawerOpen() {
  return editorStateStore((s) => s.samplesDrawerOpen);
}

export function setSelectedBlockId(selectedBlockId: TValue['selectedBlockId']) {
  const selectedSidebarTab = selectedBlockId === null ? 'styles' : 'block-configuration';
  const options: Partial<TValue> = {};
  if (selectedBlockId !== null) {
    options.inspectorDrawerOpen = true;
  }
  return editorStateStore.setState({
    selectedBlockId,
    selectedSidebarTab,
    ...options,
  });
}

export function setSidebarTab(selectedSidebarTab: TValue['selectedSidebarTab']) {
  return editorStateStore.setState({ selectedSidebarTab });
}

export function resetDocument(document: TValue['document']) {
  return editorStateStore.setState({
    document,
    history: [document],
    historyIndex: 0,
    selectedSidebarTab: 'styles',
    selectedBlockId: null,
  });
}

export function setDocument(document: TValue['document']) {
  const { document: originalDocument, history, historyIndex } = editorStateStore.getState();
  const newDocument = { ...originalDocument, ...document };
  const truncatedHistory = history.slice(0, historyIndex + 1);
  const newHistory = [...truncatedHistory, newDocument].slice(-HISTORY_MAX);
  return editorStateStore.setState({
    document: newDocument,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  });
}

export function undo() {
  const { history, historyIndex } = editorStateStore.getState();
  if (historyIndex <= 0) return;
  const newIndex = historyIndex - 1;
  return editorStateStore.setState({
    document: history[newIndex],
    historyIndex: newIndex,
    selectedBlockId: null,
  });
}

export function redo() {
  const { history, historyIndex } = editorStateStore.getState();
  if (historyIndex >= history.length - 1) return;
  const newIndex = historyIndex + 1;
  return editorStateStore.setState({
    document: history[newIndex],
    historyIndex: newIndex,
    selectedBlockId: null,
  });
}

/** Recursively collects a block ID and all its descendant IDs. */
function collectDescendantIds(doc: TEditorConfiguration, blockId: string): string[] {
  const ids: string[] = [blockId];
  const block = doc[blockId];
  if (!block) return ids;
  const scan = (val: unknown) => {
    if (!val || typeof val !== 'object') return;
    if (Array.isArray(val)) { val.forEach(scan); return; }
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      if (k === 'childrenIds' && Array.isArray(v)) {
        for (const childId of v as string[]) ids.push(...collectDescendantIds(doc, childId));
      } else {
        scan(v);
      }
    }
  };
  scan(block.data);
  return ids;
}

/**
 * Atomically deletes a block (and all its descendants) from the document,
 * while applying a patch to update the parent container's childrenIds reference.
 */
export function deleteBlock(blockId: string, parentPatch: TEditorConfiguration) {
  const { document: originalDocument, history, historyIndex } = editorStateStore.getState();
  const idsToDelete = collectDescendantIds(originalDocument, blockId);
  const newDocument = { ...originalDocument, ...parentPatch };
  for (const id of idsToDelete) delete newDocument[id];
  const truncatedHistory = history.slice(0, historyIndex + 1);
  const newHistory = [...truncatedHistory, newDocument].slice(-HISTORY_MAX);
  return editorStateStore.setState({
    document: newDocument,
    history: newHistory,
    historyIndex: newHistory.length - 1,
    selectedBlockId: null,
  });
}

export function useCanUndo() {
  return editorStateStore((s) => s.historyIndex > 0);
}

export function useCanRedo() {
  return editorStateStore((s) => s.historyIndex < s.history.length - 1);
}

export function toggleInspectorDrawerOpen() {
  const inspectorDrawerOpen = !editorStateStore.getState().inspectorDrawerOpen;
  return editorStateStore.setState({ inspectorDrawerOpen });
}

export function toggleSamplesDrawerOpen() {
  const samplesDrawerOpen = !editorStateStore.getState().samplesDrawerOpen;
  return editorStateStore.setState({ samplesDrawerOpen });
}

export function setSelectedScreenSize(selectedScreenSize: TValue['selectedScreenSize']) {
  return editorStateStore.setState({ selectedScreenSize });
}

export function useZoomLevel() {
  return editorStateStore((s) => s.zoomLevel);
}

export function setZoomLevel(zoomLevel: number) {
  return editorStateStore.setState({ zoomLevel: Math.max(0.25, Math.min(2, zoomLevel)) });
}

export function useIsFullscreen() {
  return editorStateStore((s) => s.isFullscreen);
}

export function toggleFullscreen() {
  const isFullscreen = !editorStateStore.getState().isFullscreen;
  if (isFullscreen) {
    return editorStateStore.setState({ isFullscreen, inspectorDrawerOpen: false, samplesDrawerOpen: false });
  }
  return editorStateStore.setState({ isFullscreen, inspectorDrawerOpen: true, samplesDrawerOpen: true });
}
