import InstallDesktopIcon from '@material-symbols/svg-400/rounded/install_desktop.svg';
import InstallMobileIcon from '@material-symbols/svg-400/rounded/install_mobile.svg';

import { tryGetWindow } from '@/recorder/UseMediaStream';

export function tryGetUserAgent() {
  const window = tryGetWindow();
  return (window.navigator?.userAgent || '').toLowerCase();
}

export function isAppleMobileDevice(userAgent = tryGetUserAgent()) {
  // Detects if device is on iOS
  return /iphone|ipad|ipod/.test(userAgent);
}

export function isAndroidMobileDevice(userAgent = tryGetUserAgent()) {
  // Detects if device is on Android
  return /android/.test(userAgent);
}

export function isDesktopDevice(userAgent = tryGetUserAgent()) {
  // Detects if device is on desktop
  return /mac os|windows|cros|ubuntu/.test(userAgent);
}

export function isStandaloneMode() {
  // Detects if device is in standalone mode
  const window = tryGetWindow();
  return 'standalone' in window.navigator && window.navigator?.standalone;
}

export function getDeviceInstallIcon() {
  const userAgent = tryGetUserAgent();
  if (isAppleMobileDevice(userAgent) || isAndroidMobileDevice(userAgent)) {
    return InstallMobileIcon;
  } else if (isDesktopDevice(userAgent)) {
    return InstallDesktopIcon;
  } else {
    return InstallMobileIcon;
  }
}
