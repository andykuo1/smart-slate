import { Button, usePopoverContext } from '@ariakit/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import PhotoCameraIcon from '@material-symbols/svg-400/rounded/photo_camera.svg';
import RadioButtonCheckedIcon from '@material-symbols/svg-400/rounded/radio_button_checked.svg';
import UploadIcon from '@material-symbols/svg-400/rounded/upload.svg';

import { ShotTypeSelector } from '@/components/shots/options/ShotTypeSelector';
import { isInputCaptureSupported } from '@/recorder/MediaRecorderSupport';
import { useOpenPreferredRecorder } from '@/recorder/UseOpenRecorder';
import { useDocumentStore } from '@/stores/document';
import { useSetUserCursor } from '@/stores/user';
import { NOOP } from '@/values/Functions';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

import { useShotTypeChange } from '../UseShotType';
import { blobToDataURI } from './ShotThumbnailHelper';

/**
 * @param {object} props
 * @param {string} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {string} props.shotId
 */
export default function ShotOptions({ documentId, sceneId, shotId }) {
  const inputUploadRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const inputCaptureRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const canvasRef = useRef(/** @type {HTMLCanvasElement|null} */ (null));
  const { setOpen = NOOP } = usePopoverContext() || {};

  const [isCameraEnabled, setCameraEnabled] = useState(false);
  const [activeShotType, onShotTypeChange] = useShotTypeChange(
    documentId,
    shotId,
  );
  const setShotReferenceImage = useDocumentStore(
    (ctx) => ctx.setShotReferenceImage,
  );
  const setUserCursor = useSetUserCursor();
  const onRecorderOpen = useCallback(
    function _onRecorderOpen() {
      setUserCursor(documentId, sceneId, shotId);
    },
    [documentId, sceneId, shotId, setUserCursor],
  );
  const openRecorder = useOpenPreferredRecorder(onRecorderOpen);

  useEffect(() => {
    setCameraEnabled(isInputCaptureSupported());
  }, []);

  const onInputUploadClick = useCallback(function _onInputUploadClick() {
    inputUploadRef.current?.click();
  }, []);

  const onInputCaptureClick = useCallback(function _onInputCaptureClick() {
    inputCaptureRef.current?.click();
  }, []);

  const onRecordClick = useCallback(
    /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
    function _onRecordClick(e) {
      setOpen(false);
      openRecorder(e);
    },
    [setOpen, openRecorder],
  );

  const onInputChange = useCallback(
    /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
    function _onInputChange(e) {
      const el = /** @type {HTMLInputElement} */ (e.target);
      const file = el?.files?.[0];
      if (!file) {
        return;
      }
      el.value = '';

      // Upload the take.
      blobToDataURI(
        file,
        MAX_THUMBNAIL_WIDTH,
        MAX_THUMBNAIL_HEIGHT,
        canvasRef,
      ).then((uri) => setShotReferenceImage(documentId, shotId, uri));
    },
    [documentId, shotId, setShotReferenceImage],
  );

  return (
    <div className="flex flex-col gap-2">
      <Button
        className="flex-1 p-1 flex items-center rounded hover:bg-opacity-10 bg-opacity-0 bg-white disabled:opacity-30"
        onClick={onRecordClick}>
        <RadioButtonCheckedIcon className="w-6 h-6 fill-current" />
        <span className="flex-1 text-right">Record!</span>
      </Button>
      <div className="border" />
      <ShotTypeSelector
        className="flex-1 flex flex-row items-center"
        activeShotType={activeShotType}
        onChange={onShotTypeChange}
      />
      <Button
        className="flex-1 p-1 flex items-center rounded hover:bg-opacity-10 bg-opacity-0 bg-white disabled:opacity-30"
        disabled={!isCameraEnabled}
        onClick={onInputCaptureClick}>
        <PhotoCameraIcon className="w-6 h-6 fill-current" />
        <span className="flex-1 text-right ml-2">Take photo</span>
      </Button>
      <Button
        className="flex-1 p-1 flex items-center rounded hover:bg-opacity-10 bg-opacity-0 bg-white disabled:opacity-30"
        onClick={onInputUploadClick}>
        <UploadIcon className="w-6 h-6 fill-current" />
        <span className="flex-1 text-right ml-2">From file</span>
      </Button>
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={inputUploadRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={onInputChange}
      />
      <input
        ref={inputCaptureRef}
        className="hidden"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onInputChange}
      />
    </div>
  );
}
