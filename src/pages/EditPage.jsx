import DrawerLayout from '@/components/DrawerLayout';
import NavBarLayout from '@/components/NavBarLayout';
import DocumentEntry from '@/components/documents/DocumentEntry';
import { useCurrentDocumentId } from '@/stores/user';

export default function EditPage() {
  const documentId = useCurrentDocumentId();
  return (
    <main className="w-full h-full flex flex-col bg-white">
      <NavBarLayout>
        <DrawerLayout
          content={() => (
            <>
              <p className="w-full p-2">
                Something strange in the neighborhood...
              </p>
              <p className="w-full p-2">Who are you going to call?</p>
            </>
          )}>
          <DocumentEntry documentId={documentId} />
        </DrawerLayout>
      </NavBarLayout>
    </main>
  );
}
