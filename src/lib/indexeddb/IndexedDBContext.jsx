import { createContext } from 'react';

export const IndexedDBContext = createContext(
  /** @type {ReturnType<import('./UseIndexedDBContextValue').useIndexedDBContextValue>|null} */ (
    null
  ),
);
