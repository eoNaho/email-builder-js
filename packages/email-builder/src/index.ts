export { default as renderToStaticMarkup } from './renderers/renderToStaticMarkup';
export { default as renderToPlainText } from './renderers/renderToPlainText';
export { default as calculateEmailWeight } from './renderers/calculateEmailWeight';
export type { EmailWeightResult } from './renderers/calculateEmailWeight';
export { default as ConditionalPropsSchema } from './blocks/Conditional/ConditionalPropsSchema';
export type { ConditionalProps } from './blocks/Conditional/ConditionalPropsSchema';
export { default as RowPropsSchema } from './blocks/Row/RowPropsSchema';
export type { RowProps } from './blocks/Row/RowPropsSchema';
export { migrateDocumentToRows } from './utils/migrateDocumentToRows';

export {
  ReaderBlockSchema,
  TReaderBlock,
  //
  ReaderDocumentSchema,
  TReaderDocument,
  //
  ReaderBlock,
  TReaderBlockProps,
  //
  TReaderProps,
  default as Reader,
} from './Reader/core';
