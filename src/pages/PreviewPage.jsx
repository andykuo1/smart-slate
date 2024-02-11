import Toolbar from '@/components/Toolbar';
import ShotListInDocumentOrder from '@/components/shots/shotlist/ShotListInDocumentOrder';
import Drawer from '@/drawer/Drawer';
import NavBar from '@/navbar/NavBar';
import { useCurrentDocumentId, useUserStore } from '@/stores/user';

import PageLayout from './PageLayout';

export default function PreviewPage() {
  const documentId = useCurrentDocumentId();
  const shotListMode = useUserStore((ctx) => ctx.shotListMode === 'detail');
  return (
    <PageLayout className="bg-white text-black">
      <NavBar>
        <Drawer darkMode={false}>
          <Toolbar />
          <ShotListInDocumentOrder
            className="my-20"
            documentId={documentId}
            collapsed={!shotListMode}
          />
        </Drawer>
      </NavBar>
    </PageLayout>
  );
}
