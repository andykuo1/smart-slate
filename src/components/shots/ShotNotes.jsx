import { useSetShotDescription, useShotDescription } from '@/stores/document';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export default function ShotNotes({ className, documentId, shotId }) {
  const description = useShotDescription(documentId, shotId);
  const setShotDescription = useSetShotDescription();

  /** @type {import('react').ChangeEventHandler<HTMLTextAreaElement>} */
  function onChange(e) {
    let el = e.target;
    setShotDescription(documentId, shotId, el.value);
  }

  return (
    <textarea
      className={
        'm-1 resize-none overflow-y-auto overflow-x-hidden bg-transparent p-2' +
        ' ' +
        className
      }
      value={description}
      onChange={onChange}
      placeholder="Additional notes..."
    />
  );
}
