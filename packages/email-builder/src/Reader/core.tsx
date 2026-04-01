import React, { Component, ReactNode, createContext, useContext } from 'react';

import VariablesContext from '../VariablesContext';
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

import ColumnsContainerPropsSchema from '../blocks/ColumnsContainer/ColumnsContainerPropsSchema';
import ColumnsContainerReader from '../blocks/ColumnsContainer/ColumnsContainerReader';
import ConditionalPropsSchema from '../blocks/Conditional/ConditionalPropsSchema';
import ConditionalReader from '../blocks/Conditional/ConditionalReader';
import { ContainerPropsSchema } from '../blocks/Container/ContainerPropsSchema';
import ContainerReader from '../blocks/Container/ContainerReader';
import { EmailLayoutPropsSchema } from '../blocks/EmailLayout/EmailLayoutPropsSchema';
import EmailLayoutReader from '../blocks/EmailLayout/EmailLayoutReader';
import RowPropsSchema from '../blocks/Row/RowPropsSchema';
import RowReader from '../blocks/Row/RowReader';

const ReaderContext = createContext<TReaderDocument>({});

function useReaderDocument() {
  return useContext(ReaderContext);
}

const READER_DICTIONARY = buildBlockConfigurationDictionary({
  Accordion: {
    schema: AccordionPropsSchema,
    Component: Accordion,
  },
  Countdown: {
    schema: CountdownPropsSchema,
    Component: Countdown,
  },
  LogoGrid: {
    schema: LogoGridPropsSchema,
    Component: LogoGrid,
  },
  Conditional: {
    schema: ConditionalPropsSchema,
    Component: ConditionalReader,
  },
  Row: {
    schema: RowPropsSchema,
    Component: RowReader,
  },
  ColumnsContainer: {
    schema: ColumnsContainerPropsSchema,
    Component: ColumnsContainerReader,
  },
  Container: {
    schema: ContainerPropsSchema,
    Component: ContainerReader,
  },
  EmailLayout: {
    schema: EmailLayoutPropsSchema,
    Component: EmailLayoutReader,
  },
  //
  Avatar: {
    schema: AvatarPropsSchema,
    Component: Avatar,
  },
  Button: {
    schema: ButtonPropsSchema,
    Component: Button,
  },
  Divider: {
    schema: DividerPropsSchema,
    Component: Divider,
  },
  Heading: {
    schema: HeadingPropsSchema,
    Component: Heading,
  },
  Html: {
    schema: HtmlPropsSchema,
    Component: Html,
  },
  Image: {
    schema: ImagePropsSchema,
    Component: Image,
  },
  Spacer: {
    schema: SpacerPropsSchema,
    Component: Spacer,
  },
  Text: {
    schema: TextPropsSchema,
    Component: Text,
  },
  Footer: {
    schema: FooterPropsSchema,
    Component: Footer,
  },
  Navigation: {
    schema: NavigationPropsSchema,
    Component: Navigation,
  },
  Social: {
    schema: SocialPropsSchema,
    Component: Social,
  },
  Video: {
    schema: VideoPropsSchema,
    Component: Video,
  },
  Rating: {
    schema: RatingPropsSchema,
    Component: Rating,
  },
  ProgressBar: {
    schema: ProgressBarPropsSchema,
    Component: ProgressBar,
  },
  Testimonial: {
    schema: TestimonialPropsSchema,
    Component: Testimonial,
  },
});

export const ReaderBlockSchema = buildBlockConfigurationSchema(READER_DICTIONARY);
export type TReaderBlock = z.infer<typeof ReaderBlockSchema>;

export const ReaderDocumentSchema = z.record(z.string(), ReaderBlockSchema);
export type TReaderDocument = Record<string, TReaderBlock>;

const BaseReaderBlock = buildBlockComponent(READER_DICTIONARY);

type ReaderErrorBoundaryState = { hasError: boolean; error: Error | null };

class ReaderErrorBoundary extends Component<{ children: ReactNode }, ReaderErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ReaderErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export type TReaderBlockProps = { id: string };
export function ReaderBlock({ id }: TReaderBlockProps) {
  const document = useReaderDocument();
  const block = document[id];
  if (!block) {
    return null;
  }
  return <BaseReaderBlock {...block} />;
}

export type TReaderProps = {
  document: Record<string, z.infer<typeof ReaderBlockSchema>>;
  rootBlockId: string;
  variables?: Record<string, string>;
};
export default function Reader({ document, rootBlockId, variables }: TReaderProps) {
  return (
    <ReaderErrorBoundary>
      <VariablesContext.Provider value={variables ?? {}}>
        <ReaderContext.Provider value={document}>
          <ReaderBlock id={rootBlockId} />
        </ReaderContext.Provider>
      </VariablesContext.Provider>
    </ReaderErrorBoundary>
  );
}
