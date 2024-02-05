import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';

import ClapperInput from './ClapperInput';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function ClapperDirectorNameField({ className, documentId }) {
  const directorName = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.directorName,
  );
  const setDirectorName = useDocumentStore(
    (ctx) => ctx.setDocumentSettingsDirectorName,
  );

  /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
  function onChange(e) {
    const target = /** @type {HTMLInputElement} */ (e.target);
    // NOTE: Remove all newlines.
    const value = target.value.replace(/\n/g, '');
    setDirectorName(documentId, value);
  }

  return (
    <ClapperInput
      className={className}
      name="director-name"
      value={directorName || ''}
      onChange={onChange}
      placeholder="BILL PRESTON ESQ."
      autoCapitalize="characters"
    />
  );
}
