import {
  Button,
  Dialog,
  DialogDescription,
  DialogDismiss,
  DialogHeading,
} from '@ariakit/react';
import { useEffect, useState } from 'react';

import ContentCopy from '@material-symbols/svg-400/rounded/content_copy.svg';
import DeviceInfoIcon from '@material-symbols/svg-400/rounded/device_unknown.svg';

import Codecs from '@/constants/Codecs';
import FancyButton from '@/lib/FancyButton';
import DialogStyle from '@/styles/Dialog.module.css';

import { MarkdownContent } from '../changelog/ChangelogPanel';

export default function DebugInfoPanel() {
  const [open, setOpen] = useState(false);
  const [nerdInfo, setNerdInfo] = useState('');

  useEffect(() => {
    if (open) {
      setNerdInfo(getNerdInfo());
    }
  }, [open, setNerdInfo]);

  function onCopy() {
    const result = `${navigator.userAgent}\n\n${Codecs.join('\n')}`;
    navigator.clipboard
      .writeText(result)
      .then(() => window.alert('Copied device info to clipboard!'));
  }
  return (
    <>
      <FancyButton className="bg-white ml-2" onClick={() => setOpen(true)}>
        <DeviceInfoIcon className="inline-block w-6" /> Info
      </FancyButton>
      <Dialog
        className={DialogStyle.dialog}
        open={open}
        onClose={() => setOpen(false)}>
        <div className="flex flex-row">
          <DialogDismiss className="text-2xl text-left flex-1">
            {'<-'} Back
          </DialogDismiss>
          <Button className="flex-1 text-right" onClick={onCopy}>
            <ContentCopy className="inline-block w-6 h-6 fill-white" /> Copy to
            Clipboard
          </Button>
        </div>
        <DialogHeading className="text-4xl text-center my-4">
          Nerd Info
        </DialogHeading>
        <DialogDescription className="text-gray-400 text-center">
          Share this with your fellow nerd :3
        </DialogDescription>
        <MarkdownContent textContent={nerdInfo} />
      </Dialog>
    </>
  );
}

function getNerdInfo() {
  return `# User Agent\n\n${
    navigator.userAgent
  }\n\n# Supported Codecs\n\n${Codecs.join('\n')}`;
}
