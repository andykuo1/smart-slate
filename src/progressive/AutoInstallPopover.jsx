import {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverDescription,
  PopoverHeading,
  PopoverProvider,
  usePopoverContext,
} from '@ariakit/react';
import { useEffect } from 'react';

import InstallDesktopIcon from '@material-symbols/svg-400/rounded/install_desktop.svg';
import InstallMobileIcon from '@material-symbols/svg-400/rounded/install_mobile.svg';

import Style from './AutoInstallPopover.module.css';
import MoreVertIcon from './material-more-vert.svg';
import PlusSquare from './sf-plus-square.svg';
import SquareAndArrowUp from './sf-square-and-arrow-up.svg';

export default function AutoInstallPopover() {
  return (
    <PopoverProvider>
      <PopoverAutoDisclosureOnApple />
      <PopoverAnchor className="fixed top-0 right-0" />
      <Popover className={Style.popover}>
        <PopoverArrow className={Style.arrow} />
        {isAppleMobileDevice() ? (
          <PopoverContentApple />
        ) : isAndroidMobileDevice() ? (
          <PopoverContentAndroid />
        ) : isDesktopDevice() ? (
          <PopoverContentDesktop />
        ) : (
          <PopoverContentUnknown />
        )}
      </Popover>
    </PopoverProvider>
  );
}

function PopoverContentUnknown() {
  return (
    <>
      <PopoverHeading>Install on your device</PopoverHeading>
      <PopoverDescription>
        <p>
          You have a fancy device-- <b>we didn't recognize it!</b>
        </p>
        <br />
        <p>
          You can install this app on:
          <ul>
            <li>
              -{' '}
              <InstallDesktopIcon className="inline-block fill-white w-6 h-6 mx-1" />{' '}
              Desktop
            </li>
            <li>
              -{' '}
              <InstallMobileIcon className="inline-block fill-white w-6 h-6 mx-1" />{' '}
              Mobile
            </li>
            <li>
              - Or even iOS (in{' '}
              <SquareAndArrowUp className="inline-block mx-1" /> Share)
            </li>
          </ul>
        </p>
        <br />
        <p>🎉 Happy filming!</p>
      </PopoverDescription>
    </>
  );
}

function PopoverContentDesktop() {
  return (
    <>
      <PopoverHeading>Install on your desktop</PopoverHeading>
      <PopoverDescription>
        <div>
          <span className="mx-2">1.</span>
          Click{' '}
          <InstallDesktopIcon className="inline-block fill-white w-6 h-6 mx-1" />
        </div>
        <div>
          <span className="mx-2">2.</span>
          Select <span className="border rounded-full px-2">Install</span>
        </div>
        <div>
          <span className="mx-2">3.</span>
          🎉 Happy filming!
        </div>
      </PopoverDescription>
    </>
  );
}

function PopoverContentApple() {
  return (
    <>
      <PopoverHeading>Install on your iPhone</PopoverHeading>
      <PopoverDescription>
        <div>
          <span className="mx-2">1.</span>
          Tap <SquareAndArrowUp className="inline-block mx-1" /> Share and
        </div>
        <div>
          <span className="mx-2">2.</span>
          Pick <PlusSquare className="inline-block mx-1" /> Add to Home Screen
        </div>
        <div>
          <span className="mx-2">3.</span>
          🎉 Happy filming!
        </div>
      </PopoverDescription>
    </>
  );
}

function PopoverContentAndroid() {
  return (
    <>
      <PopoverHeading>Install on your Android device</PopoverHeading>
      <PopoverDescription>
        <div>
          <span className="mx-2">1.</span>
          Open{' '}
          <MoreVertIcon className="inline-block fill-white w-6 h-6 -mx-1" />{' '}
          Menu
        </div>
        <div>
          <span className="mx-2">2.</span>
          Pick{' '}
          <InstallMobileIcon className="inline-block fill-white w-6 h-6 mx-1" />{' '}
          Install app
        </div>
        <div>
          <span className="mx-2">3.</span>
          🎉 Happy filming!
        </div>
      </PopoverDescription>
    </>
  );
}

function PopoverAutoDisclosureOnApple() {
  const store = usePopoverContext();
  useEffect(() => {
    store?.show();
    if (!isStandaloneMode()) {
      store?.show();
    }
  }, [store]);
  return null;
}

function isAppleMobileDevice() {
  // Detects if device is on iOS
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

function isAndroidMobileDevice() {
  // Detects if device is on Android
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /android/.test(userAgent);
}

function isDesktopDevice() {
  // Detects if device is on desktop
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /mac os|windows|cros|ubuntu/.test(userAgent);
}

function isStandaloneMode() {
  // Detects if device is in standalone mode
  return 'standalone' in window.navigator && window.navigator.standalone;
}
