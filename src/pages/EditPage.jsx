import DrawerLayout from '@/app/DrawerLayout';
import NavBarLayout from '@/app/NavBarLayout';
import DocumentEntry from '@/components/documents/DocumentEntry';
import { useProjectAutoSave } from '@/serdes/UseProjectAutoSave';
import { useCurrentDocumentId } from '@/stores/user';

import PageLayout from './PageLayout';

export default function EditPage() {
  const documentId = useCurrentDocumentId();
  useProjectAutoSave();
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
          <DocumentEntry documentId={documentId} />
        </DrawerLayout>
      </NavBarLayout>
    </PageLayout>
  );
}

function DrawerContent() {
  return <div className="flex flex-col pb-20">Hello :)</div>;
}
