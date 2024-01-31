import { useCurrentCursor } from '@/stores/user';

import SceneEntryLayout from './SceneEntryLayout';

/**
 * This works by escaping document flow as an overlay. Every
 * deeper focus will use this overlay as its root.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export default function SceneEntryFocused({ className, children }) {
  const { sceneId } = useCurrentCursor();
  if (!sceneId) {
    return null;
  }
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 overflow-y-auto bg-white">
      <SceneEntryLayout className={className}>{children}</SceneEntryLayout>
    </div>
  );
}
