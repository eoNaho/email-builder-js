import { createContext, useContext } from 'react';

const VariablesContext = createContext<Record<string, string>>({});

export function useVariables() {
  return useContext(VariablesContext);
}

export default VariablesContext;
