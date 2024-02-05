import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@material-symbols/svg-400/rounded/add-fill.svg';

import FancyButton from '@/buttons/FancyButton';
import { createDocument } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';
import { useSetUserCursor } from '@/stores/user';

export default function ProjectNewButton() {
  const addDocument = useDocumentStore((ctx) => ctx.addDocument);
  const setUserCursor = useSetUserCursor();
  const navigate = useNavigate();

  const onClick = useCallback(
    function onClick() {
      let newDocument = createDocument();
      newDocument.documentTitle = 'My Movie';
      newDocument.firstCreatedMillis = Date.now();
      newDocument.lastUpdatedMillis = newDocument.firstCreatedMillis;
      addDocument(newDocument);
      setUserCursor(newDocument.documentId, '', '', '');
      navigate('/new');
    },
    [addDocument, setUserCursor, navigate],
  );

  return (
    <FancyButton title="New Project" className="mx-1 px-12" onClick={onClick}>
      <AddIcon className="inline w-6 fill-current" />
    </FancyButton>
  );
}
