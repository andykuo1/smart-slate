import Toolbar from '@/components/Toolbar';
import DocumentParts from '@/documentV2/DocumentParts';
import ShotReferenceEditor from '@/documentV2/ShotReferenceEditor';
import Drawer from '@/drawer/Drawer';
import { useGoogleDriveAutoSync } from '@/libs/googleapi/sync/UseGoogleDriveAutoSync';
import { useCurrentDocumentId } from '@/stores/user';

import PageLayout from './PageLayout';

export default function EditPage() {
  // This is within the project context, so get the current document id...
  const documentId = useCurrentDocumentId();
  // ...and auto-sync on interval.
  useGoogleDriveAutoSync();

  return (
    <PageLayout className="bg-white text-black dark:bg-gray-900 dark:text-white">
      <Drawer darkMode={false}>
        <Toolbar />
        <DocumentParts documentId={documentId} />
        <ShotReferenceEditor />
      </Drawer>
    </PageLayout>
  );
}
