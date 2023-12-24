import { useState } from 'react';
import { useEffect } from 'react';

import { initVideoCache } from './VideoCache';

export function useVideoCacheContextValue() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    initVideoCache()
      .then(() => setReady(true))
      .catch(() => setReady(false));
    return () => setReady(false);
  }, []);
  return ready;
}
