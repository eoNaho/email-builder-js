import React, { CSSProperties } from 'react';
import { z } from 'zod';

import { COLOR_SCHEMA, MOBILE_OVERRIDES_SCHEMA, PADDING_SCHEMA, VISIBILITY_SCHEMA, getPadding } from '@usewaypoint/document-core';

export const VideoPropsSchema = z.object({
  style: z
    .object({
      padding: PADDING_SCHEMA,
      backgroundColor: COLOR_SCHEMA,
      textAlign: z.enum(['left', 'center', 'right']).optional().nullable(),
      borderRadius: z.number().optional().nullable(),
    })
    .optional()
    .nullable(),
  props: z
    .object({
      thumbnailUrl: z.string().optional().nullable(),
      videoUrl: z.string().optional().nullable(),
      alt: z.string().optional().nullable(),
      playButtonColor: z.string().optional().nullable(),
      playButtonBackgroundColor: z.string().optional().nullable(),
      width: z.number().optional().nullable(),
      height: z.number().optional().nullable(),
    })
    .optional()
    .nullable(),
  visibility: VISIBILITY_SCHEMA,
  mobileOverrides: MOBILE_OVERRIDES_SCHEMA,
});

export type VideoProps = z.infer<typeof VideoPropsSchema>;

export const VideoPropsDefaults = {
  thumbnailUrl: '',
  videoUrl: '',
  alt: 'Video thumbnail',
  playButtonColor: '#FFFFFF',
  playButtonBackgroundColor: '#FF0000',
  textAlign: 'center',
} as const;

export function Video({ style, props }: VideoProps) {
  const thumbnailUrl = props?.thumbnailUrl ?? VideoPropsDefaults.thumbnailUrl;
  const videoUrl = props?.videoUrl ?? VideoPropsDefaults.videoUrl;
  const alt = props?.alt ?? VideoPropsDefaults.alt;
  const playButtonColor = props?.playButtonColor ?? VideoPropsDefaults.playButtonColor;
  const playButtonBackgroundColor =
    props?.playButtonBackgroundColor ?? VideoPropsDefaults.playButtonBackgroundColor;
  const width = props?.width ?? undefined;
  const height = props?.height ?? undefined;
  const borderRadius = style?.borderRadius ?? undefined;

  const wrapperStyle: CSSProperties = {
    padding: getPadding(style?.padding),
    backgroundColor: style?.backgroundColor ?? undefined,
    textAlign: style?.textAlign ?? VideoPropsDefaults.textAlign,
  };

  const containerStyle: CSSProperties = {
    display: 'inline-block',
    position: 'relative',
    lineHeight: 0,
    maxWidth: '100%',
  };

  const imgStyle: CSSProperties = {
    display: 'block',
    outline: 'none',
    border: 'none',
    textDecoration: 'none',
    maxWidth: '100%',
    borderRadius: borderRadius !== undefined ? borderRadius : undefined,
    width: width ?? undefined,
    height: height ?? undefined,
  };

  // Play button circle container
  const playButtonWrapperStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 56,
    height: 56,
    borderRadius: '50%',
    backgroundColor: playButtonBackgroundColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: '56px',
    textAlign: 'center',
    pointerEvents: 'none',
  };

  // Triangle play icon via CSS border trick inside a span
  const triangleStyle: CSSProperties = {
    display: 'inline-block',
    width: 0,
    height: 0,
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderLeft: `18px solid ${playButtonColor}`,
    marginLeft: 4,
    verticalAlign: 'middle',
  };

  return (
    <div style={wrapperStyle}>
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-block', textDecoration: 'none', lineHeight: 0 }}
      >
        <div style={containerStyle}>
          <img
            src={thumbnailUrl}
            alt={alt}
            width={width}
            height={height}
            style={imgStyle}
          />
          <div style={playButtonWrapperStyle}>
            <span style={triangleStyle} />
          </div>
        </div>
      </a>
    </div>
  );
}
