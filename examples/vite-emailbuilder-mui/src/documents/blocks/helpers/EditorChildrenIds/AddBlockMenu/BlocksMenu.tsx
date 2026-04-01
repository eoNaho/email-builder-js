import React from 'react';

import { Box, Menu } from '@mui/material';

import { TEditorBlock } from '../../../../editor/core';

import BlockButton from './BlockButton';
import { CONTENT_BUTTONS, ROW_BUTTONS } from './buttons';

type BlocksMenuProps = {
  anchorEl: HTMLElement | null;
  setAnchorEl: (v: HTMLElement | null) => void;
  onSelect: (block: TEditorBlock) => void;
  mode?: 'rows-only' | 'content-only' | 'all';
};
export default function BlocksMenu({ anchorEl, setAnchorEl, onSelect, mode = 'all' }: BlocksMenuProps) {
  const buttons = mode === 'rows-only' ? ROW_BUTTONS : mode === 'content-only' ? CONTENT_BUTTONS : [...ROW_BUTTONS, ...CONTENT_BUTTONS];
  const onClose = () => {
    setAnchorEl(null);
  };

  const onClick = (block: TEditorBlock) => {
    onSelect(block);
    setAnchorEl(null);
  };

  if (anchorEl === null) {
    return null;
  }

  return (
    <Menu
      open
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Box sx={{ p: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
        {buttons.map((k, i) => (
          <BlockButton key={i} label={k.label} icon={k.icon} onClick={() => onClick(k.block())} />
        ))}
      </Box>
    </Menu>
  );
}
