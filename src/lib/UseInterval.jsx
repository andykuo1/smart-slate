import { useEffect } from 'react';

/**
 * @param {Function} handler
 * @param {number} ms
 */
export function useInterval(handler, ms) {
  useEffect(() => {
    let handle = setInterval(handler, ms);
    return () => clearInterval(handle);
  }, [handler, ms]);
}
