import React, { useRef, useState } from 'react';

import { CloudUploadOutlined, CollectionsOutlined } from '@mui/icons-material';
import { Box, Button, CircularProgress, InputLabel, Stack, TextField, Tooltip } from '@mui/material';

import { useCallbacks } from '../../../../../../documents/editor/CallbacksContext';

type ImagePickerProps = {
  label: string;
  defaultValue: string | null | undefined;
  onChange: (url: string | null) => void;
};

export default function ImagePicker({ label, defaultValue, onChange }: ImagePickerProps) {
  const callbacks = useCallbacks();
  const [url, setUrl] = useState(defaultValue ?? '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (val: string) => {
    setUrl(val);
    onChange(val.trim().length === 0 ? null : val.trim());
  };

  const handleFileUpload = async (file: File) => {
    if (!callbacks.onUploadImage) return;
    setUploading(true);
    try {
      const { url: newUrl } = await callbacks.onUploadImage(file);
      setUrl(newUrl);
      onChange(newUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleBrowse = async () => {
    if (!callbacks.onBrowseMediaLibrary) return;
    const result = await callbacks.onBrowseMediaLibrary();
    if (result) {
      setUrl(result.url);
      onChange(result.url);
    }
  };

  return (
    <Stack spacing={1}>
      <InputLabel shrink>{label}</InputLabel>
      {url && (
        <Box
          component="img"
          src={url}
          alt=""
          sx={{
            width: '100%',
            maxHeight: 120,
            objectFit: 'contain',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#f8f8f8',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      <TextField
        size="small"
        fullWidth
        value={url}
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
        InputProps={{ sx: { fontSize: 13 } }}
      />
      {(callbacks.onUploadImage || callbacks.onBrowseMediaLibrary) && (
        <Stack direction="row" spacing={1}>
          {callbacks.onUploadImage && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                  e.target.value = '';
                }}
              />
              <Tooltip title="Upload image">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={uploading ? <CircularProgress size={14} /> : <CloudUploadOutlined fontSize="small" />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  sx={{ textTransform: 'none', fontSize: 12 }}
                >
                  Upload
                </Button>
              </Tooltip>
            </>
          )}
          {callbacks.onBrowseMediaLibrary && (
            <Tooltip title="Browse media library">
              <Button
                size="small"
                variant="outlined"
                startIcon={<CollectionsOutlined fontSize="small" />}
                onClick={handleBrowse}
                sx={{ textTransform: 'none', fontSize: 12 }}
              >
                Browse
              </Button>
            </Tooltip>
          )}
        </Stack>
      )}
    </Stack>
  );
}
