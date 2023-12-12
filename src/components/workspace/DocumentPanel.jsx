import BackIcon from '@material-symbols/svg-400/rounded/arrow_back-fill.svg';
import ExportIcon from '@material-symbols/svg-400/rounded/export_notes-fill.svg';

import {
  useCurrentRecorder,
  useSetRecorderActive,
  useSetUserCursor,
} from '@/stores/UserStoreContext';

import FancyButton from '../lib/FancyButton';
import SceneList from './SceneList';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 */
export default function DocumentPanel({ documentId }) {
  return (
    <>
      <div className="fixed m-2 z-10 right-0">
        <FancyButton className="bg-white" title="Export">
          <ExportIcon className="inline w-6 fill-current" />
        </FancyButton>
      </div>
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

  function onReturnHomeClick() {
    if (recorderActive) {
      setRecorderActive(false, false);
    } else {
      setUserCursor('', '', '', '');
    }
  }

  return (
    <div className="fixed m-2 z-10">
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
