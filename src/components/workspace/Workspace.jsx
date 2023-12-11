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
  useSetUserCursor,
} from '@/stores/UserStoreContext';

import SceneListPanel from './SceneListPanel';
import WelcomePanel from './WelcomePanel';

export default function Workspace() {
  const documentId = useCurrentDocumentId();
  const setUserCursor = useSetUserCursor();

  function onReturnHomeClick() {
    setUserCursor('', '', '', '');
  }

  return (
    <main className="flex flex-col w-screen h-screen text-black bg-white">
      {!documentId ? (
        <WelcomePanel />
      ) : (
        <>
          <div className="fixed m-2">
            <FancyButton title="Back" onClick={onReturnHomeClick}>
              <BackIcon className="inline w-6 fill-current" />
            </FancyButton>
          </div>
          <ProjectTitle documentId={documentId} />
          <SceneListPanel documentId={documentId} />
        </>
      )}
    </main>
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
