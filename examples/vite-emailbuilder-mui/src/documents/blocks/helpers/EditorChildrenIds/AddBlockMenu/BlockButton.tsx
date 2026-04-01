import React from 'react';

import { Box, Typography } from '@mui/material';

type BlockMenuButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export default function BlockTypeButton({ label, icon, onClick }: BlockMenuButtonProps) {
  return (
    <Box
      component="button"
      onClick={(ev: React.MouseEvent) => {
        ev.stopPropagation();
        onClick();
      }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        p: 2,
        bgcolor: 'white',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        cursor: 'pointer',
        width: '100%',
        outline: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          '& .block-icon': { color: 'primary.main' },
          '& .block-label': { color: 'primary.main' },
        },
      }}
    >
      <Box className="block-icon" sx={{ display: 'flex', fontSize: 20, color: '#94a3b8', transition: 'color 0.15s' }}>
        {icon}
      </Box>
      <Typography
        className="block-label"
        sx={{
          fontSize: 11,
          fontWeight: 500,
          lineHeight: 1,
          textTransform: 'none',
          letterSpacing: 0,
          textAlign: 'center',
          color: 'text.secondary',
          transition: 'color 0.15s',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
