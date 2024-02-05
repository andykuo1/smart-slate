import { useEffect } from 'react';

import SettingsAutoSaveToField from '@/components/settings/SettingsAutoSaveToField';
import SettingsProjectIdField from '@/components/settings/SettingsProjectIdField';
import SettingsProjectInstallField from '@/components/settings/SettingsProjectInstallField';
import SettingsProjectNameField from '@/components/settings/SettingsProjectNameField';
import SettingsProjectStartButton from '@/components/settings/SettingsProjectStartButton';
import SettingsReturnHomeField from '@/components/settings/SettingsReturnHomeField';
import GoogleConnectButton from '@/libs/googleapi/auth/GoogleConnectButton';
import { createDocument } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId, useSetUserCursor } from '@/stores/user';

import PageLayout from './PageLayout';

export default function NewProjectPage() {
  const documentId = useCurrentDocumentId();
  const addDocument = useDocumentStore((ctx) => ctx.addDocument);
  const setUserCursor = useSetUserCursor();

  useEffect(() => {
    if (!documentId) {
      let newDocument = createDocument();
      newDocument.documentTitle = 'My Movie';
      newDocument.firstCreatedMillis = Date.now();
      newDocument.lastUpdatedMillis = newDocument.firstCreatedMillis;
      addDocument(newDocument);
      setUserCursor(newDocument.documentId, '', '', '');
    }
  }, [documentId, addDocument, setUserCursor]);

  return (
    <PageLayout className="overflow-y-auto py-10">
      <fieldset className="m-auto flex flex-col gap-2">
        <legend className="py-4">
          <h3 className="text-xl">Create your project</h3>
          <p className="text-xs opacity-30">
            Change to whatever floats your boat :)
          </p>
        </legend>
        <SettingsProjectNameField />
        <SettingsProjectIdField />
        <SettingsAutoSaveToField />
        <div className="h-0" />
        <SettingsProjectStartButton />
        <SettingsReturnHomeField />
        <SettingsProjectInstallField />
        <br />
      </fieldset>
      <div className="absolute top-2 right-2 bg-white">
        <GoogleConnectButton />
      </div>
    </PageLayout>
  );
}
