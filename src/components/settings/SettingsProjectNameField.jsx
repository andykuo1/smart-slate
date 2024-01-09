import {
  getDocumentSettingsById,
  useDocumentStore,
  useDocumentTitle,
} from '@/stores/document';
import { useCurrentDocumentId } from '@/stores/user';

import SettingsInputField from './SettingsInputField';

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
    <SettingsInputField
      title="Project Name:"
      id="project-name"
      placeholder="Untitled"
      required={true}
      value={documentTitle}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
}
