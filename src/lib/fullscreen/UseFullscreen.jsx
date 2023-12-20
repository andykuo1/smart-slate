import { useContext } from 'react';

import { FullscreenContext } from './FullscreenContext';

export function useFullscreen() {
  let result = useContext(FullscreenContext);
  if (!result) {
    throw new Error('Missing <FullscreenProvider/>');
  }
  return result;
}

/**
 * @param {Element} targetElement
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
