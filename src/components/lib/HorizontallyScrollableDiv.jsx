import { useCallback } from 'react';

/**
 * @param {object} props
 * @param {string} props.className
 * @param {import('react').ReactNode} [props.children]
 * @returns
 */
export default function HorizontallyScrollableDiv({ className, children }) {
  // HACK: So we can vertical scroll horizontally in minimap.
  const onWheel = useCallback(
    /** @type {import('react').WheelEventHandler} */
    function onWheel(event) {
      event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
      event.preventDefault();
      event.stopPropagation();
    },
    [],
  );
  return (
    <div
      className={
        'overflow-x-auto overflow-y-hidden overscroll-none' + ' ' + className
      }
      onWheel={onWheel}>
      {children}
    </div>
  );
}
