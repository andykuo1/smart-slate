import {
  Button,
  Dialog,
  DialogDescription,
  DialogDismiss,
  DialogHeading,
} from '@ariakit/react';
import { useState } from 'react';

import InfoIcon from '@material-symbols/svg-400/rounded/info.svg';

import CHANGELOG from '../../../CHANGELOG.md?raw';
import Style from './ChangelogPanel.module.css';

export default function ChangelogPanel() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <InfoIcon className="w-6 h-6 opacity-30" />
      </Button>
      <Dialog
        className={Style.dialog}
        open={open}
        onClose={() => setOpen(false)}>
        <DialogDismiss className="text-2xl text-left">
          {'<-'} Back
        </DialogDismiss>
        <DialogHeading className="text-4xl text-center">
          Changelog
        </DialogHeading>
        <DialogDescription className="text-gray-400 text-center">
          A list of what has changed since the beginning!
        </DialogDescription>
        <MarkdownContent textContent={CHANGELOG} />
      </Dialog>
    </>
  );
}

/**
 * @param {object} props
 * @param {string} props.textContent
 */
function MarkdownContent({ textContent }) {
  return textContent.split('\n').map((text, i) =>
    text ? (
      text.startsWith('#') ? (
        <h3 key={`${i}:${text}`} className="text-2xl border-b-2">
          {text}
        </h3>
      ) : (
        <p key={`${i}:${text}`}>{text}</p>
      )
    ) : (
      <br key={`${i}:${text}`} />
    ),
  );
}
