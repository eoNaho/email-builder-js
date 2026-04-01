import React from 'react';

import { AddOutlined, RemoveOutlined } from '@mui/icons-material';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { setZoomLevel, useZoomLevel } from '../../documents/editor/EditorContext';

export default function ZoomControls() {
  const zoomLevel = useZoomLevel();

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Tooltip title="Zoom out">
        <IconButton size="small" onClick={() => setZoomLevel(zoomLevel - 0.1)}>
          <RemoveOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Reset zoom">
        <Typography
          variant="caption"
          sx={{ cursor: 'pointer', minWidth: 36, textAlign: 'center', fontWeight: 600 }}
          onClick={() => setZoomLevel(1)}
        >
          {Math.round(zoomLevel * 100)}%
        </Typography>
      </Tooltip>
      <Tooltip title="Zoom in">
        <IconButton size="small" onClick={() => setZoomLevel(zoomLevel + 0.1)}>
          <AddOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
