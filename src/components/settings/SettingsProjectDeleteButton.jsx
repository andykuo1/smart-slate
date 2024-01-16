import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import DeleteIcon from '@material-symbols/svg-400/rounded/delete.svg';

import { clearVideoCache } from '@/recorder/cache';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId, useSetUserCursor } from '@/stores/user';

export default function SettingsProjectDeleteButton() {
  const documentId = useCurrentDocumentId();
  const setUserCursor = useSetUserCursor();
  const deleteDocument = useDocumentStore((ctx) => ctx.deleteDocument);
  const navigate = useNavigate();

  const handleClick = useCallback(
    function handleClick() {
      if (window.confirm('Are you sure you want to delete this project?')) {
        setUserCursor('', '', '');
        deleteDocument(documentId);
        clearVideoCache(documentId);
        navigate('/');
      }
    },
    [documentId, setUserCursor, deleteDocument, navigate],
  );

  return (
    <button
      className="w-full flex flex-row items-center outline rounded p-2 hover:bg-red-500 hover:text-white"
      onClick={handleClick}>
      <DeleteIcon className="w-6 h-6 fill-current" />
      <span className="flex-1">Delete entire project</span>
    </button>
  );
}
