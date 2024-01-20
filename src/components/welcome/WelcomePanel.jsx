import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@material-symbols/svg-400/rounded/add-fill.svg';

import ChangelogButton from '@/buttons/ChangelogButton';
import ImportProjectButton from '@/buttons/ImportProjectButton';
import ScannerButton from '@/buttons/ScannerButton';
import ProjectSelector from '@/components/projects/ProjectSelector';
import FancyButton from '@/libs/FancyButton';
import GoogleConnectButton from '@/libs/googleapi/auth/GoogleConnectButton';
import { createDocument } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';
import { useSetUserCursor } from '@/stores/user';

import AppTitle from './AppTitle';

export default function WelcomePanel() {
  const addDocument = useDocumentStore((ctx) => ctx.addDocument);
  const setUserCursor = useSetUserCursor();
  const navigate = useNavigate();

  const onNewProjectClick = useCallback(
    function onNewProjectClick() {
      let newDocument = createDocument();
      newDocument.documentTitle = 'My Movie';
      newDocument.lastUpdatedMillis = Date.now();
      addDocument(newDocument);
      setUserCursor(newDocument.documentId, '', '', '');
      navigate('/settings');
    },
    [addDocument, setUserCursor, navigate],
  );

  return (
    <>
      <AppTitle />
      <div className="flex flex-row text-center mx-auto">
        <div className="absolute top-2 right-2">
          <GoogleConnectButton />
        </div>
        <FancyButton
          title="New Project"
          className="mx-1 px-12"
          onClick={onNewProjectClick}>
          <AddIcon className="inline w-6 fill-current" />
        </FancyButton>
        <ImportProjectButton />
        <ChangelogButton />
        <ScannerButton />
      </div>
      <ProjectSelector className="mx-auto mb-auto" />
    </>
  );
}
