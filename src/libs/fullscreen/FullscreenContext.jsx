import { createContext } from 'react';

export const FullscreenContext = createContext(
  /** @type {ReturnType<import('./UseFullscreenContextValue').useFullscreenProvider>|null} */ (
    null
  ),
);
