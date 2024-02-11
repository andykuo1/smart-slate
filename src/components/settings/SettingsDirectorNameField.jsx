import FieldInput from '@/fields/FieldInput';
import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function ClapperDirectorNameField({ className }) {
  const documentId = useCurrentDocumentId();
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
    <FieldInput
      className={className}
      title="Director Name:"
      id="director-name"
      value={directorName}
      onChange={onChange}
      placeholder="BILL PRESTON ESQ."
      autoCapitalize="characters"
    />
  );
}
