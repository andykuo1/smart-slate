import { useCallback } from 'react';

import { useShotDescription } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { choosePlaceholderRandomly } from '@/values/PlaceholderText';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {boolean} props.disabled
 */
export default function ShotTextArea({
  className,
  documentId,
  shotId,
  disabled,
}) {
  const text = useShotDescription(documentId, shotId);
  const setShotDescription = useDocumentStore((ctx) => ctx.setShotDescription);

  const onChange = useCallback(
    /** @type {import('react').ChangeEventHandler<HTMLTextAreaElement>} */
    function _onChange(e) {
      setShotDescription(documentId, shotId, e.target.value);
    },
    [documentId, shotId, setShotDescription],
  );

  return (
    <textarea
      className={
        'h-full w-full resize-none overflow-hidden bg-transparent italic outline-none' +
        ' ' +
        className
      }
      value={text}
      placeholder={choosePlaceholderRandomly(shotId)}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
