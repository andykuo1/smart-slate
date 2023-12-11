'use client';

import { useCallback } from 'react';

import BackIcon from '@material-symbols/svg-400/rounded/arrow_back-fill.svg';

import FancyButton from '@/components/lib/FancyButton';
import {
  useDocumentTitle,
  useSetDocumentTitle,
} from '@/stores/DocumentStoreContext';
import {
  useCurrentDocumentId,
  useCurrentRecorder,
  useSetRecorderActive,
  useSetUserCursor,
} from '@/stores/UserStoreContext';

import VideoBooth from '../recorder/VideoBooth';
import SceneListPanel from './SceneListPanel';
import WelcomePanel from './WelcomePanel';

export default function Workspace() {
  const documentId = useCurrentDocumentId();
  const recorderActive = useCurrentRecorder()?.active || false;

  if (!documentId) {
    return <WelcomePanel />;
  } else if (recorderActive) {
    return (
      <>
        <DarkHomeButton />
        <VideoBooth />
      </>
    );
  } else {
    return (
      <>
        <HomeButton />
        <ProjectTitle documentId={documentId} />
        <SceneListPanel documentId={documentId} />
      </>
    );
  }
}

/**
 * @param {object} props
 * @param {string} [props.className]
 */
function DarkHomeButton({ className }) {
  const setUserCursor = useSetUserCursor();
  const recorderActive = useCurrentRecorder()?.active || false;
  const setRecorderActive = useSetRecorderActive();

  function onReturnHomeClick() {
    if (recorderActive) {
      setRecorderActive(false);
    } else {
      setUserCursor('', '', '', '');
    }
  }

  return (
    <div className="fixed m-2 z-10">
      <FancyButton
        className="to-black text-white hover:to-gray-800"
        title="Back"
        onClick={onReturnHomeClick}>
        <BackIcon className="inline w-6 fill-current" />
      </FancyButton>
    </div>
  );
}
/**
 * @param {object} props
 * @param {string} [props.className]
 */
function HomeButton({ className }) {
  const setUserCursor = useSetUserCursor();
  const recorderActive = useCurrentRecorder()?.active || false;
  const setRecorderActive = useSetRecorderActive();

  function onReturnHomeClick() {
    if (recorderActive) {
      setRecorderActive(false);
    } else {
      setUserCursor('', '', '', '');
    }
  }

  return (
    <div className="fixed m-2 z-10">
      <FancyButton
        className={className}
        title="Back"
        onClick={onReturnHomeClick}>
        <BackIcon className="inline w-6 fill-current" />
      </FancyButton>
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 */
function ProjectTitle({ documentId }) {
  const documentTitle = useDocumentTitle(documentId);
  const setDocumentTitle = useSetDocumentTitle();
  const onDocumentTitleChange = useCallback(
    /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
    function onTitleChange(e) {
      let el = e.target;
      setDocumentTitle(documentId, el.value);
    },
    [documentId, setDocumentTitle],
  );

  return (
    <h2 className="flex flex-col text-center my-2">
      <div className="flex-1 flex flex-row">
        <div className="flex-1" />
        <input
          className="text-center text-2xl"
          value={documentTitle}
          placeholder="Untitled"
          onChange={onDocumentTitleChange}
        />
        <div className="flex-1" />
      </div>
      <label className="text-xs opacity-30">
        <span>ID: </span>
        <output>{documentId}</output>
      </label>
    </h2>
  );
}
