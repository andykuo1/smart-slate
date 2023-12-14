import { useEffect, useRef } from 'react';
import { useContext } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { createContext } from 'react';

const FullscreenContext = createContext(
  /** @type {ReturnType<useFullscreenAPI>|null} */ (null),
);

function useFullscreenAPI() {
  const fullscreenTargetRef = useRef(/** @type {any} */ (document.body));
  const [isFullscreen, setIsFullscreen] = useState(false);

  const onFullscreenChange = useCallback(
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    },
    [setIsFullscreen],
  );

  const enterFullscreen = useCallback(() => {
    (fullscreenTargetRef.current || document.body).requestFullscreen();
  }, []);

  const exitFullscreen = useCallback(() => {
    document.exitFullscreen();
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, [onFullscreenChange]);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    fullscreenTargetRef,
  };
}

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export function FullscreenProvider({ children }) {
  const api = useFullscreenAPI();
  return (
    <FullscreenContext.Provider value={api}>
      {children}
    </FullscreenContext.Provider>
  );
}

export function useFullscreen() {
  let result = useContext(FullscreenContext);
  if (!result) {
    throw new Error('Missing <FullscreenProvider/>');
  }
  return result;
}
