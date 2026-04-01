import React, { createContext, useContext, useState } from 'react';

import { BrandKit } from '@usewaypoint/document-core';

type BrandKitContextValue = {
  brandKit: BrandKit;
  setBrandKit: (kit: BrandKit) => void;
};

const BrandKitContext = createContext<BrandKitContextValue>({
  brandKit: {},
  setBrandKit: () => {},
});

export function useBrandKit(): BrandKitContextValue {
  return useContext(BrandKitContext);
}

export function BrandKitProvider({ children }: { children: React.ReactNode }) {
  const [brandKit, setBrandKit] = useState<BrandKit>({});
  return <BrandKitContext.Provider value={{ brandKit, setBrandKit }}>{children}</BrandKitContext.Provider>;
}

export default BrandKitContext;
