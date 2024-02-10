import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import EditSquareIcon from '@material-symbols/svg-400/rounded/edit_square.svg';
import MovieIcon from '@material-symbols/svg-400/rounded/movie.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import { useFullscreen } from '@/libs/fullscreen';
import { useSettingsStore } from '@/stores/settings';
import { useSetUserCursor, useUserStore } from '@/stores/user';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {boolean} [props.inverted]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 */
export default function SettingsSceneOpenClapperButton({
  documentId,
  sceneId,
  inverted,
  onClick,
}) {
  const setUserCursor = useSetUserCursor();
  const location = useLocation();
  const navigate = useNavigate();
  const { enterFullscreen } = useFullscreen();
  const setRecordMode = useUserStore((ctx) => ctx.setRecordMode);
  const preferFullscreenRecorder = useSettingsStore(
    (ctx) => ctx.user.preferFullscreenRecorder,
  );
  const isNavigatingToEdit = !location.pathname.includes('/edit');
  const Icon = isNavigatingToEdit ? EditSquareIcon : MovieIcon;
  const title = isNavigatingToEdit ? 'Edit scene' : 'Show clapperboard';

  const handleClick = useCallback(
    /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
    function _handleClick(e) {
      setUserCursor(documentId, sceneId, '', '');
      if (isNavigatingToEdit) {
        navigate('/edit');
      } else {
        setRecordMode('clapper');
        navigate('/rec');
      }
      if (preferFullscreenRecorder) {
        enterFullscreen();
      }
      onClick?.(e);
    },
    [
      documentId,
      sceneId,
      setUserCursor,
      setRecordMode,
      navigate,
      isNavigatingToEdit,
      preferFullscreenRecorder,
      enterFullscreen,
      onClick,
    ],
  );

  return (
    <SettingsFieldButton
      className="w-auto"
      inverted={inverted}
      Icon={Icon}
      title={title}
      onClick={handleClick}
    />
  );
}
