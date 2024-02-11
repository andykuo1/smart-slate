import NavigateBeforeIcon from '@material-symbols/svg-400/rounded/navigate_before.svg';
import NavigateNextIcon from '@material-symbols/svg-400/rounded/navigate_next.svg';
import StatOneIcon from '@material-symbols/svg-400/rounded/stat_1.svg';
import StatMinusOneIcon from '@material-symbols/svg-400/rounded/stat_minus_1.svg';

import { useShotOrder } from '@/stores/document';
import { useDocumentStore, useSceneShotCount } from '@/stores/document/use';

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
 * @param {boolean} [props.isRightArrow]
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
  isRightArrow = undefined,
}) {
  const moveShotUp = useDocumentStore((ctx) => ctx.moveShotUp);
  const moveShotDown = useDocumentStore((ctx) => ctx.moveShotDown);
  const shotOrder = useShotOrder(documentId, sceneId, shotId);
  const shotCount = useSceneShotCount(documentId, sceneId);
  const isFirst = shotOrder <= 1;
  const isLast = shotOrder >= shotCount;

  function onDownClick() {
    moveShotDown(documentId, sceneId, blockId, shotId);
  }

  function onUpClick() {
    moveShotUp(documentId, sceneId, blockId, shotId);
  }

  const UpIcon = collapsed ? NavigateBeforeIcon : StatOneIcon;
  const DownIcon = collapsed ? NavigateNextIcon : StatMinusOneIcon;

  return (
    <div
      className={
        'group flex h-full translate-x-1 flex-col items-center py-2.5' +
        ' ' +
        className
      }>
      {(!collapsed || !isRightArrow) && (
        <button
          onClick={onUpClick}
          disabled={!editable || isFirst}
          className="my-auto disabled:opacity-30">
          <UpIcon className="h-6 w-6 fill-current" />
        </button>
      )}
      {(!collapsed || isRightArrow) && (
        <button
          onClick={onDownClick}
          disabled={!editable || isLast}
          className="my-auto disabled:opacity-30">
          <DownIcon className="h-6 w-6 fill-current" />
        </button>
      )}
    </div>
  );
}
