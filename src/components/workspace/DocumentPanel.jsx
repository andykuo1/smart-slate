import { useState } from 'react';

import BackIcon from '@material-symbols/svg-400/rounded/arrow_back-fill.svg';
import DeleteIcon from '@material-symbols/svg-400/rounded/delete.svg';
import ExportIcon from '@material-symbols/svg-400/rounded/export_notes-fill.svg';
import MenuIcon from '@material-symbols/svg-400/rounded/menu.svg';

import { useDocumentStore } from '@/stores/DocumentStoreContext';
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
  const setUserCursor = useSetUserCursor();
  const deleteDocument = useDocumentStore((ctx) => ctx.deleteDocument);
  const [isMenuOpen, setMenuOpen] = useState(false);

  function onMenu() {
    setMenuOpen((prev) => !prev);
  }

  function onDelete() {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setMenuOpen(false);
      setUserCursor('', '', '');
      deleteDocument(documentId);
    }
  }

  return (
    <>
      <div className="fixed m-2 z-10 right-0 flex flex-row">
        <div
          className={
            'flex flex-row' +
            ' ' +
            (isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')
          }>
          <FancyButton
            className="bg-white ml-2"
            title="Delete"
            onClick={onDelete}>
            <DeleteIcon className="inline w-6 fill-current" />
          </FancyButton>
          <FancyButton className="bg-white ml-2" title="Export">
            <ExportIcon className="inline w-6 fill-current" />
          </FancyButton>
        </div>
        <FancyButton className="bg-white ml-2" onClick={onMenu}>
          <MenuIcon className="inline w-6 fill-current" />
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
