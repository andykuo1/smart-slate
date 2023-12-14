import DocumentPanel from '@/components/workspace/DocumentPanel';
import { useCurrentDocumentId } from '@/stores/UserStoreContext';

export default function EditPage() {
  const documentId = useCurrentDocumentId();
  return (
    <main className="w-full h-full flex flex-col items-center">
      <DocumentPanel documentId={documentId} />
    </main>
  );
}
