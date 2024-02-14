import FieldInput from '@/fields/FieldInput';
import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function SettingsCreditCameraNameField({ className }) {
  const documentId = useCurrentDocumentId();
  const cameraName = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.cameraName,
  );
  const setCameraName = useDocumentStore(
    (ctx) => ctx.setDocumentSettingsCameraName,
  );

  /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
  function onChange(e) {
    const target = /** @type {HTMLInputElement} */ (e.target);
    // NOTE: Remove all newlines.
    const value = target.value.replace(/\n/g, '');
    setCameraName(documentId, value);
  }

  return (
    <FieldInput
      className={className}
      title="Camera Operator Name:"
      id="camera-name"
      value={cameraName}
      onChange={onChange}
      placeholder="TED LOGAN"
      autoCapitalize="characters"
    />
  );
}
