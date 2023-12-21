import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddToDriveIcon from '@material-symbols/svg-400/rounded/add_to_drive.svg';
import BackIcon from '@material-symbols/svg-400/rounded/arrow_back-fill.svg';
import CloudOffIcon from '@material-symbols/svg-400/rounded/cloud_off.svg';
import DeleteIcon from '@material-symbols/svg-400/rounded/delete.svg';
import ExportIcon from '@material-symbols/svg-400/rounded/export_notes-fill.svg';
import MenuIcon from '@material-symbols/svg-400/rounded/menu.svg';

import DebugInfoPanel from '@/components/debuginfo/DebugInfoPanel';
import FancyButton from '@/lib/FancyButton';
import { useGAPILogin, useGAPILogout } from '@/lib/googleapi';
import { useDocumentStore } from '@/stores/DocumentStoreContext';
import {
  useCurrentRecorder,
  usePreferNativeRecorder,
  useSetPreferNativeRecorder,
  useSetRecorderActive,
  useSetUserCursor,
} from '@/stores/UserStoreContext';

import ExportSignal from './ExportSignal';
import SceneList from './SceneList';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 */
export default function DocumentPanel({ documentId }) {
  const setUserCursor = useSetUserCursor();
  const deleteDocument = useDocumentStore((ctx) => ctx.deleteDocument);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const preferNativeRecorder = usePreferNativeRecorder();
  const setPreferNativeRecorder = useSetPreferNativeRecorder();

  const login = useGAPILogin();
  const logout = useGAPILogout();

  function onMenu() {
    setMenuOpen((prev) => !prev);
  }

  function onDelete() {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setMenuOpen(false);
      setUserCursor('', '', '');
      deleteDocument(documentId);
      navigate('/');
    }
  }

  function onSync() {
    login();
  }

  function onDesync() {
    logout();
  }

  return (
    <>
      <div className="fixed m-2 z-10 right-0 flex flex-row">
        <div
          className={
            'absolute right-0 top-14 flex flex-col' +
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
          <FancyButton className="bg-white ml-2" title="Sync" onClick={onSync}>
            <AddToDriveIcon className="inline w-6 fill-current" />
          </FancyButton>
          <FancyButton
            className="bg-white ml-2"
            title="Desync"
            onClick={onDesync}>
            <CloudOffIcon className="inline w-6 fill-current" />
          </FancyButton>
          <DebugInfoPanel />
          <FancyButton
            className="bg-white ml-2"
            title={
              preferNativeRecorder
                ? 'Prefer Custom Recorder'
                : 'Prefer Native Recorder'
            }
            onClick={() => setPreferNativeRecorder(!preferNativeRecorder)}
          />
        </div>
        <ExportSignal />
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
    <div className="fixed left-0 top-0 m-2 z-10">
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
