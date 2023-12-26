import {
  Button,
  Dialog,
  DialogDescription,
  DialogDismiss,
  DialogHeading,
  MenuItem,
} from '@ariakit/react';
import { useEffect, useState } from 'react';

import ContentCopy from '@material-symbols/svg-400/rounded/content_copy.svg';
import DeviceInfoIcon from '@material-symbols/svg-400/rounded/device_unknown.svg';

import DialogStyle from '@/styles/Dialog.module.css';
import MenuStyle from '@/styles/Menu.module.css';
import Codecs from '@/values/Codecs';

import MarkdownArea from '../MarkdownArea';

export default function NerdInfoMenuItem() {
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
      <MenuItem className={MenuStyle.menuItem} onClick={() => setOpen(true)}>
        <DeviceInfoIcon className="h-full" /> Show Nerd Info
      </MenuItem>
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
        <MarkdownArea value={nerdInfo} />
      </Dialog>
    </>
  );
}

function getNerdInfo() {
  return `# User Agent\n\n${navigator.userAgent}\n\n${isMediaRecorderSupported(
    'video/mp4',
  )}\n\n${isMediaStreamSupported('')}\n\n# Supported Codecs\n\n${Codecs.join(
    '\n',
  )}`;
}

/**
 * @param {string} mimeType
 */
function isMediaRecorderSupported(mimeType) {
  if (!window.MediaRecorder) {
    return false;
  }
  if (!MediaRecorder.isTypeSupported) {
    return mimeType.startsWith('audio/mp4') || mimeType.startsWith('video/mp4');
  }
  return MediaRecorder.isTypeSupported(mimeType);
}

/**
 * @param {string} mimeType
 */
function isMediaStreamSupported(mimeType) {
  if (!window.MediaStream) {
    return false;
  }
  if (!window.navigator.mediaDevices) {
    return false;
  }
  return true;
}
