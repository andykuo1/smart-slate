import { useCallback, useRef } from 'react';

import { useAnimationFrame } from '@/libs/animationframe';

/**
 * @callback VideoLayoutCenterRenderProp
 * @param {object} props
 * @param {string} props.className
 * @returns {import('react').ReactNode}
 */

/**
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MutableRefObject<HTMLVideoElement|null>} props.videoRef
 * @param {() => import('react').ReactNode} [props.top]
 * @param {() => import('react').ReactNode} [props.bottom]
 * @param {() => import('react').ReactNode} [props.left]
 * @param {() => import('react').ReactNode} [props.right]
 * @param {VideoLayoutCenterRenderProp} props.center
 */
export default function VideoRecorderBoothLayout({
  className,
  videoRef,
  top,
  left,
  bottom,
  right,
  center,
}) {
  const parentRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const videoClassName = 'absolute';

  const handleAnimationFrame = useCallback(
    function onAnimationFrame() {
      const parent = parentRef.current;
      if (!parent) {
        return;
      }
      const video = videoRef.current;
      if (!video) {
        return;
      }

      const rect = parent.getBoundingClientRect();

      const toWidth = rect.width;
      const toHeight = rect.height;
      const w = 16;
      const h = 9;
      const hr = toWidth / w;
      const wr = toHeight / h;
      const ratio = Math.min(hr, wr);

      const dx = (toWidth - w * ratio) / 2;
      const dy = (toHeight - h * ratio) / 2;

      video.style.left = `${dx}px`;
      video.style.top = `${dy}px`;
      video.style.width = `${w * ratio}px`;
      video.style.height = `${h * ratio}px`;
    },
    [parentRef, videoRef],
  );

  useAnimationFrame(handleAnimationFrame);

  const xMarginClassName = 'relative w-10 overflow-y-auto overflow-x-hidden';
  const yMarginClassName =
    'absolute w-full h-10' +
    ' ' +
    'overflow-y-hidden overflow-x-auto' +
    ' ' +
    'flex flex-row items-center whitespace-nowrap';

  return (
    <div
      className={
        'absolute w-full h-full top-0 left-0 flex py-10' + ' ' + className
      }>
      <div className={yMarginClassName + ' ' + 'top-0 left-0'}>{top?.()}</div>
      <div className={xMarginClassName}>{left?.()}</div>
      <div ref={parentRef} className="relative flex-1 overflow-hidden">
        {center?.({ className: videoClassName })}
      </div>
      <div className={xMarginClassName}>{right?.()}</div>
      <div className={yMarginClassName + ' ' + 'bottom-0 left-0'}>
        {bottom?.()}
      </div>
    </div>
  );
}
