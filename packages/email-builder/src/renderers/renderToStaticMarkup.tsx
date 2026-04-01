import React from 'react';
import { renderToStaticMarkup as baseRenderToStaticMarkup } from 'react-dom/server';

import Reader, { ReaderDocumentSchema, TReaderDocument } from '../Reader/core';

const EMAIL_HEAD = `<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<style>
body,#root{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
img{border:none;-ms-interpolation-mode:bicubic;max-width:100%;}
table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;}
td{mso-line-height-rule:exactly;}
a{color:inherit;}
.eb-desktop-only{display:block!important;}
.eb-mobile-only{display:none!important;}
@media only screen and (max-width:480px){
  .email-column,.eb-col{display:block!important;width:100%!important;}
  .eb-desktop-only{display:none!important;}
  .eb-mobile-only{display:block!important;}
}
@media (prefers-color-scheme:dark){
  .email-dark-bg{background-color:#1a1a1a!important;}
  .email-dark-text{color:#e0e0e0!important;}
}
</style>
</head>`;

type TOptions = {
  rootBlockId: string;
  /**
   * Optional variable substitution map. Keys are variable names (without braces),
   * values are the replacement strings.
   * Example: { firstName: 'John', company: 'Acme' } replaces {{firstName}} and {{company}}.
   */
  variables?: Record<string, string>;
};

function substituteVariables(html: string, variables: Record<string, string>): string {
  return html.replace(/\{\{([^}]+)\}\}/g, (match, name) => {
    const key = name.trim();
    return Object.prototype.hasOwnProperty.call(variables, key) ? variables[key] : match;
  });
}

export default function renderToStaticMarkup(document: TReaderDocument, { rootBlockId, variables }: TOptions) {
  const result = ReaderDocumentSchema.safeParse(document);
  if (!result.success) {
    throw new Error(`Invalid email document: ${result.error.message}`);
  }
  const bodyHtml = baseRenderToStaticMarkup(
    <Reader document={result.data} rootBlockId={rootBlockId} variables={variables} />
  );
  const html = `<!DOCTYPE html><html lang="en">${EMAIL_HEAD}<body>${bodyHtml}</body></html>`;
  if (variables && Object.keys(variables).length > 0) {
    return substituteVariables(html, variables);
  }
  return html;
}
