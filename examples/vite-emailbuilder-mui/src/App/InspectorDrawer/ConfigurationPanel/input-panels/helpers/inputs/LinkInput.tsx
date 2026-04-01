import React, { useState } from 'react';

import { ExpandMoreOutlined, ExpandLessOutlined } from '@mui/icons-material';
import { Box, Button, Collapse, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';

type Protocol = 'https' | 'mailto' | 'tel' | 'sms';

type UtmParams = {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
};

function parseUrl(url: string): { protocol: Protocol; base: string; utm: UtmParams } {
  const utm: UtmParams = { source: '', medium: '', campaign: '', term: '', content: '' };
  let protocol: Protocol = 'https';

  if (url.startsWith('mailto:')) protocol = 'mailto';
  else if (url.startsWith('tel:')) protocol = 'tel';
  else if (url.startsWith('sms:')) protocol = 'sms';

  try {
    const parsed = new URL(url);
    utm.source = parsed.searchParams.get('utm_source') ?? '';
    utm.medium = parsed.searchParams.get('utm_medium') ?? '';
    utm.campaign = parsed.searchParams.get('utm_campaign') ?? '';
    utm.term = parsed.searchParams.get('utm_term') ?? '';
    utm.content = parsed.searchParams.get('utm_content') ?? '';

    // Remove UTM params from base URL for display
    parsed.searchParams.delete('utm_source');
    parsed.searchParams.delete('utm_medium');
    parsed.searchParams.delete('utm_campaign');
    parsed.searchParams.delete('utm_term');
    parsed.searchParams.delete('utm_content');
    return { protocol, base: parsed.toString(), utm };
  } catch {
    return { protocol, base: url, utm };
  }
}

function buildUrl(base: string, utm: UtmParams): string {
  const hasUtm = utm.source || utm.medium || utm.campaign || utm.term || utm.content;
  if (!hasUtm) return base;

  try {
    const parsed = new URL(base);
    if (utm.source) parsed.searchParams.set('utm_source', utm.source);
    if (utm.medium) parsed.searchParams.set('utm_medium', utm.medium);
    if (utm.campaign) parsed.searchParams.set('utm_campaign', utm.campaign);
    if (utm.term) parsed.searchParams.set('utm_term', utm.term);
    if (utm.content) parsed.searchParams.set('utm_content', utm.content);
    return parsed.toString();
  } catch {
    return base;
  }
}

type LinkInputProps = {
  label: string;
  defaultValue: string;
  onChange: (url: string) => void;
};

export default function LinkInput({ label, defaultValue, onChange }: LinkInputProps) {
  const parsed = parseUrl(defaultValue ?? '');
  const [protocol, setProtocol] = useState<Protocol>(parsed.protocol);
  const [baseUrl, setBaseUrl] = useState(parsed.base);
  const [utm, setUtm] = useState<UtmParams>(parsed.utm);
  const [utmOpen, setUtmOpen] = useState(false);

  const handleBaseUrlChange = (newBase: string) => {
    setBaseUrl(newBase);
    onChange(buildUrl(newBase, utm));
  };

  const handleUtmChange = (key: keyof UtmParams, value: string) => {
    const newUtm = { ...utm, [key]: value };
    setUtm(newUtm);
    onChange(buildUrl(baseUrl, newUtm));
  };

  const hasUtm = Object.values(utm).some((v) => v.length > 0);

  return (
    <Stack spacing={1}>
      <InputLabel shrink>{label}</InputLabel>
      <Stack direction="row" spacing={1}>
        {protocol !== 'https' ? null : null}
        <Select
          size="small"
          value={protocol}
          onChange={(e) => {
            const p = e.target.value as Protocol;
            setProtocol(p);
          }}
          sx={{ minWidth: 90, fontSize: 13 }}
        >
          <MenuItem value="https">https://</MenuItem>
          <MenuItem value="mailto">mailto:</MenuItem>
          <MenuItem value="tel">tel:</MenuItem>
          <MenuItem value="sms">sms:</MenuItem>
        </Select>
        <TextField
          size="small"
          fullWidth
          value={baseUrl}
          onChange={(e) => handleBaseUrlChange(e.target.value)}
          placeholder={protocol === 'https' ? 'https://example.com' : protocol === 'mailto' ? 'user@example.com' : ''}
          InputProps={{ sx: { fontSize: 13 } }}
        />
      </Stack>
      {protocol === 'https' && (
        <>
          <Button
            size="small"
            variant="text"
            color={hasUtm ? 'primary' : 'inherit'}
            startIcon={utmOpen ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
            onClick={() => setUtmOpen((o) => !o)}
            sx={{ alignSelf: 'flex-start', textTransform: 'none', fontSize: 12, px: 0 }}
          >
            UTM parameters {hasUtm ? '(active)' : ''}
          </Button>
          <Collapse in={utmOpen}>
            <Stack spacing={1}>
              {(['source', 'medium', 'campaign', 'term', 'content'] as (keyof UtmParams)[]).map((key) => (
                <Box key={key}>
                  <InputLabel shrink sx={{ fontSize: 11, mb: 0.5 }}>
                    utm_{key}
                  </InputLabel>
                  <TextField
                    size="small"
                    fullWidth
                    value={utm[key]}
                    onChange={(e) => handleUtmChange(key, e.target.value)}
                    placeholder={key === 'source' ? 'newsletter' : key === 'medium' ? 'email' : ''}
                    InputProps={{ sx: { fontSize: 12 } }}
                  />
                </Box>
              ))}
            </Stack>
          </Collapse>
        </>
      )}
    </Stack>
  );
}
