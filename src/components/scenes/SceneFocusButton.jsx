import { useCurrentCursor, useSetUserCursor } from '@/stores/user';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SceneFocusButton({ documentId, sceneId }) {
  const currentCursor = useCurrentCursor();
  const setUserCursor = useSetUserCursor();
  const isActive =
    currentCursor.documentId === documentId &&
    currentCursor.sceneId === sceneId &&
    !currentCursor.shotId;
  return (
    <button
      className={
        'rounded px-2 whitespace-nowrap' +
        ' ' +
        (isActive ? 'bg-gray-600' : 'bg-gray-300')
      }
      onClick={() => {
        if (isActive) {
          setUserCursor(documentId, '', '');
        } else {
          setUserCursor(documentId, sceneId, '');
        }
      }}>
      {isActive ? 'unfocus?' : 'focus?'}
    </button>
  );
}
