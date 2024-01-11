import ArrowForwardIcon from '@material-symbols/svg-400/rounded/arrow_forward.svg';
import ThumbUpFillIcon from '@material-symbols/svg-400/rounded/thumb_up-fill.svg';
import ThumbUpIcon from '@material-symbols/svg-400/rounded/thumb_up.svg';

import { formatShotNumber } from '@/components/takes/TakeNameFormat';
import {
  useSceneHeading,
  useShotNumber,
  useShotTakeCount,
  useTakeNumber,
  useTakeRating,
} from '@/stores/document';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} [props.takeId]
 * @param {import('@/stores/document/DocumentStore').TakeId} [props.prevTakeId]
 * @param {() => void} [props.onGoodTake]
 */
export default function RecorderBoothTitle({
  documentId,
  sceneId,
  shotId,
  takeId,
  prevTakeId,
  onGoodTake,
}) {
  const takeCount = useShotTakeCount(documentId, shotId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const [sceneHeading] = useSceneHeading(documentId, sceneId);
  const takeNumber =
    useTakeNumber(documentId, shotId, takeId || '') || takeCount + 1;
  const prevTakeNumber = useTakeNumber(documentId, shotId, prevTakeId || '');
  const prevTakeRating = useTakeRating(documentId, prevTakeId || '');
  const isGood = prevTakeId ? prevTakeRating > 0 : false;
  return (
    <>
      <span className="mx-2">{sceneHeading || 'INT/EXT. SCENE - DAY'}</span>
      <span className="flex-1" />
      <span>Shot {formatShotNumber(shotNumber)}</span>
      <span className="flex flex-row items-center mx-2">
        Take #{prevTakeId ? prevTakeNumber : takeNumber}
        {prevTakeId && (
          <button className="flex flex-row items-center" onClick={onGoodTake}>
            <ArrowForwardIcon className="inline-block w-3 h-3 fill-current" />
            <span className="opacity-60">{takeCount + 1}</span>
            <span className="my-auto mx-2">
              {!isGood ? (
                <ThumbUpIcon className="w-6 h-6 fill-current" />
              ) : (
                <ThumbUpFillIcon className="w-6 h-6 fill-current" />
              )}
            </span>
          </button>
        )}
      </span>
    </>
  );
}
