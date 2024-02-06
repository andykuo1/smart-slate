import { Button, usePopoverContext } from '@ariakit/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ListAltIcon from '@material-symbols/svg-400/rounded/list_alt.svg';
import MovieIcon from '@material-symbols/svg-400/rounded/movie.svg';
import RadioButtonCheckedIcon from '@material-symbols/svg-400/rounded/radio_button_checked.svg';

import SettingsShotTypeSelector from '@/components/shots/settings/SettingsShotTypeSelector';
import { useFullscreen } from '@/libs/fullscreen';
import { isInputCaptureSupported } from '@/recorder/MediaRecorderSupport';
import { useOpenPreferredRecorder } from '@/recorder/UseOpenRecorder';
import { useDocumentStore, useShotTakeCount } from '@/stores/document/use';
import { useSettingsStore } from '@/stores/settings';
import { useSetUserCursor, useUserStore } from '@/stores/user';
import { NOOP } from '@/values/Functions';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

import SettingsShotDeleteButton from '../settings/SettingsShotDeleteButton';
import SettingsShotReferenceImageField from '../settings/SettingsShotReferenceImageField';
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

  const [_, setCameraEnabled] = useState(false);
  const shotTakeCount = useShotTakeCount(documentId, shotId);
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
  const navigate = useNavigate();
  const setRecordMode = useUserStore((ctx) => ctx.setRecordMode);
  const { enterFullscreen } = useFullscreen();
  const preferFullscreenRecorder = useSettingsStore(
    (ctx) => ctx.user.preferFullscreenRecorder,
  );

  useEffect(() => {
    setCameraEnabled(isInputCaptureSupported());
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
    if (preferFullscreenRecorder) {
      enterFullscreen();
    }
  }

  const onFocusClick = useCallback(
    function _onFocusClick() {
      setOpen(false);
      setUserCursor(documentId, sceneId, shotId);
    },
    [setUserCursor, documentId, sceneId, shotId, setOpen],
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

  if (!shotId) {
    return null;
  }

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
      <div className="flex-1 flex flex-row gap-2">
        <SettingsShotTypeSelector
          className="flex-1"
          documentId={documentId}
          shotId={shotId}
        />
        <SettingsShotReferenceImageField
          documentId={documentId}
          shotId={shotId}
        />
      </div>
      <SettingsShotDeleteButton
        documentId={documentId}
        sceneId={sceneId}
        shotId={shotId}
      />
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
