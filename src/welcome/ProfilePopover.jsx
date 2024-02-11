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

import { useDelayedEffect } from '@/libs/UseDelayedEffect';
import GoogleLoginButton from '@/libs/googleapi/auth/GoogleLoginButton';
import { useGoogleStatus } from '@/libs/googleapi/auth/UseGoogleStatus';
import PopoverStyle from '@/styles/Popover.module.css';

export default function ProfilePopover() {
  return (
    <PopoverProvider>
      <PopoverAutoDisclosureOnSignedOut />
      <PopoverAnchor className="fixed left-0 top-2" />
      <Popover className={PopoverStyle.popover}>
        <PopoverContentProfile />
      </Popover>
    </PopoverProvider>
  );
}

function PopoverContentProfile() {
  return (
    <>
      <PopoverHeading className="font-bold">
        Create an EagleStudio account! 👋
      </PopoverHeading>
      <PopoverDismiss className="absolute right-3 top-5" />
      <PopoverDescription className="text-xs text-gray-400">
        Sign up to see your projects across any device and keep up-to-date with
        what's new!
      </PopoverDescription>
      <div className="flex flex-col items-center gap-2 rounded bg-white py-2">
        <div className="flex w-full px-2">
          <button
            className="flex-1 whitespace-nowrap rounded bg-black px-2 text-white disabled:opacity-30"
            disabled={true}>
            Sign up
          </button>
          <span className="mx-2 text-black">or</span>
        </div>
        <GoogleLoginButton />
      </div>
      <p className="text-xs text-gray-400">
        Already have an account?
        <button className="mx-2 border-b-2 border-dotted px-2 font-bold text-white">
          Sign in
        </button>
      </p>
    </>
  );
}

function PopoverAutoDisclosureOnSignedOut() {
  const store = usePopoverContext();
  const googleStatus = useGoogleStatus();

  const onDelayedEffect = useCallback(() => {
    if (!googleStatus) {
      store?.show();
    }
  }, [store, googleStatus]);

  useDelayedEffect(onDelayedEffect, 10_000);
  return null;
}
