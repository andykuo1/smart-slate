import { useNavigate } from 'react-router-dom';

import BackIcon from '@material-symbols/svg-400/rounded/arrow_back.svg';

import { getDocumentSettingsById, useDocumentStore } from '@/stores/document';
import { useCurrentDocumentId, useSetUserCursor } from '@/stores/user';

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
    <button
      className="text-sm items-center flex text-blue-500 hover:underline cursor-pointer"
      onClick={onClick}>
      <BackIcon className="inline-block w-6 h-6 fill-current pointer-events-none" />
      Not the project you are looking for?
    </button>
  );
}
