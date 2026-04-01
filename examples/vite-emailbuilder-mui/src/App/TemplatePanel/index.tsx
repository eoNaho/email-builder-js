import React from 'react';

import { FullscreenExitOutlined, FullscreenOutlined, MonitorOutlined, PhoneIphoneOutlined } from '@mui/icons-material';
import { Box, IconButton, Stack, SxProps, Tooltip } from '@mui/material';
import { Reader, renderToStaticMarkup } from '@usewaypoint/email-builder';

import EditorBlock from '../../documents/editor/EditorBlock';
import {
  setSelectedScreenSize,
  toggleFullscreen,
  useDocument,
  useIsFullscreen,
  useSelectedMainTab,
  useSelectedScreenSize,
  useZoomLevel,
} from '../../documents/editor/EditorContext';
import ToggleInspectorPanelButton from '../InspectorDrawer/ToggleInspectorPanelButton';
import ToggleSamplesPanelButton from '../SamplesDrawer/ToggleSamplesPanelButton';

import DownloadJson from './DownloadJson';
import EmailWeightIndicator from './EmailWeightIndicator';
import HtmlPanel from './HtmlPanel';
import ImportJson from './ImportJson';
import JsonPanel from './JsonPanel';
import MainTabsGroup from './MainTabsGroup';
import ShareButton from './ShareButton';
import ZoomControls from './ZoomControls';

export default function TemplatePanel() {
  const document = useDocument();
  const selectedMainTab = useSelectedMainTab();
  const selectedScreenSize = useSelectedScreenSize();
  const zoomLevel = useZoomLevel();
  const isFullscreen = useIsFullscreen();

  let mainBoxSx: SxProps = {
    height: '100%',
  };
  if (selectedScreenSize === 'mobile') {
    mainBoxSx = {
      ...mainBoxSx,
      margin: '32px auto',
      width: 370,
      height: 800,
      boxShadow:
        'rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 36, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px',
    };
  }


  const renderMainPanel = () => {
    switch (selectedMainTab) {
      case 'editor':
        return (
          <Box
            sx={{
              ...mainBoxSx,
              transformOrigin: 'top center',
              transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : undefined,
              marginBottom: zoomLevel !== 1 ? `${(zoomLevel - 1) * -50}%` : undefined,
            }}
          >
            <EditorBlock id="root" />
          </Box>
        );
      case 'preview':
        if (selectedScreenSize === 'mobile') {
          const html = renderToStaticMarkup(document, { rootBlockId: 'root' });
          return (
            <Box sx={mainBoxSx}>
              <iframe
                srcDoc={html}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                title="Mobile preview"
              />
            </Box>
          );
        }
        return (
          <Box sx={mainBoxSx}>
            <Reader document={document} rootBlockId="root" />
          </Box>
        );
      case 'html':
        return <HtmlPanel />;
      case 'json':
        return <JsonPanel />;
    }
  };

  return (
    <>
      <Stack
        sx={{
          height: 49,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 'appBar',
          px: 1,
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <ToggleSamplesPanelButton />
        <Stack px={2} direction="row" gap={2} width="100%" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2}>
            <MainTabsGroup />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <EmailWeightIndicator />
            <ZoomControls />
            <DownloadJson />
            <ImportJson />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.5,
                p: 0.375,
                gap: 0.25,
              }}
            >
              {[
                { value: 'desktop', icon: <MonitorOutlined fontSize="small" />, title: 'Vista Desktop' },
                { value: 'mobile', icon: <PhoneIphoneOutlined fontSize="small" />, title: 'Vista Móvel' },
              ].map((btn) => (
                <Tooltip key={btn.value} title={btn.title}>
                  <Box
                    component="button"
                    onClick={() => setSelectedScreenSize(btn.value as 'desktop' | 'mobile')}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 0.625,
                      borderRadius: 1,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      bgcolor: selectedScreenSize === btn.value ? 'white' : 'transparent',
                      color: selectedScreenSize === btn.value ? 'primary.main' : 'text.secondary',
                      boxShadow: selectedScreenSize === btn.value ? 1 : 'none',
                      '&:hover': { color: 'text.primary' },
                    }}
                  >
                    {btn.icon}
                  </Box>
                </Tooltip>
              ))}
            </Box>
            <ShareButton />
            <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
              <IconButton size="small" onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExitOutlined fontSize="small" /> : <FullscreenOutlined fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
        <ToggleInspectorPanelButton />
      </Stack>
      <Box
        sx={{
          height: 'calc(100vh - 49px)',
          overflow: 'auto',
          minWidth: 370,
          backgroundColor: 'background.default',
          backgroundImage:
            selectedMainTab === 'editor'
              ? 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)'
              : 'none',
          backgroundSize: '20px 20px',
        }}
      >
        {renderMainPanel()}
      </Box>
    </>
  );
}
