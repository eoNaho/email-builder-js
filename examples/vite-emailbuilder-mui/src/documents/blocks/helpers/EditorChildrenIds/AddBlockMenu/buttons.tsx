import React from 'react';

import {
  AccountCircleOutlined,
  AppsOutlined,
  Crop32Outlined,
  DeviceHubOutlined,
  ExpandMoreOutlined,
  FormatQuoteOutlined,
  GradeOutlined,
  HMobiledataOutlined,
  HorizontalRuleOutlined,
  HtmlOutlined,
  ImageOutlined,
  LibraryAddOutlined,
  LinkOutlined,
  NotesOutlined,
  OndemandVideoOutlined,
  ShareOutlined,
  SmartButtonOutlined,
  SpeedOutlined,
  TableRowsOutlined,
  TimerOutlined,
  ViewColumnOutlined,
  WebOutlined,
} from '@mui/icons-material';

import { TEditorBlock } from '../../../../editor/core';

type TButtonProps = {
  label: string;
  icon: JSX.Element;
  block: () => TEditorBlock;
};
export const ROW_BUTTONS: TButtonProps[] = [
  {
    label: 'Row (1 col)',
    icon: <TableRowsOutlined />,
    block: () => ({
      type: 'Row',
      data: {
        props: {
          columnsCount: 1,
          columns: [{ childrenIds: [] }],
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Row (2 cols)',
    icon: <TableRowsOutlined />,
    block: () => ({
      type: 'Row',
      data: {
        props: {
          columnsCount: 2,
          columnsGap: 16,
          columns: [{ childrenIds: [] }, { childrenIds: [] }],
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Row (3 cols)',
    icon: <TableRowsOutlined />,
    block: () => ({
      type: 'Row',
      data: {
        props: {
          columnsCount: 3,
          columnsGap: 16,
          columns: [{ childrenIds: [] }, { childrenIds: [] }, { childrenIds: [] }],
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
];

export const CONTENT_BUTTONS: TButtonProps[] = [
  {
    label: 'Heading',
    icon: <HMobiledataOutlined />,
    block: () => ({
      type: 'Heading',
      data: {
        props: { text: 'Hello friend' },
        style: {
          padding: { top: 16, bottom: 16, left: 24, right: 24 },
        },
      },
    }),
  },
  {
    label: 'Text',
    icon: <NotesOutlined />,
    block: () => ({
      type: 'Text',
      data: {
        props: { text: 'My new text block' },
        style: {
          padding: { top: 16, bottom: 16, left: 24, right: 24 },
          fontWeight: 'normal',
        },
      },
    }),
  },

  {
    label: 'Button',
    icon: <SmartButtonOutlined />,
    block: () => ({
      type: 'Button',
      data: {
        props: {
          text: 'Button',
          url: 'https://www.usewaypoint.com',
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Image',
    icon: <ImageOutlined />,
    block: () => ({
      type: 'Image',
      data: {
        props: {
          url: 'https://assets.usewaypoint.com/sample-image.jpg',
          alt: 'Sample product',
          contentAlignment: 'middle',
          linkHref: null,
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Avatar',
    icon: <AccountCircleOutlined />,
    block: () => ({
      type: 'Avatar',
      data: {
        props: {
          imageUrl: 'https://ui-avatars.com/api/?size=128',
          shape: 'circle',
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Divider',
    icon: <HorizontalRuleOutlined />,
    block: () => ({
      type: 'Divider',
      data: {
        style: { padding: { top: 16, right: 0, bottom: 16, left: 0 } },
        props: {
          lineColor: '#CCCCCC',
        },
      },
    }),
  },
  {
    label: 'Spacer',
    icon: <Crop32Outlined />,
    block: () => ({
      type: 'Spacer',
      data: {},
    }),
  },
  {
    label: 'Html',
    icon: <HtmlOutlined />,
    block: () => ({
      type: 'Html',
      data: {
        props: { contents: '<strong>Hello world</strong>' },
        style: {
          fontSize: 16,
          textAlign: null,
          padding: { top: 16, bottom: 16, left: 24, right: 24 },
        },
      },
    }),
  },
  {
    label: 'Columns',
    icon: <ViewColumnOutlined />,
    block: () => ({
      type: 'ColumnsContainer',
      data: {
        props: {
          columnsGap: 16,
          columnsCount: 2,
          columns: [{ childrenIds: [] }, { childrenIds: [] }],
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Container',
    icon: <LibraryAddOutlined />,
    block: () => ({
      type: 'Container',
      data: {
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },

  {
    label: 'Social',
    icon: <ShareOutlined />,
    block: () => ({
      type: 'Social',
      data: {
        props: {
          platforms: [
            { platform: 'facebook', url: 'https://facebook.com' },
            { platform: 'twitter', url: 'https://twitter.com' },
            { platform: 'instagram', url: 'https://instagram.com' },
          ],
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Video',
    icon: <OndemandVideoOutlined />,
    block: () => ({
      type: 'Video',
      data: {
        props: {
          thumbnailUrl: 'https://placehold.co/600x340/F8F8F8/CCC?text=Video',
          videoUrl: 'https://www.youtube.com',
          alt: 'Watch video',
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Navigation',
    icon: <LinkOutlined />,
    block: () => ({
      type: 'Navigation',
      data: {
        props: {
          links: [
            { text: 'Home', url: '#' },
            { text: 'About', url: '#' },
            { text: 'Contact', url: '#' },
          ],
        },
        style: { padding: { top: 12, bottom: 12, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Footer',
    icon: <WebOutlined />,
    block: () => ({
      type: 'Footer',
      data: {
        props: {
          companyName: 'Company Name',
          address: '123 Main Street\nCity, State 12345',
          copyright: `© ${new Date().getFullYear()} Company Name`,
          unsubscribeUrl: '#',
          unsubscribeText: 'Unsubscribe',
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Conditional',
    icon: <DeviceHubOutlined />,
    block: () => ({
      type: 'Conditional',
      data: {
        props: {
          variable: '',
          operator: 'exists',
          value: '',
          childrenIds: [],
        },
      },
    }),
  },
  {
    label: 'Countdown',
    icon: <TimerOutlined />,
    block: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 7);
      const pad = (n: number) => String(n).padStart(2, '0');
      const targetDate = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T00:00`;
      return {
        type: 'Countdown',
        data: {
          props: {
            targetDate,
            expiredText: 'Offer expired',
            backgroundColor: '#1E3A5F',
            textColor: '#FFFFFF',
            fontSize: 32,
          },
          style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
        },
      };
    },
  },
  {
    label: 'Logo Grid',
    icon: <AppsOutlined />,
    block: () => ({
      type: 'LogoGrid',
      data: {
        props: {
          columns: 4,
          gap: 24,
          logoHeight: 40,
          logos: [
            { src: 'https://placehold.co/120x40/F8F8F8/CCC?text=Logo+1', alt: 'Logo 1', url: null },
            { src: 'https://placehold.co/120x40/F8F8F8/CCC?text=Logo+2', alt: 'Logo 2', url: null },
            { src: 'https://placehold.co/120x40/F8F8F8/CCC?text=Logo+3', alt: 'Logo 3', url: null },
            { src: 'https://placehold.co/120x40/F8F8F8/CCC?text=Logo+4', alt: 'Logo 4', url: null },
          ],
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Accordion',
    icon: <ExpandMoreOutlined />,
    block: () => ({
      type: 'Accordion',
      data: {
        props: {
          items: [
            { title: 'What is this?', content: 'A great product that will change your life.' },
            { title: 'How does it work?', content: 'Simply sign up and start using it today.' },
            { title: 'Is it free?', content: 'We offer a free trial with no credit card required.' },
          ],
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Rating',
    icon: <GradeOutlined />,
    block: () => ({
      type: 'Rating',
      data: {
        props: {
          rating: 4,
          maxStars: 5,
          starSize: 24,
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Progress Bar',
    icon: <SpeedOutlined />,
    block: () => ({
      type: 'ProgressBar',
      data: {
        props: {
          value: 70,
          showValue: true,
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Testimonial',
    icon: <FormatQuoteOutlined />,
    block: () => ({
      type: 'Testimonial',
      data: {
        props: {
          quote: 'This product changed my life. Highly recommended!',
          authorName: 'Jane Doe',
          authorTitle: 'CEO, Acme Corp',
          avatarUrl: null,
          rating: 5,
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
];

/** All buttons (rows + content) — used by inline BlocksMenu */
export const BUTTONS = [...ROW_BUTTONS, ...CONTENT_BUTTONS];
