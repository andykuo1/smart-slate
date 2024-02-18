import {
  Dialog,
  DialogDescription,
  DialogDismiss,
  DialogHeading,
  Popover,
  PopoverAnchor,
  PopoverDescription,
  PopoverHeading,
  PopoverProvider,
  usePopoverContext,
} from '@ariakit/react';
import { useEffect, useState } from 'react';

import NewReleasesIcon from '@material-symbols/svg-400/rounded/new_releases-fill.svg';

import MarkdownArea from '@/buttons/MarkdownArea';
import DialogStyle from '@/styles/Dialog.module.css';
import PopoverStyle from '@/styles/Popover.module.css';
import { tryGetWindow } from '@/utils/BrowserFeatures';
import { PACKAGE_VERSION } from '@/values/PackageJSON';

import CHANGELOG from '../../CHANGELOG.md?raw';

const PREVIOUS_RELEASE_VERSION_STORAGE_KEY = 'prevAppVersion';

export default function NewReleasePrompt() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <NewReleasePopoverContainer onClick={() => setOpen(true)} />
      <Dialog
        className={DialogStyle.dialog}
        open={open}
        onClose={() => setOpen(false)}
        modal={true}>
        <DialogDismiss className="text-left text-xl">{'<-'} Back</DialogDismiss>
        <DialogHeading className="my-4 text-center text-4xl">
          Changelog
        </DialogHeading>
        <DialogDescription className="text-center text-gray-400">
          A list of what has changed since the beginning!
        </DialogDescription>
        <MarkdownArea value={CHANGELOG} />
      </Dialog>
    </>
  );
}

/**
 * @param {object} props
 * @param {import('react').MouseEventHandler<HTMLDivElement>} props.onClick
 */
function NewReleasePopoverContainer({ onClick }) {
  return (
    <PopoverProvider>
      <PopoverAnchor className="absolute bottom-4 left-0 right-0" />
      <NewReleasePopoverImpl onClick={onClick} />
    </PopoverProvider>
  );
}

/**
 * @param {object} props
 * @param {import('react').MouseEventHandler<HTMLDivElement>} props.onClick
 */
function NewReleasePopoverImpl({ onClick }) {
  const store = usePopoverContext();

  useEffect(() => {
    const window = tryGetWindow();
    const version = window.localStorage.getItem(
      PREVIOUS_RELEASE_VERSION_STORAGE_KEY,
    );
    if (version === PACKAGE_VERSION) {
      return;
    }
    window.localStorage.setItem(
      PREVIOUS_RELEASE_VERSION_STORAGE_KEY,
      PACKAGE_VERSION,
    );
    store?.show();
  }, [store]);

  return (
    <Popover className={PopoverStyle.popover} onClick={onClick}>
      <div className="flex flex-row items-center gap-2">
        <NewReleasesIcon className="h-10 w-10 fill-current" />
        <div>
          <PopoverHeading className="flex flex-row items-center gap-2 text-left text-xl font-bold">
            <span className="whitespace-nowrap">What's new in </span>
            <span className="italic underline">v{PACKAGE_VERSION}</span>?
          </PopoverHeading>
          <PopoverDescription className="text-sm opacity-30">
            Read what changed in this version!
          </PopoverDescription>
        </div>
      </div>
    </Popover>
  );
}
