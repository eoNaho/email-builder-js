import { ReaderDocumentSchema, TReaderDocument } from '../Reader/core';

function extractText(block: unknown): string {
  if (!block || typeof block !== 'object') return '';
  const b = block as Record<string, unknown>;
  const props = b.props as Record<string, unknown> | undefined;
  const type = b.type as string | undefined;

  if (!type || !props) return '';

  const lines: string[] = [];

  switch (type) {
    case 'Heading':
    case 'Text': {
      const text = (props as { text?: string }).text;
      if (text) lines.push(text.replace(/<[^>]+>/g, '').trim());
      break;
    }
    case 'Button': {
      const btnProps = props as { text?: string; url?: string };
      if (btnProps.text) lines.push(`[${btnProps.text}](${btnProps.url ?? ''})`);
      break;
    }
    case 'Image': {
      const imgProps = props as { alt?: string; url?: string; linkHref?: string };
      const desc = imgProps.alt ?? 'Image';
      const href = imgProps.linkHref ?? imgProps.url ?? '';
      lines.push(href ? `[${desc}](${href})` : desc);
      break;
    }
    case 'Html': {
      const htmlProps = props as { contents?: string };
      if (htmlProps.contents) {
        lines.push(htmlProps.contents.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
      }
      break;
    }
    case 'Divider':
      lines.push('---');
      break;
    case 'Footer': {
      const fProps = props as { companyName?: string; address?: string; copyright?: string; unsubscribeUrl?: string; unsubscribeText?: string };
      if (fProps.companyName) lines.push(fProps.companyName);
      if (fProps.address) lines.push(fProps.address);
      if (fProps.copyright) lines.push(fProps.copyright);
      if (fProps.unsubscribeUrl) lines.push(`${fProps.unsubscribeText ?? 'Unsubscribe'}: ${fProps.unsubscribeUrl}`);
      break;
    }
    case 'Navigation': {
      const navProps = props as { links?: { text: string; url: string }[] };
      if (navProps.links) {
        lines.push(navProps.links.map((l) => `${l.text} (${l.url})`).join(' | '));
      }
      break;
    }
    case 'Social': {
      const socProps = props as { platforms?: { platform: string; url: string }[] };
      if (socProps.platforms) {
        lines.push(socProps.platforms.map((p) => `${p.platform}: ${p.url}`).join('\n'));
      }
      break;
    }
    case 'Video': {
      const vidProps = props as { alt?: string; videoUrl?: string };
      lines.push(`[Video: ${vidProps.alt ?? 'Watch'}](${vidProps.videoUrl ?? ''})`);
      break;
    }
    default:
      break;
  }

  return lines.join('\n');
}

type TOptions = {
  rootBlockId: string;
};

export default function renderToPlainText(document: TReaderDocument, { rootBlockId }: TOptions): string {
  const result = ReaderDocumentSchema.safeParse(document);
  if (!result.success) {
    throw new Error(`Invalid email document: ${result.error.message}`);
  }

  const doc = result.data;
  const lines: string[] = [];

  function visitBlock(id: string) {
    const block = doc[id];
    if (!block) return;

    const text = extractText(block);
    if (text) lines.push(text);

    // Visit children for container blocks
    const data = block.data as Record<string, unknown> | undefined;
    const props = data?.props as Record<string, unknown> | undefined;

    if (block.type === 'Container' || block.type === 'EmailLayout') {
      const childrenIds = props?.childrenIds as string[] | undefined;
      if (childrenIds) childrenIds.forEach(visitBlock);
    } else if (block.type === 'ColumnsContainer') {
      const columns = props?.columns as { childrenIds: string[] }[] | undefined;
      if (columns) columns.forEach((col) => col.childrenIds.forEach(visitBlock));
    }
  }

  visitBlock(rootBlockId);
  return lines.filter((l) => l.trim()).join('\n\n');
}
