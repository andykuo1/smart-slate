import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';

import ClapperInput from './ClapperInput';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function ClapperCameraNameField({ className, documentId }) {
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
    <ClapperInput
      className={className}
      name="camera-name"
      value={cameraName || ''}
      onChange={onChange}
      placeholder="TED LOGAN"
      autoCapitalize="characters"
    />
  );
}
