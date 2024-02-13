import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import DeleteIcon from '@material-symbols/svg-400/rounded/delete.svg';

import { clearVideoCache } from '@/recorder/cache';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId, useSetUserCursor } from '@/stores/user';

export default function SettingsProjectDeleteButton() {
  const documentId = useCurrentDocumentId();
  const setUserCursor = useSetUserCursor();
  const trashDocument = useDocumentStore((ctx) => ctx.trashDocument);
  const navigate = useNavigate();

  const handleClick = useCallback(
    function handleClick() {
      // TODO: Have something else that doesn't stall the app :P
      if (window.confirm('Are you sure you want to delete this project?')) {
        setUserCursor('', '', '');
        trashDocument(documentId);
        clearVideoCache(documentId);
        navigate('/');
      }
    },
    [documentId, setUserCursor, trashDocument, navigate],
  );

  return (
    <button
      className="flex w-full flex-row items-center rounded p-2 outline hover:bg-red-500 hover:text-white"
      onClick={handleClick}>
      <DeleteIcon className="h-6 w-6 fill-current" />
      <span className="flex-1">Delete entire project</span>
    </button>
  );
}
