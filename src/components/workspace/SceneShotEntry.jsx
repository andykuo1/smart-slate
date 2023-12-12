import {
  useSetShotDescription,
  useShotDescription,
} from '@/stores/DocumentStoreContext';

export default function SceneShotEntry() {
  return null;
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
export function ShotNotes({ className, documentId, shotId }) {
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
        'resize-none m-1 p-2 bg-transparent overflow-x-hidden overflow-y-auto' +
        ' ' +
        className
      }
      value={description}
      onChange={onChange}
      placeholder="Additional notes..."
    />
  );
}
