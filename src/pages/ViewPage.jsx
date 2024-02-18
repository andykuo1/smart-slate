import ViewerBooth from '@/app/ViewerBooth';
import Drawer from '@/drawer/Drawer';
import { useGoogleDriveAutoSync } from '@/libs/googleapi/sync/UseGoogleDriveAutoSync';
import { useCurrentDocumentId, useUserStore } from '@/stores/user';

import PDFBooth from './PDFBooth';
import PageLayout from './PageLayout';

export default function ViewPage() {
  // This is within the project context, so get the current document id...
  useCurrentDocumentId();
  // ...and auto-sync on interval.
  useGoogleDriveAutoSync();

  const viewerMode = useUserStore((ctx) => ctx.viewer.mode);
  return (
    <PageLayout className="bg-black text-white">
      <Drawer>{viewerMode === 'video' ? <ViewerBooth /> : <PDFBooth />}</Drawer>
    </PageLayout>
  );
}
