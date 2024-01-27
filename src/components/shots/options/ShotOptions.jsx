import { Button, usePopoverContext } from '@ariakit/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ListAltIcon from '@material-symbols/svg-400/rounded/list_alt.svg';
import MovieIcon from '@material-symbols/svg-400/rounded/movie.svg';
import PhotoCameraIcon from '@material-symbols/svg-400/rounded/photo_camera.svg';
import RadioButtonCheckedIcon from '@material-symbols/svg-400/rounded/radio_button_checked.svg';
import UploadIcon from '@material-symbols/svg-400/rounded/upload.svg';

import { ShotTypeSelector } from '@/components/shots/options/ShotTypeSelector';
import { useFullscreen } from '@/libs/fullscreen';
import { isInputCaptureSupported } from '@/recorder/MediaRecorderSupport';
import { useOpenPreferredRecorder } from '@/recorder/UseOpenRecorder';
import { useDocumentStore, useShotTakeCount } from '@/stores/document/use';
import { useSetUserCursor, useUserStore } from '@/stores/user';
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
  const shotTakeCount = useShotTakeCount(documentId, shotId);
  const setShotReferenceImage = useDocumentStore(
    (ctx) => ctx.setShotReferenceImage,
  );
  const setUserCursor = useSetUserCursor();
  const setEditMode = useUserStore((ctx) => ctx.setEditMode);
  const onRecorderOpen = useCallback(
    function _onRecorderOpen() {
      setUserCursor(documentId, sceneId, shotId);
    },
    [documentId, sceneId, shotId, setUserCursor],
  );
  const openRecorder = useOpenPreferredRecorder(onRecorderOpen);
  const navigate = useNavigate();
  const setRecordMode = useUserStore((ctx) => ctx.setRecordMode);
  const { enterFullscreen } = useFullscreen();

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

  function onClapperboardClick() {
    setOpen(false);
    setUserCursor(documentId, sceneId, shotId, '');
    setRecordMode('clapper');
    navigate('/rec');
    enterFullscreen();
  }

  const onFocusClick = useCallback(
    function _onFocusClick() {
      setOpen(false);
      setUserCursor(documentId, sceneId, shotId);
      setEditMode('shotlist');
    },
    [setUserCursor, documentId, sceneId, shotId, setOpen, setEditMode],
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
        className="flex-1 p-1 flex items-center gap-2 rounded hover:bg-opacity-10 bg-opacity-0 bg-white disabled:opacity-30"
        onClick={onRecordClick}>
        <RadioButtonCheckedIcon className="w-6 h-6 fill-current" />
        <span className="flex-1 text-right">
          Record Take #{shotTakeCount + 1}
        </span>
      </Button>
      <Button
        className="flex-1 p-1 flex items-center gap-2 rounded hover:bg-opacity-10 bg-opacity-0 bg-white disabled:opacity-30"
        onClick={onFocusClick}>
        <ListAltIcon className="w-6 h-6 fill-current" />
        <span className="flex-1 text-right">Shot Details</span>
      </Button>
      <Button
        className="flex-1 p-1 flex items-center gap-2 rounded hover:bg-opacity-10 bg-opacity-0 bg-white disabled:opacity-30"
        onClick={onClapperboardClick}>
        <MovieIcon className="w-6 h-6 fill-current" />
        <span className="flex-1 text-right">Clapperboard</span>
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
