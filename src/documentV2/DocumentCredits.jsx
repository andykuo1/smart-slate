import { getDocumentSettingsById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function DocumentCredits({ documentId }) {
  const directorName = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.directorName,
  );
  const cameraName = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.cameraName,
  );
  return (
    <header className="mx-auto mb-[0.5in] flex max-w-[60%] flex-col gap-2 text-center">
      {directorName && (
        <>
          <div>directed by</div>
          <div>{directorName}</div>
        </>
      )}
      {cameraName && (
        <>
          <div>photography by</div>
          <div>{cameraName}</div>
        </>
      )}
    </header>
  );
}
