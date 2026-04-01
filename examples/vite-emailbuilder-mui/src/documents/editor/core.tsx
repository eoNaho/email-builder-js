import React from 'react';
import { z } from 'zod';

import { Accordion, AccordionPropsSchema } from '@usewaypoint/block-accordion';
import { Avatar, AvatarPropsSchema } from '@usewaypoint/block-avatar';
import { Countdown, CountdownPropsSchema } from '@usewaypoint/block-countdown';
import { LogoGrid, LogoGridPropsSchema } from '@usewaypoint/block-logo-grid';
import { Button, ButtonPropsSchema } from '@usewaypoint/block-button';
import { Divider, DividerPropsSchema } from '@usewaypoint/block-divider';
import { Footer, FooterPropsSchema } from '@usewaypoint/block-footer';
import { Heading, HeadingPropsSchema } from '@usewaypoint/block-heading';
import { Html, HtmlPropsSchema } from '@usewaypoint/block-html';
import { Image, ImagePropsSchema } from '@usewaypoint/block-image';
import { Navigation, NavigationPropsSchema } from '@usewaypoint/block-navigation';
import { ProgressBar, ProgressBarPropsSchema } from '@usewaypoint/block-progress-bar';
import { Rating, RatingPropsSchema } from '@usewaypoint/block-rating';
import { Social, SocialPropsSchema } from '@usewaypoint/block-social';
import { Spacer, SpacerPropsSchema } from '@usewaypoint/block-spacer';
import { Testimonial, TestimonialPropsSchema } from '@usewaypoint/block-testimonial';
import { Text, TextPropsSchema } from '@usewaypoint/block-text';
import { Video, VideoPropsSchema } from '@usewaypoint/block-video';
import {
  buildBlockComponent,
  buildBlockConfigurationDictionary,
  buildBlockConfigurationSchema,
} from '@usewaypoint/document-core';
import { ConditionalPropsSchema } from '@usewaypoint/email-builder';

import ColumnsContainerEditor from '../blocks/ColumnsContainer/ColumnsContainerEditor';
import ColumnsContainerPropsSchema from '../blocks/ColumnsContainer/ColumnsContainerPropsSchema';
import ConditionalEditor from '../blocks/Conditional/ConditionalEditor';
import ContainerEditor from '../blocks/Container/ContainerEditor';
import ContainerPropsSchema from '../blocks/Container/ContainerPropsSchema';
import EmailLayoutEditor from '../blocks/EmailLayout/EmailLayoutEditor';
import EmailLayoutPropsSchema from '../blocks/EmailLayout/EmailLayoutPropsSchema';
import RowEditor from '../blocks/Row/RowEditor';
import RowPropsSchema from '../blocks/Row/RowPropsSchema';
import EditorBlockWrapper from '../blocks/helpers/block-wrappers/EditorBlockWrapper';

const EDITOR_DICTIONARY = buildBlockConfigurationDictionary({
  Accordion: {
    schema: AccordionPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Accordion {...props} />
      </EditorBlockWrapper>
    ),
  },
  Countdown: {
    schema: CountdownPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Countdown {...props} />
      </EditorBlockWrapper>
    ),
  },
  LogoGrid: {
    schema: LogoGridPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <LogoGrid {...props} />
      </EditorBlockWrapper>
    ),
  },
  Conditional: {
    schema: ConditionalPropsSchema,
    Component: (p) => (
      <EditorBlockWrapper>
        <ConditionalEditor {...p} />
      </EditorBlockWrapper>
    ),
  },
  Row: {
    schema: RowPropsSchema,
    Component: (p) => (
      <EditorBlockWrapper>
        <RowEditor {...p} />
      </EditorBlockWrapper>
    ),
  },
  Avatar: {
    schema: AvatarPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Avatar {...props} />
      </EditorBlockWrapper>
    ),
  },
  Button: {
    schema: ButtonPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Button {...props} />
      </EditorBlockWrapper>
    ),
  },
  Container: {
    schema: ContainerPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <ContainerEditor {...props} />
      </EditorBlockWrapper>
    ),
  },
  ColumnsContainer: {
    schema: ColumnsContainerPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <ColumnsContainerEditor {...props} />
      </EditorBlockWrapper>
    ),
  },
  Heading: {
    schema: HeadingPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Heading {...props} />
      </EditorBlockWrapper>
    ),
  },
  Html: {
    schema: HtmlPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Html {...props} />
      </EditorBlockWrapper>
    ),
  },
  Image: {
    schema: ImagePropsSchema,
    Component: (data) => {
      const props = {
        ...data,
        props: {
          ...data.props,
          url: data.props?.url ?? 'https://placehold.co/600x400@2x/F8F8F8/CCC?text=Your%20image',
        },
      };
      return (
        <EditorBlockWrapper>
          <Image {...props} />
        </EditorBlockWrapper>
      );
    },
  },
  Text: {
    schema: TextPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Text {...props} />
      </EditorBlockWrapper>
    ),
  },
  EmailLayout: {
    schema: EmailLayoutPropsSchema,
    Component: (p) => <EmailLayoutEditor {...p} />,
  },
  Spacer: {
    schema: SpacerPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Spacer {...props} />
      </EditorBlockWrapper>
    ),
  },
  Divider: {
    schema: DividerPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Divider {...props} />
      </EditorBlockWrapper>
    ),
  },
  Footer: {
    schema: FooterPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Footer {...props} />
      </EditorBlockWrapper>
    ),
  },
  Navigation: {
    schema: NavigationPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Navigation {...props} />
      </EditorBlockWrapper>
    ),
  },
  Social: {
    schema: SocialPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Social {...props} />
      </EditorBlockWrapper>
    ),
  },
  Video: {
    schema: VideoPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Video {...props} />
      </EditorBlockWrapper>
    ),
  },
  Rating: {
    schema: RatingPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Rating {...props} />
      </EditorBlockWrapper>
    ),
  },
  ProgressBar: {
    schema: ProgressBarPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <ProgressBar {...props} />
      </EditorBlockWrapper>
    ),
  },
  Testimonial: {
    schema: TestimonialPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Testimonial {...props} />
      </EditorBlockWrapper>
    ),
  },
});

export const EditorBlock = buildBlockComponent(EDITOR_DICTIONARY);
export const EditorBlockSchema = buildBlockConfigurationSchema(EDITOR_DICTIONARY);
export const EditorConfigurationSchema = z.record(z.string(), EditorBlockSchema);

export type TEditorBlock = z.infer<typeof EditorBlockSchema>;
export type TEditorConfiguration = Record<string, TEditorBlock>;
