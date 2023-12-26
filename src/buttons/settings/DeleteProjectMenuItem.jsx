import { MenuItem } from '@ariakit/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import DeleteIcon from '@material-symbols/svg-400/rounded/delete.svg';

import { useDocumentStore } from '@/stores/document';
import { useCurrentDocumentId, useSetUserCursor } from '@/stores/user';
import MenuStyle from '@/styles/Menu.module.css';

export default function DeleteProjectMenuItem() {
  const documentId = useCurrentDocumentId();
  const setUserCursor = useSetUserCursor();
  const deleteDocument = useDocumentStore((ctx) => ctx.deleteDocument);
  const navigate = useNavigate();

  const handleClick = useCallback(
    function handleClick() {
      if (window.confirm('Are you sure you want to delete this project?')) {
        setUserCursor('', '', '');
        deleteDocument(documentId);
        navigate('/');
      }
    },
    [documentId, setUserCursor, deleteDocument, navigate],
  );

  return (
    <MenuItem
      className={MenuStyle.menuItem + ' ' + 'flex flex-row fill-current'}
      onClick={handleClick}>
      <DeleteIcon className="h-full fill-current" />
      Delete Project
    </MenuItem>
  );
}
