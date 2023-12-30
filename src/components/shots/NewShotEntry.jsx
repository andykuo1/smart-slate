import { useDocumentStore } from '@/stores/document';
import { createShot } from '@/stores/document/DocumentStore';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
export default function NewShotEntry({ documentId, blockId }) {
  const addShot = useDocumentStore((ctx) => ctx.addShot);

  function onClick() {
    let newShot = createShot();
    addShot(documentId, blockId, newShot);
  }

  return (
    <li className="flex flex-row w-[50%] ml-auto">
      <button
        className="flex-1 text-right bg-gradient-to-l from-gray-300 to-transparent px-4 py-2 my-2 rounded-full"
        onClick={onClick}>
        + New Shot
      </button>
    </li>
  );
}
