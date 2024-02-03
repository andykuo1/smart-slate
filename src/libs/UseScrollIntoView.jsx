import { useCallback } from 'react';

/**
 * @param {import('react').RefObject<HTMLElement>} containerRef
 */
export function useScrollIntoView(containerRef) {
  const handler = useCallback(
    /** @param {ScrollIntoViewOptions} [scrollIntoViewOptions] */
    function _handler(scrollIntoViewOptions) {
      // Debounce to wait for layout changes...
      setTimeout(
        () =>
          containerRef.current?.scrollIntoView?.({
            block: 'start',
            behavior: 'smooth',
            ...scrollIntoViewOptions,
          }),
        0,
      );
    },
    [containerRef],
  );
  return handler;
}
