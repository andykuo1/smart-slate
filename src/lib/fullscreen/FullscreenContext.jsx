import { useEffect, useRef } from 'react';
import { useContext } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { createContext } from 'react';

const FullscreenContext = createContext(
  /** @type {ReturnType<useFullscreenAPI>|null} */ (null),
);

function useFullscreenAPI() {
  const fullscreenTargetRef = useRef(/** @type {any} */ (null));
  const [isFullscreen, setIsFullscreen] = useState(false);

  const onFullscreenChange = useCallback(
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    },
    [setIsFullscreen],
  );

  const enterFullscreen = useCallback(() => {
    let target = fullscreenTargetRef.current || document.body;
    if (isRequestFullscreenSupported(target)) {
      target.requestFullscreen();
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (isExitFullscreenSupported(document)) {
      document.exitFullscreen();
    }
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

/**
 * @param {HTMLElement} targetElement
 */
export function isRequestFullscreenSupported(targetElement) {
  return typeof targetElement?.['requestFullscreen'] === 'function';
}

/**
 * @param {Document} targetElement
 */
export function isExitFullscreenSupported(targetElement) {
  return typeof targetElement?.['exitFullscreen'] === 'function';
}
