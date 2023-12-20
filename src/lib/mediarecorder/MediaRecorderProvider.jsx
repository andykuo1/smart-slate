import { useRef } from 'react';

import { MediaRecorderContext } from './MediaRecorderContext';
import { useMediaRecorderContextValue } from './UseMediaRecorderContextValue';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export function MediaRecorderProvider({ children }) {
  const callbackRef = useRef(/** @type {Function|null} */ (null));
  const value = useMediaRecorderContextValue(callbackRef);
  return (
    <MediaRecorderContext.Provider value={value}>
      {children}
    </MediaRecorderContext.Provider>
  );
}
