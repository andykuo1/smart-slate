import ThumbUpIcon from '@material-symbols/svg-400/rounded/thumb_up-fill.svg';

import { getTakeById, useTakeNumber, useTakeRating } from '@/stores/document';
import { useDocumentStore, useShotTakeCount } from '@/stores/document/use';

import BoxDrawingCharacter from '../documents/BoxDrawingCharacter';
import { getListDecorationStyleByViewMode } from './TakeListViewMode';
import TakeOptions from './TakeOptions';
import TakePreview from './TakePreview';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 * @param {string} props.viewMode
 * @param {import('react').ReactNode} [props.children]
 */
export default function TakeEntryHeader({
  className,
  documentId,
  sceneId,
  shotId,
  takeId,
  viewMode,
  children,
}) {
  const takeCount = useShotTakeCount(documentId, shotId);
  const takeNumber = useTakeNumber(documentId, shotId, takeId);
  const rating = useTakeRating(documentId, takeId);
  const previewImage = useDocumentStore(
    (ctx) => getTakeById(ctx, documentId, takeId)?.previewImage,
  );
  const takeCaption = takeNumber ? `T${takeNumber}` : `(T${takeCount + 1})`;
  const takeName = `Take #${takeNumber}`;

  const isGood = rating > 0;
  const showListDecorations = viewMode === 'list';
  const listDecorationStyle = getListDecorationStyleByViewMode(viewMode);
  return (
    <div className={'flex flex-row' + ' ' + className}>
      <BoxDrawingCharacter
        className={'mx-2' + ' ' + listDecorationStyle}
        depth={1}
        start={false}
        end={takeNumber === 1}
      />
      <TakeOptions
        documentId={documentId}
        sceneId={sceneId}
        shotId={shotId}
        takeId={takeId}
        showButton={showListDecorations}
        disabled={!takeId}>
        <TakePreview
          previewImage={previewImage}
          title={takeName}
          caption={takeCaption}>
          {isGood && (
            <ThumbUpIcon className="absolute top-1 right-1 w-6 h-6 fill-white bg-black rounded-full p-1 pointer-events-none" />
          )}
        </TakePreview>
      </TakeOptions>
      {children}
    </div>
  );
}
