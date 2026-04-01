import React from 'react';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { setDocument, useDocument } from '../../documents/editor/EditorContext';
import LinkInput from './ConfigurationPanel/input-panels/helpers/inputs/LinkInput';

type LinkEntry = {
  blockId: string;
  blockType: string;
  field: string;
  url: string;
  setter: (url: string) => void;
};

function extractLinks(document: ReturnType<typeof useDocument>): LinkEntry[] {
  const entries: LinkEntry[] = [];

  for (const [blockId, block] of Object.entries(document)) {
    const { type, data } = block as { type: string; data: Record<string, unknown> };
    const props = (data?.props ?? {}) as Record<string, unknown>;

    switch (type) {
      case 'Button': {
        const url = props.url as string | null | undefined;
        if (url != null) {
          entries.push({
            blockId,
            blockType: 'Button',
            field: 'URL',
            url,
            setter: (newUrl) =>
              setDocument({
                [blockId]: { ...block, data: { ...data, props: { ...props, url: newUrl } } } as typeof block,
              }),
          });
        }
        break;
      }
      case 'Image': {
        const linkHref = props.linkHref as string | null | undefined;
        if (linkHref) {
          entries.push({
            blockId,
            blockType: 'Image',
            field: 'Link',
            url: linkHref,
            setter: (newUrl) =>
              setDocument({
                [blockId]: { ...block, data: { ...data, props: { ...props, linkHref: newUrl } } } as typeof block,
              }),
          });
        }
        break;
      }
      case 'Navigation': {
        const links = props.links as { text: string; url: string }[] | undefined;
        (links ?? []).forEach((link, idx) => {
          entries.push({
            blockId,
            blockType: 'Navigation',
            field: link.text || `Link ${idx + 1}`,
            url: link.url,
            setter: (newUrl) => {
              const newLinks = [...(links ?? [])];
              newLinks[idx] = { ...newLinks[idx], url: newUrl };
              setDocument({
                [blockId]: { ...block, data: { ...data, props: { ...props, links: newLinks } } } as typeof block,
              });
            },
          });
        });
        break;
      }
      case 'Social': {
        const platforms = props.platforms as { platform: string; url: string }[] | undefined;
        (platforms ?? []).forEach((p, idx) => {
          entries.push({
            blockId,
            blockType: 'Social',
            field: p.platform,
            url: p.url,
            setter: (newUrl) => {
              const newPlatforms = [...(platforms ?? [])];
              newPlatforms[idx] = { ...newPlatforms[idx], url: newUrl };
              setDocument({
                [blockId]: {
                  ...block,
                  data: { ...data, props: { ...props, platforms: newPlatforms } },
                } as typeof block,
              });
            },
          });
        });
        break;
      }
      case 'Footer': {
        const unsubscribeUrl = props.unsubscribeUrl as string | null | undefined;
        if (unsubscribeUrl) {
          entries.push({
            blockId,
            blockType: 'Footer',
            field: 'Unsubscribe URL',
            url: unsubscribeUrl,
            setter: (newUrl) =>
              setDocument({
                [blockId]: {
                  ...block,
                  data: { ...data, props: { ...props, unsubscribeUrl: newUrl } },
                } as typeof block,
              }),
          });
        }
        break;
      }
      case 'Rating': {
        const linkUrl = props.linkUrl as string | null | undefined;
        if (linkUrl) {
          entries.push({
            blockId,
            blockType: 'Rating',
            field: 'Link URL',
            url: linkUrl,
            setter: (newUrl) =>
              setDocument({
                [blockId]: { ...block, data: { ...data, props: { ...props, linkUrl: newUrl } } } as typeof block,
              }),
          });
        }
        break;
      }
    }
  }

  return entries;
}

export default function LinksPanel() {
  const document = useDocument();
  const links = extractLinks(document);

  if (links.length === 0) {
    return (
      <Box sx={{ m: 3, p: 1, border: '1px dashed', borderColor: 'divider' }}>
        <Typography color="text.secondary">No links found in the document.</Typography>
      </Box>
    );
  }

  return (
    <Stack divider={<Divider />}>
      {links.map((entry, idx) => (
        <Box key={idx} sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {entry.blockType}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              ·
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {entry.field}
            </Typography>
          </Stack>
          <LinkInput label="" defaultValue={entry.url} onChange={entry.setter} />
        </Box>
      ))}
    </Stack>
  );
}
