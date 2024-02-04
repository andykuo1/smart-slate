import SettingsDocumentNavButton from './SettingsDocumentNavButton';

/**
 *
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function DocumentToolbar({ documentId }) {
  return (
    <>
      <SettingsDocumentNavButton />
    </>
  );
}
