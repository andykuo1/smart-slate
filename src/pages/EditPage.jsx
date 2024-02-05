import DocumentLayout from '@/components/documents/DocumentLayout';
import DocumentTitle from '@/components/documents/DocumentTitle';
import SceneList from '@/components/scenes/SceneList';
import Drawer from '@/drawer/Drawer';
import { useCurrentDocumentId } from '@/stores/user';

import PageLayout from './PageLayout';

export default function EditPage() {
  const documentId = useCurrentDocumentId();
  return (
    <PageLayout>
      <Drawer darkMode={false}>
        <DocumentLayout documentId={documentId}>
          <DocumentTitle className="pt-20" documentId={documentId} />
          <SceneList documentId={documentId} />
        </DocumentLayout>
      </Drawer>
    </PageLayout>
  );
}
