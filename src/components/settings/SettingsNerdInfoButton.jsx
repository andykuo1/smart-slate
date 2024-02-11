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

import MarkdownArea from '@/buttons/MarkdownArea';
import DialogStyle from '@/styles/Dialog.module.css';
import Codecs from '@/values/Codecs';

import SettingsFieldButton from './SettingsFieldButton';

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
      <SettingsFieldButton Icon={DeviceInfoIcon} onClick={() => setOpen(true)}>
        Show nerd info
      </SettingsFieldButton>
      <Dialog
        className={DialogStyle.dialog}
        open={open}
        onClose={() => setOpen(false)}>
        <div className="flex flex-row">
          <DialogDismiss className="flex-1 text-left text-2xl">
            {'<-'} Back
          </DialogDismiss>
          <Button className="flex-1 text-right" onClick={onCopy}>
            <ContentCopy className="inline-block h-6 w-6 fill-white" /> Copy to
            Clipboard
          </Button>
        </div>
        <DialogHeading className="my-4 text-center text-4xl">
          Nerd Info
        </DialogHeading>
        <DialogDescription className="text-center text-gray-400">
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
