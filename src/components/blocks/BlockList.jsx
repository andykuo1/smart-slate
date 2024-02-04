import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { getBlockIdsInOrder } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useUserStore } from '@/stores/user';
import { tryGetWindow } from '@/utils/BrowserFeatures';

import ShotList from '../shots/ShotList';
import BlockEntry from './BlockEntry';
import BlockEntryFocused from './BlockEntryFocused';

/*
# Different Modes 
- Inline
- Sequence
- Detailed (only ever forced; can be forced open/close text)
- Auto? (small:inline, med:seq)
 */

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MutableRefObject<HTMLDivElement|null>} [props.containerRef]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function BlockList({
  className,
  containerRef,
  documentId,
  sceneId,
}) {
  const blockIds = useDocumentStore(
    useShallow((ctx) => getBlockIdsInOrder(ctx, documentId, sceneId)),
  );
  const activeShotId = useUserStore((ctx) => ctx.cursor?.shotId);
  const smallMedia = useMatchMedia('(max-width: 640px)');
  const inlineMode = useUserStore((ctx) => ctx.editMode === 'inline');
  const sequenceMode = useUserStore((ctx) => ctx.editMode === 'sequence');
  const shotListMode = useUserStore((ctx) => ctx.shotListMode === 'detail');
  const blockViewMode = activeShotId
    ? 'faded'
    : sequenceMode
      ? 'split'
      : inlineMode
        ? 'fullwidth'
        : 'fullwidth';

  const showSceneLevelShotList = sequenceMode;
  const showBlockLevelShotList = inlineMode;

  const isCollapsed = !shotListMode && !activeShotId;
  if (activeShotId) {
    return <BlockEntryFocused documentId={documentId} />;
  }
  return (
    <div ref={containerRef} className={'flex flex-row' + ' ' + className}>
      <div className="flex-1 flex flex-col">
        {blockIds.map((blockId) => (
          <BlockEntry
            key={`block-${blockId}`}
            documentId={documentId}
            sceneId={sceneId}
            blockId={blockId}
            mode={blockViewMode}>
            <ShotList
              className="flex-1 max-w-[100vw]"
              documentId={documentId}
              sceneId={sceneId}
              blockId={blockId}
              editable={!activeShotId}
              collapsed={isCollapsed}
              hidden={!showBlockLevelShotList}
            />
          </BlockEntry>
        ))}
      </div>
      <ShotList
        className="flex-1 max-w-[50vw]"
        documentId={documentId}
        sceneId={sceneId}
        collapsed={smallMedia || isCollapsed}
        hidden={!showSceneLevelShotList}
      />
    </div>
  );
}

/**
 * @param {string} mediaQueryString
 */
function useMatchMedia(mediaQueryString) {
  const [state, setState] = useState(false);
  useEffect(() => {
    const window = tryGetWindow();
    const matcher = window.matchMedia(mediaQueryString);
    const result = matcher.matches;
    if (result !== state) {
      setState(result);
      return;
    }
    /** @param {MediaQueryListEvent} e */
    function onChange(e) {
      setState(e.matches);
    }
    matcher.addEventListener('change', onChange);
    return () => matcher.removeEventListener('change', onChange);
  }, [mediaQueryString, state, setState]);
  return state;
}
