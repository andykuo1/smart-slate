import DocumentPanel from '@/components/shotlist/DocumentPanel';
import { useCurrentDocumentId } from '@/stores/user';

export default function EditPage() {
  const documentId = useCurrentDocumentId();
  return (
    <main className="w-full h-full flex flex-col items-center bg-white">
      <DocumentPanel documentId={documentId} />
    </main>
  );
}
