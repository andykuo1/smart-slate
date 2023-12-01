'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import ShotTakeInfo from '@/components/ShotTakeInfo';
import { useAnimationFrame } from '@/hooks/animationframe';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function Clapper({ className }) {
  return (
    <div
      className={
        'flex flex-col w-full h-full overflow-hidden' + ' ' + className
      }>
      <p className="bg-black border-2 p-2 border-white text-red-500 text-[10vh]">
        <TimeCode />
      </p>
      <ShotTakeInfo />
    </div>
  );
}

function TimeCode() {
  /** @type {import('react').RefObject<Function|null>} */
  const timeCallbackRef = useRef(null);

  const animationFrameCallback = useCallback(() => {
    let now = Date.now();
    if (timeCallbackRef.current) {
      timeCallbackRef.current(now);
    }
  }, [timeCallbackRef]);
  useAnimationFrame(animationFrameCallback);

  return (
    <span>
      <TimeString timeCallbackRef={timeCallbackRef} />
    </span>
  );
}

/**
 * @param {object} props
 * @param {import('react').RefObject<Function|null>} props.timeCallbackRef
 */
function TimeString({ timeCallbackRef }) {
  const [time, setTime] = useState(0);
  useEffect(() => {
    timeCallbackRef.current = setTime;
  }, [timeCallbackRef, setTime]);
  return <>{new Date(time).toString()}</>;
}
