import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentStore, useDocumentTitle } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';

import SettingsFieldInput from './SettingsFieldInput';

export default function SettingsProjectNameField() {
  const documentId = useCurrentDocumentId();
  const [documentTitle, setDocumentTitle] = useDocumentTitle(documentId);
  const documentSettingsProjectId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );
  const setDocumentSettingsProjectId = useDocumentStore(
    (ctx) => ctx.setDocumentSettingsProjectId,
  );

  /**
   * @type {import('react').ChangeEventHandler<HTMLInputElement>}
   */
  function onChange(e) {
    let target = e.target;
    setDocumentTitle(documentId, target.value);
  }

  function onBlur() {
    if (!documentSettingsProjectId) {
      setDocumentSettingsProjectId(documentId, documentTitle);
    }
  }

  return (
    <SettingsFieldInput
      title="Project Name:"
      id="project-name"
      placeholder="Untitled"
      required={true}
      value={documentTitle}
      onChange={onChange}
      onBlur={onBlur}
      autoFocus={!documentSettingsProjectId}
      autoCapitalize="words"
    />
  );
}
