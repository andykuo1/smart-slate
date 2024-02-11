import { useNavigate } from 'react-router-dom';

import BackIcon from '@material-symbols/svg-400/rounded/arrow_back.svg';

import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId, useSetUserCursor } from '@/stores/user';

import SettingsFieldButton from './SettingsFieldButton';

export default function SettingsReturnHomeField() {
  const navigate = useNavigate();
  const documentId = useCurrentDocumentId();
  const projectId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );
  const setUserCursor = useSetUserCursor();
  const deleteDocument = useDocumentStore((ctx) => ctx.deleteDocument);

  function onClick() {
    setUserCursor('', '', '');
    if (!projectId) {
      // Since no project id exists yet, just delete this project.
      deleteDocument(documentId);
    }
    navigate('/');
  }

  return (
    <SettingsFieldButton
      className="my-1 w-full bg-gray-300 outline-none"
      Icon={BackIcon}
      onClick={onClick}>
      Exit to home
    </SettingsFieldButton>
  );
}

// @ts-expect-error Not used, but it is nice :3
function SettingsProjectBackButton() {
  const navigate = useNavigate();
  const documentId = useCurrentDocumentId();
  const projectId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );
  const setUserCursor = useSetUserCursor();
  const deleteDocument = useDocumentStore((ctx) => ctx.deleteDocument);

  function onClick() {
    setUserCursor('', '', '');
    if (!projectId) {
      // Since no project id exists yet, just delete this project.
      deleteDocument(documentId);
    }
    navigate('/');
  }

  return (
    <button
      className="flex cursor-pointer items-center text-sm text-blue-500 hover:underline"
      onClick={onClick}>
      <BackIcon className="pointer-events-none inline-block h-6 w-6 fill-current" />
      Not the project you are looking for?
    </button>
  );
}
