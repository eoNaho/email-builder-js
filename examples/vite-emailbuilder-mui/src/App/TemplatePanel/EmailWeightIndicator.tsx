import React, { useMemo } from 'react';

import { Tooltip, Typography } from '@mui/material';
import { calculateEmailWeight, renderToStaticMarkup } from '@usewaypoint/email-builder';

import { useDocument } from '../../documents/editor/EditorContext';

export default function EmailWeightIndicator() {
  const document = useDocument();

  const { kb, status } = useMemo(() => {
    try {
      const html = renderToStaticMarkup(document, { rootBlockId: 'root' });
      return calculateEmailWeight(html);
    } catch {
      return { kb: 0, status: 'ok' as const };
    }
  }, [document]);

  const color = status === 'ok' ? 'success.main' : status === 'warning' ? 'warning.main' : 'error.main';

  const tooltipText =
    status === 'ok'
      ? 'Email size is optimal (under 60 KB)'
      : status === 'warning'
        ? 'Email is getting large (60–102 KB). Some clients may clip it.'
        : 'Email exceeds 102 KB. Gmail will clip this email!';

  return (
    <Tooltip title={tooltipText}>
      <Typography variant="caption" sx={{ color, fontWeight: 600, cursor: 'default', whiteSpace: 'nowrap' }}>
        {kb} KB
      </Typography>
    </Tooltip>
  );
}
