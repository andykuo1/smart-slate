import { useEffect, useState } from 'react';

import { tryGetWindow } from '@/utils/BrowserFeatures';

/**
 * @param {string} mediaQueryString
 */
export function useMatchMedia(mediaQueryString) {
  const [state, setState] = useState(false);
  useEffect(() => {
    const window = tryGetWindow();
    const matcher = window.matchMedia(mediaQueryString);
    const result = matcher.matches;
    if (result !== state) {
      setState(result);
      return;
    }
    /** @param {MediaQueryListEvent} e */
    function onChange(e) {
      setState(e.matches);
    }
    matcher.addEventListener('change', onChange);
    return () => matcher.removeEventListener('change', onChange);
  }, [mediaQueryString, state, setState]);
  return state;
}
