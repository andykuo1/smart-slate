import { useLocation, useNavigate } from 'react-router-dom';

import EditSquareIcon from '@material-symbols/svg-400/rounded/edit_square.svg';
import MovieIcon from '@material-symbols/svg-400/rounded/movie.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import { useFullscreen } from '@/libs/fullscreen';
import { useUserStore } from '@/stores/user';

/**
 *
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function DocumentToolbar({ documentId }) {
  const setRecordMode = useUserStore((ctx) => ctx.setRecordMode);
  const navigate = useNavigate();
  const location = useLocation();
  const { enterFullscreen, exitFullscreen } = useFullscreen();
  const setShotListMode = useUserStore((ctx) => ctx.setShotListMode);

  function onNavClick() {
    if (!location.pathname.includes('/edit')) {
      setShotListMode('detail');
      exitFullscreen();
      navigate('/edit');
    } else {
      setRecordMode('clapper');
      enterFullscreen();
      navigate('/rec');
    }
  }

  return (
    <>
      <SettingsFieldButton
        className={'bg-white rounded-full p-2 shadow-md'}
        Icon={!location.pathname.includes('/edit') ? EditSquareIcon : MovieIcon}
        onClick={onNavClick}
      />
    </>
  );
}
