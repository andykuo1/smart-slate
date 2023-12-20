import { useCallback, useEffect, useRef, useState } from 'react';

import {
  isExitFullscreenSupported,
  isRequestFullscreenSupported,
} from './UseFullscreen';

export function useFullscreenProvider() {
  const fullscreenTargetRef = useRef(/** @type {Element|null} */ (null));
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
      target.requestFullscreen().catch((e) => console.error(e));
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (isExitFullscreenSupported(document) && document.fullscreenElement) {
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
