import { useParams } from 'react-router-dom';

import DocumentPanel from '@/components/workspace/DocumentPanel';
import { useCurrentDocumentId } from '@/stores/UserStoreContext';

export default function EditPage() {
  const documentId = useCurrentDocumentId();
  const { doc = '' } = useParams();
  return (
    <main className="w-full h-full flex flex-col items-center">
      <DocumentPanel documentId={doc || documentId} />
    </main>
  );
}
