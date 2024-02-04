import DocumentDrawer from '@/components/documents/DocumentDrawer';
import DocumentLayout from '@/components/documents/DocumentLayout';
import DocumentTitle from '@/components/documents/DocumentTitle';
import SceneList from '@/components/scenes/SceneList';
import { useCurrentDocumentId } from '@/stores/user';

import PageLayout from './PageLayout';

export default function EditPage() {
  const documentId = useCurrentDocumentId();
  return (
    <PageLayout>
      <DocumentDrawer darkMode={false} documentId={documentId}>
        <DocumentLayout documentId={documentId}>
          <DocumentTitle className="pt-20" documentId={documentId} />
          <SceneList documentId={documentId} />
        </DocumentLayout>
      </DocumentDrawer>
    </PageLayout>
  );
}
