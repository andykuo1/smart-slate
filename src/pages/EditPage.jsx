import Toolbar from '@/components/Toolbar';
import DocumentLayout from '@/components/documents/DocumentLayout';
import DocumentTitle from '@/components/documents/DocumentTitle';
import SceneList from '@/components/scenes/SceneList';
import Drawer from '@/drawer/Drawer';
import NavBar from '@/navbar/NavBar';
import { useCurrentDocumentId } from '@/stores/user';

import PageLayout from './PageLayout';

export default function EditPage() {
  const documentId = useCurrentDocumentId();
  return (
    <PageLayout className="bg-white text-black dark:bg-gray-900 dark:text-white">
      <NavBar>
        <Drawer
          darkMode={false}
          className="bottom-20"
          containerClassName="bottom-20">
          <Toolbar />
          <DocumentLayout documentId={documentId}>
            <DocumentTitle className="pt-20" documentId={documentId} />
            <SceneList documentId={documentId} />
          </DocumentLayout>
        </Drawer>
      </NavBar>
    </PageLayout>
  );
}
