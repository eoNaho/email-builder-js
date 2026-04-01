import React, { useEffect } from 'react';

import { Box, Drawer, Tab, Tabs } from '@mui/material';

import { setSidebarTab, useInspectorDrawerOpen, useSelectedBlockId, useSelectedSidebarTab } from '../../documents/editor/EditorContext';

import BrandKitPanel from './BrandKitPanel';
import ConfigurationPanel from './ConfigurationPanel';
import LinksPanel from './LinksPanel';
import StylesPanel from './StylesPanel';

export const INSPECTOR_DRAWER_WIDTH = 320;

export default function InspectorDrawer() {
  const selectedSidebarTab = useSelectedSidebarTab();
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const selectedBlockId = useSelectedBlockId();

  // Auto-switch: show block config when a block is selected, global styles when deselected
  useEffect(() => {
    if (selectedBlockId) {
      setSidebarTab('block-configuration');
    } else if (selectedSidebarTab === 'block-configuration') {
      setSidebarTab('styles');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBlockId]);

  const renderCurrentSidebarPanel = () => {
    switch (selectedSidebarTab) {
      case 'block-configuration':
        return <ConfigurationPanel />;
      case 'styles':
        return <StylesPanel />;
      case 'brand-kit':
        return <BrandKitPanel />;
      case 'links':
        return <LinksPanel />;
    }
  };

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={inspectorDrawerOpen}
      sx={{
        width: inspectorDrawerOpen ? INSPECTOR_DRAWER_WIDTH : 0,
      }}
    >
      <Box sx={{ width: INSPECTOR_DRAWER_WIDTH, height: 49, borderBottom: 1, borderColor: 'divider' }}>
        <Box px={2}>
          <Tabs value={selectedSidebarTab} onChange={(_, v) => setSidebarTab(v)}>
            <Tab value="styles" label="Global" />
            <Tab value="brand-kit" label="Brand" />
            <Tab value="links" label="Links" />
            <Tab
              value="block-configuration"
              label="Elemento"
              disabled={!selectedBlockId}
              sx={{ opacity: selectedBlockId ? 1 : 0.4 }}
            />
          </Tabs>
        </Box>
      </Box>
      <Box sx={{ width: INSPECTOR_DRAWER_WIDTH, height: 'calc(100% - 49px)', overflow: 'auto' }}>
        {renderCurrentSidebarPanel()}
      </Box>
    </Drawer>
  );
}
