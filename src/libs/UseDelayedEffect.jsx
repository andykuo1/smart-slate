import { useCallback, useEffect, useRef } from 'react';

/**
 * @param {import('react').EffectCallback} callback
 * @param {number} delayedMillis
 * @param {boolean} [once]
 */
export function useDelayedEffect(callback, delayedMillis, once = true) {
  const delayedRef = useRef(0);

  const onTimeout = useCallback(
    function _onTimeout() {
      if (!once) {
        delayedRef.current = Number.POSITIVE_INFINITY;
      } else {
        delayedRef.current = 0;
      }
      callback();
    },
    [callback],
  );

  useEffect(() => {
    let remainingMillis = delayedMillis - delayedRef.current;
    if (!Number.isFinite(remainingMillis)) {
      return;
    }
    if (remainingMillis <= 0) {
      onTimeout();
      return;
    }
    const now = performance.now();
    const timeoutHandle = setTimeout(onTimeout, remainingMillis);
    return () => {
      clearTimeout(timeoutHandle);
      const elapsed = performance.now() - now;
      delayedRef.current += elapsed;
    };
  }, [onTimeout, delayedMillis]);
}
