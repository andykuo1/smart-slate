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
        <InfoIcon className="w-6 h-6 opacity-30" />
      </Button>
      <Dialog
        className={DialogStyle.dialog}
        open={open}
        onClose={() => setOpen(false)}>
        <DialogDismiss className="text-xl text-left">{'<-'} Back</DialogDismiss>
        <DialogHeading className="text-4xl text-center my-4">
          Changelog
        </DialogHeading>
        <DialogDescription className="text-gray-400 text-center">
          A list of what has changed since the beginning!
        </DialogDescription>
        <MarkdownArea value={CHANGELOG} />
      </Dialog>
    </>
  );
}
