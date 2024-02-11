import { Fragment, useEffect, useRef, useState } from 'react';

import { useIntersectionObserver } from '@/libs/UseIntersectionObserver';
import { useSceneIds } from '@/stores/document/use';

import BlockList from '../blocks/BlockList';
import SceneEntryLayout from './SceneEntryLayout';
import SceneEntryNew from './SceneEntryNew';
import SceneHeader from './SceneHeader';
import ScenePlaceholder from './ScenePlaceholder';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function SceneList({ documentId }) {
  const sceneIds = useSceneIds(documentId);
  // const activeSceneId = useUserStore((ctx) => ctx.cursor?.sceneId);
  return (
    <>
      <PerScene sceneIds={sceneIds}>
        {(sceneId) => <SceneEntry documentId={documentId} sceneId={sceneId} />}
      </PerScene>
      <SceneEntryNew className="pb-20" documentId={documentId} />
      {/*activeSceneId && (
        <SceneEntryFocused documentId={documentId}>
          <SceneHeader documentId={documentId} sceneId={activeSceneId} />
          <BlockList documentId={documentId} sceneId={activeSceneId} />
        </SceneEntryFocused>
      )*/}
    </>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {boolean} [props.hidden]
 */
export function SceneEntry({ className, documentId, sceneId, hidden = false }) {
  const containerRef = useRef(null);
  const contentRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const [height, setHeight] = useState(0);
  const visible = useIntersectionObserver(containerRef, '0px');
  useEffect(() => {
    const content = contentRef.current;
    if (!content) {
      return;
    }
    if (visible) {
      const bounding = content.getBoundingClientRect();
      setHeight(bounding.height);
    }
  }, [visible]);

  return (
    <SceneEntryLayout
      className={
        hidden ? /* NOTE: Quick hideaway to not lag. */ 'hidden' : className
      }
      containerRef={containerRef}>
      <SceneHeader documentId={documentId} sceneId={sceneId} />
      {visible ? (
        <BlockList
          containerRef={contentRef}
          documentId={documentId}
          sceneId={sceneId}
        />
      ) : (
        <ScenePlaceholder height={height} />
      )}
    </SceneEntryLayout>
  );
}

/**
 * @param {object} props
 * @param {Array<import('@/stores/document/DocumentStore').SceneId>} props.sceneIds
 * @param {(
 * blockId: import('@/stores/document/DocumentStore').SceneId,
 * index: number,
 * array: Array<import('@/stores/document/DocumentStore').SceneId>
 * ) => import('react').ReactNode} props.children
 */
export function PerScene({ sceneIds, children }) {
  return (
    <>
      {sceneIds.map((sceneId, index, array) => (
        <Fragment key={`scene-${sceneId}`}>
          {children(sceneId, index, array)}
        </Fragment>
      ))}
    </>
  );
}
