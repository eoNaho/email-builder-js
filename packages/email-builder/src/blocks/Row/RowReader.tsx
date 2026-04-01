import React from 'react';

import { Row as BaseRow } from '@usewaypoint/block-row';

import { ReaderBlock } from '../../Reader/core';

import { RowProps } from './RowPropsSchema';

export default function RowReader({ style, props }: RowProps) {
  const { columns, ...restProps } = props ?? {};
  const columnsCount = props?.columnsCount ?? 1;

  let cols: (JSX.Element | JSX.Element[] | null)[] | undefined;
  if (columns && columns.length > 0) {
    cols = columns.map((col) =>
      col.childrenIds.map((childId) => <ReaderBlock key={childId} id={childId} />)
    );
  } else {
    cols = Array.from({ length: columnsCount }, () => null);
  }

  return <BaseRow style={style} props={{ ...restProps, columns: columns ?? undefined }} columns={cols} />;
}
