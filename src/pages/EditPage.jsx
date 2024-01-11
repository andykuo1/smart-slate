import NavBarLayout from '@/components/NavBarLayout';
import DocumentEntry from '@/components/documents/DocumentEntry';
import { useCurrentDocumentId } from '@/stores/user';

export default function EditPage() {
  const documentId = useCurrentDocumentId();
  return (
    <main className="w-full h-full flex flex-col bg-white">
      <NavBarLayout>
        <DocumentEntry documentId={documentId} />
      </NavBarLayout>
    </main>
  );
}
