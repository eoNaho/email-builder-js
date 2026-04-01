import React from 'react';

import { Visibility } from '@usewaypoint/document-core';

type Props = {
  visibility?: Visibility;
  children: React.ReactNode;
};

/**
 * Wraps a block's output with a CSS class that controls visibility
 * based on the device type (desktop vs mobile).
 *
 * CSS classes are injected in the email <head> by renderToStaticMarkup:
 *   .eb-desktop-only { display: block !important; }  (hidden on mobile)
 *   .eb-mobile-only  { display: none !important; }   (hidden on desktop)
 */
export default function VisibilityWrapper({ visibility, children }: Props) {
  if (!visibility || visibility === 'all') {
    return <>{children}</>;
  }

  const className = visibility === 'desktop-only' ? 'eb-desktop-only' : 'eb-mobile-only';
  return <div className={className}>{children}</div>;
}
