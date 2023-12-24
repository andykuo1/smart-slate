import { useContext } from 'react';

import { VideoCacheContext } from './VideoCacheContext';

export function useVideoCache() {
  const result = useContext(VideoCacheContext);
  if (result === null) {
    throw new Error('Missing <VideoCacheProvider/>.');
  }
  return result;
}
