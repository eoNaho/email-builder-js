import { createContext, useContext } from 'react';

import { EmailBuilderCallbacks } from '@usewaypoint/document-core';

const CallbacksContext = createContext<EmailBuilderCallbacks>({});

export function useCallbacks(): EmailBuilderCallbacks {
  return useContext(CallbacksContext);
}

export default CallbacksContext;
