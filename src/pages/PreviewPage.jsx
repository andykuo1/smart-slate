import Toolbar from '@/components/Toolbar';
import Drawer from '@/drawer/Drawer';
import { useGoogleDriveAutoSync } from '@/libs/googleapi/sync/UseGoogleDriveAutoSync';
import { useCurrentDocumentId } from '@/stores/user';

import PageLayout from './PageLayout';

export default function PreviewPage() {
  // This is within the project context, so get the current document id...
  useCurrentDocumentId();
  // ...and auto-sync on interval.
  useGoogleDriveAutoSync();

  return (
    <PageLayout className="bg-white text-black">
      <Drawer darkMode={false}>
        <Toolbar />
      </Drawer>
    </PageLayout>
  );
}
