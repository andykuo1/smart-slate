import {
  Popover,
  PopoverAnchor,
  PopoverDescription,
  PopoverDismiss,
  PopoverHeading,
  PopoverProvider,
  usePopoverContext,
} from '@ariakit/react';
import { useCallback } from 'react';

import AddToDriveIcon from '@material-symbols/svg-400/rounded/add_to_drive.svg';

import { useDelayedEffect } from '@/libs/UseDelayedEffect';
import { useGAPILogin, useGAPITokenHandler } from '@/libs/googleapi';
import PopoverStyle from '@/styles/Popover.module.css';

export default function ProfilePopover() {
  return (
    <PopoverProvider>
      <PopoverAutoDisclosureOnSignedOut />
      <PopoverAnchor className="fixed top-2 left-0" />
      <Popover className={PopoverStyle.popover}>
        <PopoverContentProfile />
      </Popover>
    </PopoverProvider>
  );
}

function PopoverContentProfile() {
  const login = useGAPILogin();
  const store = usePopoverContext();
  function onClick() {
    store?.hide();
    login();
  }
  return (
    <>
      <PopoverHeading className="font-bold">
        Create an EagleStudio account! 👋
      </PopoverHeading>
      <PopoverDismiss className="absolute top-5 right-3" />
      <PopoverDescription className="text-gray-400 text-xs">
        Sign up to see your projects across any device and keep up-to-date with
        what's new!
      </PopoverDescription>
      <div className="bg-white flex flex-col items-center rounded py-2 gap-2">
        <div className="w-full px-2 flex">
          <button
            className="flex-1 px-2 bg-black text-white rounded whitespace-nowrap disabled:opacity-30"
            disabled={true}>
            Sign up
          </button>
          <span className="mx-2 text-black">or</span>
        </div>
        <div className="w-full px-2 flex">
          <button
            className="flex-1 border rounded text-black"
            onClick={onClick}>
            <AddToDriveIcon className="inline-block w-6 h-6 mr-2 fill-current" />
            Use with Google Drive
          </button>
        </div>
      </div>
      <p className="text-gray-400 text-xs">
        Already have an account?
        <button className="font-bold mx-2 px-2 text-white border-b-2 border-dotted">
          Sign in
        </button>
      </p>
    </>
  );
}

function PopoverAutoDisclosureOnSignedOut() {
  const store = usePopoverContext();
  const handleToken = useGAPITokenHandler();

  const onDelayedEffect = useCallback(() => {
    if (!handleToken(() => {})) {
      store?.show();
    }
  }, [store, handleToken]);

  useDelayedEffect(onDelayedEffect, 10_000);
  return null;
}
