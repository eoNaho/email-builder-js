import React from 'react';
import ReactDOM from 'react-dom/client';

import { CssBaseline, ThemeProvider } from '@mui/material';

import App from './App';
import { BrandKitProvider } from './documents/editor/BrandKitContext';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrandKitProvider>
        <App />
      </BrandKitProvider>
    </ThemeProvider>
  </React.StrictMode>
);
