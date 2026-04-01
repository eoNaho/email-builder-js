import React, { useEffect, useRef } from 'react';

import { Stack, useTheme } from '@mui/material';

import { redo, undo, useDocument, useInspectorDrawerOpen, useSamplesDrawerOpen } from '../documents/editor/EditorContext';
import { useCallbacks } from '../documents/editor/CallbacksContext';

import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from './InspectorDrawer';
import SamplesDrawer, { SAMPLES_DRAWER_WIDTH } from './SamplesDrawer';
import TemplatePanel from './TemplatePanel';

function useDrawerTransition(cssProperty: 'margin-left' | 'margin-right', open: boolean) {
  const { transitions } = useTheme();
  return transitions.create(cssProperty, {
    easing: !open ? transitions.easing.sharp : transitions.easing.easeOut,
    duration: !open ? transitions.duration.leavingScreen : transitions.duration.enteringScreen,
  });
}

function useAutoSave() {
  const document = useDocument();
  const { onAutoSave } = useCallbacks();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!onAutoSave) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onAutoSave(document as Record<string, unknown>);
    }, 2000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [document, onAutoSave]);
}

function useUndoRedoKeyboard() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
}

export default function App() {
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const samplesDrawerOpen = useSamplesDrawerOpen();
  useUndoRedoKeyboard();
  useAutoSave();

  const marginLeftTransition = useDrawerTransition('margin-left', samplesDrawerOpen);
  const marginRightTransition = useDrawerTransition('margin-right', inspectorDrawerOpen);

  return (
    <>
      <InspectorDrawer />
      <SamplesDrawer />

      <Stack
        sx={{
          marginRight: inspectorDrawerOpen ? `${INSPECTOR_DRAWER_WIDTH}px` : 0,
          marginLeft: samplesDrawerOpen ? `${SAMPLES_DRAWER_WIDTH}px` : 0,
          transition: [marginLeftTransition, marginRightTransition].join(', '),
        }}
      >
        <TemplatePanel />
      </Stack>
    </>
  );
}
