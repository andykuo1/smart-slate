import { useNavigate } from 'react-router-dom';

import BackIcon from '@material-symbols/svg-400/rounded/arrow_back-fill.svg';

import SettingsButton from '@/buttons/SettingsButton';
import FancyButton from '@/lib/FancyButton';
import {
  useCurrentRecorder,
  useSetRecorderActive,
  useSetUserCursor,
} from '@/stores/user';

import SceneList from '../scenes/SceneList';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function DocumentPanel({ documentId }) {
  return (
    <>
      <SettingsButton className="fixed top-2 right-2 z-20" />
      <HomeButton className="bg-white" />
      <SceneList documentId={documentId} />
    </>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 */
function HomeButton({ className, disabled }) {
  const setUserCursor = useSetUserCursor();
  const recorderActive = useCurrentRecorder()?.active || false;
  const setRecorderActive = useSetRecorderActive();
  const navigate = useNavigate();

  function onReturnHomeClick() {
    if (recorderActive) {
      setRecorderActive(false, false);
    } else {
      setUserCursor('', '', '', '');
    }
    navigate('/');
  }

  return (
    <div className="fixed left-0 top-0 m-2 z-20">
      <FancyButton
        className={className}
        title="Exit"
        disabled={disabled}
        onClick={onReturnHomeClick}>
        <BackIcon className="inline w-6 fill-current" />
      </FancyButton>
    </div>
  );
}
