import NavBarLayout from '@/components/NavBarLayout';
import DocumentPanel from '@/components/documents/DocumentPanel';
import { useCurrentDocumentId } from '@/stores/user';

export default function EditPage() {
  const documentId = useCurrentDocumentId();
  return (
    <main className="w-full h-full flex flex-col bg-white">
      <NavBarLayout>
        <DocumentPanel documentId={documentId} />
      </NavBarLayout>
    </main>
  );
}
