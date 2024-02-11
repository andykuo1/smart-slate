import { useLocation, useNavigate } from 'react-router-dom';

import EditSquareIcon from '@material-symbols/svg-400/rounded/edit_square.svg';
import MovieIcon from '@material-symbols/svg-400/rounded/movie.svg';

import FieldButton from '@/fields/FieldButton';
import { useFullscreen } from '@/libs/fullscreen';
import { getDocumentSettingsById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useSettingsStore } from '@/stores/settings';
import { useCurrentDocumentId, useUserStore } from '@/stores/user';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function SettingsDocumentNavButton({ className }) {
  const setRecordMode = useUserStore((ctx) => ctx.setRecordMode);
  const navigate = useNavigate();
  const location = useLocation();
  const { enterFullscreen, exitFullscreen } = useFullscreen();
  const preferFullscreenRecorder = useSettingsStore(
    (ctx) => ctx.user.preferFullscreenRecorder,
  );
  const setShotListMode = useUserStore((ctx) => ctx.setShotListMode);
  // NOTE: Since this is clickable in settings, project id might not exist yet.
  const documentId = useCurrentDocumentId();
  const projectId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );

  function onNavClick() {
    if (!location.pathname.includes('/edit')) {
      setShotListMode('detail');
      exitFullscreen();
      navigate('/edit');
    } else {
      setRecordMode('clapper');
      if (preferFullscreenRecorder) {
        enterFullscreen();
      }
      navigate('/rec');
    }
  }

  return (
    <>
      <FieldButton
        className={'rounded-full bg-white p-2 shadow-md' + ' ' + className}
        Icon={!location.pathname.includes('/edit') ? EditSquareIcon : MovieIcon}
        onClick={onNavClick}
        disabled={!projectId}
      />
    </>
  );
}
