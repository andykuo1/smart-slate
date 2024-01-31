import StatOneIcon from '@material-symbols/svg-400/rounded/stat_1.svg';
import StatMinusOneIcon from '@material-symbols/svg-400/rounded/stat_minus_1.svg';

import { getShotIdsInOrder, useShotOrder } from '@/stores/document';
import { useDocumentStore, useSceneShotCount } from '@/stores/document/use';

import BoxDrawingCharacter from '../documents/BoxDrawingCharacter';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {object} props.handleProps
 * @param {import('react').ReactNode} [props.children]
 * @param {boolean} [props.editable]
 * @param {boolean} [props.collapsed]
 */
export default function ShotEntry({
  className,
  documentId,
  sceneId,
  blockId,
  shotId,
  handleProps,
  editable,
  collapsed,
}) {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const moveShot = useDocumentStore((ctx) => ctx.moveShot);
  const shotOrder = useShotOrder(documentId, sceneId, shotId);
  const shotCount = useSceneShotCount(documentId, sceneId);
  const isFirst = shotOrder <= 1;
  const isLast = shotOrder >= shotCount;

  function onDownClick() {
    const store = UNSAFE_getStore();
    const shotIds = getShotIdsInOrder(store, documentId, blockId);
    const i = shotIds.indexOf(shotId);
    if (i < 0 || i >= shotIds.length) {
      return;
    }
    const nextShotId = shotIds.at(i + 1);
    if (!nextShotId) {
      return;
    }
    moveShot(documentId, blockId, shotId, nextShotId);
  }

  function onUpClick() {
    const store = UNSAFE_getStore();
    const shotIds = getShotIdsInOrder(store, documentId, blockId);
    const i = shotIds.indexOf(shotId);
    if (i <= 0 || i >= shotIds.length) {
      return;
    }
    const prevShotId = shotIds.at(i - 1);
    if (!prevShotId) {
      return;
    }
    moveShot(documentId, blockId, shotId, prevShotId, true);
  }

  return (
    <div
      className={
        'group h-full flex flex-col items-center translate-x-1 py-2.5' +
        ' ' +
        className
      }>
      <button
        onClick={onUpClick}
        disabled={!editable || isFirst}
        className="disabled:opacity-30">
        <StatOneIcon className="w-6 h-6 fill-current" />
      </button>
      <BoxDrawingCharacter
        className={
          'w-full text-center overflow-hidden' +
          ' ' +
          (!editable ? 'opacity-30' : 'cursor-grab')
        }
        depth={0}
        start={false}
        end={isLast}
        containerProps={{ ...(editable && collapsed ? handleProps : {}) }}
      />
      <button
        onClick={onDownClick}
        disabled={!editable || isLast}
        className="disabled:opacity-30">
        <StatMinusOneIcon className="w-6 h-6 fill-current" />
      </button>
    </div>
  );
}
