import { useNavigate } from 'react-router-dom';

import BackIcon from '@material-symbols/svg-400/rounded/arrow_back-fill.svg';

import NavBarLayout from '@/components/NavBarLayout';
import DocumentEntry from '@/components/documents/DocumentEntry';
import FancyButton from '@/libs/FancyButton';
import {
  useCurrentDocumentId,
  useCurrentRecorder,
  useSetRecorderActive,
  useSetUserCursor,
} from '@/stores/user';

export default function EditPage() {
  const documentId = useCurrentDocumentId();
  return (
    <main className="w-full h-full flex flex-col bg-white">
      <NavBarLayout>
        <HomeButton className="bg-white" />
        <DocumentEntry documentId={documentId} />
      </NavBarLayout>
    </main>
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
