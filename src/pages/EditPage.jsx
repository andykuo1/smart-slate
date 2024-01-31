import DrawerLayout from '@/app/DrawerLayout';
import NavBarLayout from '@/app/NavBarLayout';
import DocumentLayout from '@/components/documents/DocumentLayout';
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
          content={() => (
            <>
              <div className="m-2 p-2 border-l-4 border-gray-400 bg-gray-300 font-bold font-serif">
                <p>
                  <i>Something strange in the neighborhood...</i>
                </p>
                <p className="text-right">
                  <i>Who are you going to call?</i>
                </p>
                <p className="text-center mt-2">GHOSTBUSTERS!</p>
              </div>
              <DrawerContent />
            </>
          )}>
          <DocumentLayout documentId={documentId}>
            <DocumentTitle className="pt-20" documentId={documentId} />
            <SceneList documentId={documentId} />
          </DocumentLayout>
        </DrawerLayout>
      </NavBarLayout>
    </PageLayout>
  );
}

function DrawerContent() {
  return <div className="flex flex-col pb-20">Hello :)</div>;
}
