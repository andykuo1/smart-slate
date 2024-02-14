import FieldInput from '@/fields/FieldInput';
import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function SettingsCreditWriterNameField({ className }) {
  const documentId = useCurrentDocumentId();
  const writerName = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.writerName,
  );
  const setWriterName = useDocumentStore(
    (ctx) => ctx.setDocumentSettingsWriterName,
  );

  /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
  function onChange(e) {
    const target = /** @type {HTMLInputElement} */ (e.target);
    // NOTE: Remove all newlines.
    const value = target.value.replace(/\n/g, '');
    setWriterName(documentId, value);
  }

  return (
    <FieldInput
      className={className}
      title="Writer Name:"
      id="writer-name"
      value={writerName}
      onChange={onChange}
      placeholder="Rufus"
      autoCapitalize="characters"
    />
  );
}
