import { useCallback, useRef } from 'react';

import { useAnimationFrame } from '@/libs/animationframe';

/**
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MutableRefObject<HTMLVideoElement|null>} props.videoRef
 * @param {() => import('react').ReactNode} [props.top]
 * @param {() => import('react').ReactNode} [props.bottom]
 * @param {() => import('react').ReactNode} [props.left]
 * @param {() => import('react').ReactNode} [props.right]
 * @param {() => import('react').ReactNode} props.center
 */
export default function RecorderBoothLayout({
  className,
  videoRef,
  top,
  left,
  bottom,
  right,
  center,
}) {
  const videoContainerRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const parentRef = useRef(/** @type {HTMLDivElement|null} */ (null));

  const handleAnimationFrame = useCallback(
    function onAnimationFrame() {
      const parent = parentRef.current;
      if (!parent) {
        return;
      }
      const videoContainer = videoContainerRef.current;
      const video = videoRef.current;
      if (!video || !videoContainer) {
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

      videoContainer.style.left = `${dx}px`;
      videoContainer.style.top = `${dy}px`;

      videoContainer.style.width = video.style.width = `${w * ratio}px`;
      videoContainer.style.height = video.style.height = `${h * ratio}px`;
    },
    [parentRef, videoRef],
  );

  useAnimationFrame(handleAnimationFrame);

  const xMarginClassName = 'relative';
  const yMarginClassName =
    'absolute w-full h-10' +
    ' ' +
    'overflow-y-hidden overflow-x-auto' +
    ' ' +
    'flex flex-row items-center whitespace-nowrap';

  return (
    <div
      className={
        'absolute left-0 top-0 flex h-full w-full py-10' + ' ' + className
      }>
      <div className={yMarginClassName + ' ' + 'left-0 top-0'}>{top?.()}</div>
      <div className={xMarginClassName}>{left?.()}</div>
      <div ref={parentRef} className="relative flex-1 overflow-hidden">
        <div
          ref={videoContainerRef}
          className={'absolute flex items-center border-4'}>
          {center?.()}
        </div>
      </div>
      <div className={xMarginClassName}>{right?.()}</div>
      <div className={yMarginClassName + ' ' + 'bottom-0 left-0'}>
        {bottom?.()}
      </div>
    </div>
  );
}
