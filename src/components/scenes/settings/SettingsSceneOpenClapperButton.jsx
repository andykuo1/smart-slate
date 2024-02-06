import { useNavigate } from 'react-router-dom';

import MovieIcon from '@material-symbols/svg-400/rounded/movie.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import { useFullscreen } from '@/libs/fullscreen';
import { useSettingsStore } from '@/stores/settings';
import { useSetUserCursor, useUserStore } from '@/stores/user';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SettingsSceneOpenClapperButton({
  documentId,
  sceneId,
}) {
  const setUserCursor = useSetUserCursor();
  const navigate = useNavigate();
  const setRecordMode = useUserStore((ctx) => ctx.setRecordMode);
  const { enterFullscreen } = useFullscreen();
  const preferFullscreenRecorder = useSettingsStore(
    (ctx) => ctx.user.preferFullscreenRecorder,
  );

  function onClick() {
    setUserCursor(documentId, sceneId, '', '');
    setRecordMode('clapper');
    navigate('/rec');
    if (preferFullscreenRecorder) {
      enterFullscreen();
    }
  }

  return (
    <SettingsFieldButton
      className="w-auto"
      Icon={MovieIcon}
      title="Open clapperboard for scene"
      onClick={onClick}
    />
  );
}
