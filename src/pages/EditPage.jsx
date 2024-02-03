import DrawerLayout from '@/app/DrawerLayout';
import NavBarLayout from '@/app/NavBarLayout';
import DocumentLayout from '@/components/documents/DocumentLayout';
import DocumentOutline from '@/components/documents/DocumentOutline';
import DocumentTitle from '@/components/documents/DocumentTitle';
import SceneList from '@/components/scenes/SceneList';
import { useCurrentDocumentId } from '@/stores/user';

import PageLayout from './PageLayout';

export default function EditPage() {
  const documentId = useCurrentDocumentId();
  return (
    <PageLayout>
      <NavBarLayout>
        <DrawerLayout
          content={() => <DocumentOutline documentId={documentId} />}>
          <DocumentLayout documentId={documentId}>
            <DocumentTitle className="pt-20" documentId={documentId} />
            <SceneList documentId={documentId} />
          </DocumentLayout>
        </DrawerLayout>
      </NavBarLayout>
    </PageLayout>
  );
}
