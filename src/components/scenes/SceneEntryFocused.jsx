import ExpandMoreIcon from '@material-symbols/svg-400/rounded/expand_more.svg';

import { useCurrentCursor, useSetUserCursor } from '@/stores/user';

import SceneEntryLayout from './SceneEntryLayout';

/**
 * This works by escaping document flow as an overlay. Every
 * deeper focus will use this overlay as its root.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('react').ReactNode} props.children
 */
export default function SceneEntryFocused({ className, documentId, children }) {
  const { sceneId } = useCurrentCursor();
  const setUserCursor = useSetUserCursor();
  if (!sceneId) {
    return null;
  }
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 overflow-y-auto bg-white">
      <SceneEntryLayout className={className}>{children}</SceneEntryLayout>
      <button
        className="w-full flex items-center from-transparent to-white bg-gradient-to-b"
        onClick={() => setUserCursor(documentId, '', '', '')}>
        <span className="mx-auto flex items-center p-2">
          <ExpandMoreIcon className="w-6 h-6 fill-current" />
          <span className="px-4">Return to screenplay</span>
          <ExpandMoreIcon className="w-6 h-6 fill-current" />
        </span>
      </button>
    </div>
  );
}
