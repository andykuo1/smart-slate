import BackIcon from '@material-symbols/svg-400/rounded/arrow_back-fill.svg';

import FancyButton from '@/components/lib/FancyButton';
import RecorderStatus from '@/stores/RecorderStatus';
import {
  useCurrentDocumentId,
  useCurrentRecorder,
  useRecorderStatus,
  useSetRecorderActive,
  useSetUserCursor,
} from '@/stores/UserStoreContext';

import VideoBooth from '../recorder/VideoBooth';
import DocumentPanel from './DocumentPanel';
import MadeWithLove from './MadeWithLove';
import WelcomePanel from './WelcomePanel';

export default function Workspace() {
  const documentId = useCurrentDocumentId();
  const recorder = useCurrentRecorder();
  const recorderStatus = useRecorderStatus();

  return (
    <>
      <div
        className={
          'absolute top-0 left-0 bottom-0 right-0 z-20 w-full h-full flex flex-col' +
          ' ' +
          (documentId ? 'hidden' : '')
        }>
        <WelcomePanel />
      </div>
      <div
        className={
          'absolute top-0 left-0 bottom-0 right-0 z-10 w-full h-full flex flex-col' +
          ' ' +
          (documentId && recorder.active ? '' : 'hidden')
        }>
        <DarkHomeButton
          className="bg-black"
          disabled={!RecorderStatus.isDone(recorderStatus)}
        />
        <VideoBooth />
      </div>
      <div
        className={
          'absolute top-0 left-0 bottom-0 right-0 z-0 w-full h-full flex flex-col' +
          ' ' +
          (documentId && !recorder.active ? '' : 'hidden')
        }>
        <DocumentPanel documentId={documentId} />
      </div>
      <MadeWithLove />
    </>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 */
function DarkHomeButton({ className, disabled }) {
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
        className="to-black text-white hover:to-gray-800"
        title="Back"
        disabled={disabled}
        onClick={onReturnHomeClick}>
        <BackIcon className="inline w-6 fill-current" />
      </FancyButton>
    </div>
  );
}
