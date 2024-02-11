import {
  Button,
  Dialog,
  DialogDescription,
  DialogDismiss,
  DialogHeading,
} from '@ariakit/react';
import { useState } from 'react';

import InfoIcon from '@material-symbols/svg-400/rounded/info.svg';

import DialogStyle from '@/styles/Dialog.module.css';

import CHANGELOG from '../../CHANGELOG.md?raw';
import MarkdownArea from './MarkdownArea';

export default function ChangelogButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <InfoIcon className="h-6 w-6 opacity-30" />
      </Button>
      <Dialog
        className={DialogStyle.dialog}
        open={open}
        onClose={() => setOpen(false)}>
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
