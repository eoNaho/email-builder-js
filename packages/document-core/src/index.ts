export { default as buildBlockComponent } from './builders/buildBlockComponent';
export { default as buildBlockConfigurationSchema } from './builders/buildBlockConfigurationSchema';
export { default as buildBlockConfigurationDictionary } from './builders/buildBlockConfigurationDictionary';

export { BlockConfiguration, DocumentBlocksDictionary } from './utils';
export { FONT_FAMILY_SCHEMA, getFontFamily, COLOR_SCHEMA, PADDING_SCHEMA, getPadding, VISIBILITY_SCHEMA, MOBILE_OVERRIDES_SCHEMA } from './shared';
export type { FontFamily, Color, Padding, Visibility, MobileOverrides } from './shared';

export { BrandKitSchema, LinkConfigSchema, UtmParamsSchema } from './callbacks';
export type { BrandKit, EmailBuilderCallbacks, LinkConfig, SavedRow, UtmParams, CountdownStyle } from './callbacks';
