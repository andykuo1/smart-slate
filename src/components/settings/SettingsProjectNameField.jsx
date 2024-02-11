import FieldInput from '@/fields/FieldInput';
import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentStore, useDocumentTitle } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';

export default function SettingsProjectNameField() {
  const documentId = useCurrentDocumentId();
  const [documentTitle, setDocumentTitle] = useDocumentTitle(documentId);
  const documentSettingsProjectId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );

  /**
   * @type {import('react').ChangeEventHandler<HTMLInputElement>}
   */
  function onChange(e) {
    let target = e.target;
    setDocumentTitle(documentId, target.value);
  }

  return (
    <FieldInput
      title="Project Name:"
      id="project-name"
      placeholder="Untitled"
      required={true}
      value={documentTitle}
      onChange={onChange}
      autoFocus={!documentSettingsProjectId}
      autoCapitalize="words"
    />
  );
}
