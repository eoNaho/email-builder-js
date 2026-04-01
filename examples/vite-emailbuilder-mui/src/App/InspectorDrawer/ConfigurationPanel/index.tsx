import React from 'react';

import { Box, Typography } from '@mui/material';

import { TEditorBlock } from '../../../documents/editor/core';
import { setDocument, useDocument, useSelectedBlockId } from '../../../documents/editor/EditorContext';

import AccordionSidebarPanel from './input-panels/AccordionSidebarPanel';
import AvatarSidebarPanel from './input-panels/AvatarSidebarPanel';
import CountdownSidebarPanel from './input-panels/CountdownSidebarPanel';
import LogoGridSidebarPanel from './input-panels/LogoGridSidebarPanel';
import ConditionalSidebarPanel from './input-panels/ConditionalSidebarPanel';
import RowSidebarPanel from './input-panels/RowSidebarPanel';
import ButtonSidebarPanel from './input-panels/ButtonSidebarPanel';
import ColumnsContainerSidebarPanel from './input-panels/ColumnsContainerSidebarPanel';
import ContainerSidebarPanel from './input-panels/ContainerSidebarPanel';
import DividerSidebarPanel from './input-panels/DividerSidebarPanel';
import EmailLayoutSidebarPanel from './input-panels/EmailLayoutSidebarPanel';
import FooterSidebarPanel from './input-panels/FooterSidebarPanel';
import HeadingSidebarPanel from './input-panels/HeadingSidebarPanel';
import HtmlSidebarPanel from './input-panels/HtmlSidebarPanel';
import ImageSidebarPanel from './input-panels/ImageSidebarPanel';
import NavigationSidebarPanel from './input-panels/NavigationSidebarPanel';
import SocialSidebarPanel from './input-panels/SocialSidebarPanel';
import SpacerSidebarPanel from './input-panels/SpacerSidebarPanel';
import TextSidebarPanel from './input-panels/TextSidebarPanel';
import VideoSidebarPanel from './input-panels/VideoSidebarPanel';
import RatingSidebarPanel from './input-panels/RatingSidebarPanel';
import ProgressBarSidebarPanel from './input-panels/ProgressBarSidebarPanel';
import TestimonialSidebarPanel from './input-panels/TestimonialSidebarPanel';

function renderMessage(val: string) {
  return (
    <Box sx={{ m: 3, p: 1, border: '1px dashed', borderColor: 'divider' }}>
      <Typography color="text.secondary">{val}</Typography>
    </Box>
  );
}

export default function ConfigurationPanel() {
  const document = useDocument();
  const selectedBlockId = useSelectedBlockId();

  if (!selectedBlockId) {
    return renderMessage('Click on a block to inspect.');
  }
  const block = document[selectedBlockId];
  if (!block) {
    return renderMessage(`Block with id ${selectedBlockId} was not found. Click on a block to reset.`);
  }

  const setBlock = (conf: TEditorBlock) => setDocument({ [selectedBlockId]: conf });
  const { data, type } = block;
  switch (type) {
    case 'Accordion':
      return <AccordionSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Countdown':
      return <CountdownSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'LogoGrid':
      return <LogoGridSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Conditional':
      return <ConditionalSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Row':
      return <RowSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Avatar':
      return <AvatarSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Button':
      return <ButtonSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'ColumnsContainer':
      return (
        <ColumnsContainerSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />
      );
    case 'Container':
      return <ContainerSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Divider':
      return <DividerSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Heading':
      return <HeadingSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Html':
      return <HtmlSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Image':
      return <ImageSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'EmailLayout':
      return <EmailLayoutSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Spacer':
      return <SpacerSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Text':
      return <TextSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Footer':
      return <FooterSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Navigation':
      return <NavigationSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Social':
      return <SocialSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Video':
      return <VideoSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Rating':
      return <RatingSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'ProgressBar':
      return <ProgressBarSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    case 'Testimonial':
      return <TestimonialSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    default:
      return <pre>{JSON.stringify(block, null, '  ')}</pre>;
  }
}
