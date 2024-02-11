import FieldSelect from '@/fields/FieldSelect';
import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';

export default function SettingsAspectRatioField() {
  const documentId = useCurrentDocumentId();
  const documentSettingsAspectRatio = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.aspectRatio,
  );
  const setDocumentSettingsAspectRatio = useDocumentStore(
    (ctx) => ctx.setDocumentSettingsAspectRatio,
  );

  /**
   * @type {import('react').ChangeEventHandler<HTMLSelectElement>}
   */
  function onChange(e) {
    const value = e.target.value;
    setDocumentSettingsAspectRatio(
      documentId,
      /** @type {'16:9'|'4:3'} */ (value),
    );
  }

  return (
    <FieldSelect
      title="Aspect Ratio:"
      id="aspect-ratio"
      value={documentSettingsAspectRatio}
      onChange={onChange}>
      <option value="16:9">16:9 (default)</option>
      <option value="4:3">4:3</option>
    </FieldSelect>
  );
}
