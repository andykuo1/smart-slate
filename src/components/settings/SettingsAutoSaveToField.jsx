import { useGoogleStatus } from '@/libs/googleapi/auth/UseGoogleStatus';
import { getDocumentById, getDocumentSettingsById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';

import SettingsFieldSelect from './SettingsFieldSelect';

export default function SettingsAutoSaveToField() {
  const documentId = useCurrentDocumentId();
  const autoSaveTo = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.autoSaveTo,
  );
  const googleStatus = useGoogleStatus();
  const lastExportedMillis = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.lastExportedMillis,
  );
  const setDocumentSettingsAutoSaveTo = useDocumentStore(
    (ctx) => ctx.setDocumentSettingsAutoSaveTo,
  );
  /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
  function onChange(e) {
    const target = e.target;
    const value = /** @type {'local'|'gdrive'} */ (target.value);
    setDocumentSettingsAutoSaveTo(documentId, value);
  }
  return (
    <SettingsFieldSelect
      title="Auto-save to:"
      id="save-to"
      value={autoSaveTo}
      onChange={onChange}>
      <option value="local">
        {'<'}This local device{'>'}
      </option>
      <option
        value="gdrive"
        disabled={!googleStatus && lastExportedMillis <= 0}>
        Google Drive
      </option>
    </SettingsFieldSelect>
  );
}
