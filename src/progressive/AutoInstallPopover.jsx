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

import PopoverStyle from '@/styles/Popover.module.css';

import {
  isAndroidMobileDevice,
  isAppleMobileDevice,
  isDesktopDevice,
  isStandaloneMode,
} from './DeviceHelper';
import MoreVertIcon from './material-more-vert.svg';
import PlusSquare from './sf-plus-square.svg';
import SquareAndArrowUp from './sf-square-and-arrow-up.svg';

/**
 * @param {object} props
 * @param {boolean} [props.autoDisclose]
 * @param {import('react').ReactNode} [props.content]
 * @param {import('react').ReactNode} [props.children]
 */
export default function AutoInstallPopover({
  autoDisclose = true,
  content,
  children,
}) {
  return (
    <PopoverProvider>
      {autoDisclose && <PopoverAutoDisclosure />}
      <PopoverAnchor className="fixed right-0 top-0" />
      <Popover className={PopoverStyle.popover}>
        <PopoverArrow className={PopoverStyle.arrow} />
        {isAppleMobileDevice() ? (
          <PopoverContentApple />
        ) : isAndroidMobileDevice() ? (
          <PopoverContentAndroid />
        ) : isDesktopDevice() ? (
          <PopoverContentDesktop />
        ) : (
          <PopoverContentUnknown />
        )}
        {content}
      </Popover>
      {children}
    </PopoverProvider>
  );
}

function PopoverContentUnknown() {
  return (
    <>
      <PopoverHeading>Install on your device</PopoverHeading>
      <PopoverDescription>
        <span className="block">
          You have a fancy device-- <b>we didn't recognize it!</b>
        </span>
        <br />
        <span className="block">
          You can install this app on:
          <span className="block">
            -{' '}
            <InstallDesktopIcon className="mx-1 inline-block h-6 w-6 fill-white" />{' '}
            Desktop
          </span>
          <span className="block">
            -{' '}
            <InstallMobileIcon className="mx-1 inline-block h-6 w-6 fill-white" />{' '}
            Mobile
          </span>
          <span className="block">
            - Or even iOS (in <SquareAndArrowUp className="mx-1 inline-block" />{' '}
            Share)
          </span>
        </span>
        <br />
        <span className="block">🎉 Happy filming!</span>
      </PopoverDescription>
    </>
  );
}

function PopoverContentDesktop() {
  return (
    <>
      <PopoverHeading>Install on your desktop</PopoverHeading>
      <PopoverDescription>
        <span className="block">
          <span className="mx-2">1.</span>
          Click{' '}
          <InstallDesktopIcon className="mx-1 inline-block h-6 w-6 fill-white" />
        </span>
        <span className="block">
          <span className="mx-2">2.</span>
          Select <span className="rounded-full border px-2">Install</span>
        </span>
        <span className="block">
          <span className="mx-2">3.</span>
          🎉 Happy filming!
        </span>
      </PopoverDescription>
    </>
  );
}

function PopoverContentApple() {
  return (
    <>
      <PopoverHeading>Install on your iPhone</PopoverHeading>
      <PopoverDescription>
        <span className="block">
          <span className="mx-2">1.</span>
          Tap <SquareAndArrowUp className="mx-1 inline-block" /> Share and
        </span>
        <span className="block">
          <span className="mx-2">2.</span>
          Pick <PlusSquare className="mx-1 inline-block" /> Add to Home Screen
        </span>
        <span className="block">
          <span className="mx-2">3.</span>
          🎉 Happy filming!
        </span>
      </PopoverDescription>
    </>
  );
}

function PopoverContentAndroid() {
  return (
    <>
      <PopoverHeading>Install on your Android device</PopoverHeading>
      <PopoverDescription>
        <span className="block">
          <span className="mx-2">1.</span>
          Open{' '}
          <MoreVertIcon className="-mx-1 inline-block h-6 w-6 fill-white" />{' '}
          Menu
        </span>
        <span className="block">
          <span className="mx-2">2.</span>
          Pick{' '}
          <InstallMobileIcon className="mx-1 inline-block h-6 w-6 fill-white" />{' '}
          Install app
        </span>
        <span className="block">
          <span className="mx-2">3.</span>
          🎉 Happy filming!
        </span>
      </PopoverDescription>
    </>
  );
}

function PopoverAutoDisclosure() {
  const store = usePopoverContext();
  useEffect(() => {
    if (!isStandaloneMode()) {
      store?.show();
    }
  }, [store]);
  return null;
}
