import RecorderOpenButton from '@/recorder/RecorderOpenButton';
import { useShotTakeCount } from '@/stores/document/use';
import { useSetUserCursor } from '@/stores/user';

import BoxDrawingCharacter from '../documents/BoxDrawingCharacter';
import { getListDecorationStyleByViewMode } from './TakeListViewMode';
import TakePreview from './TakePreview';
import TakeRecordVideoIcon from './TakeRecordVideoIcon';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {string} props.viewMode
 */
export default function TakeEntryHeaderNew({
  className,
  documentId,
  sceneId,
  shotId,
  viewMode,
}) {
  const takeCount = useShotTakeCount(documentId, shotId);
  const takeNumber = takeCount + 1;
  const takeCaption = `(T${takeNumber})`;
  const takeName = `Record Take #${takeNumber}`;
  const setUserCursor = useSetUserCursor();
  const listDecorationStyle = getListDecorationStyleByViewMode(viewMode);
  return (
    <div className={'flex flex-row bg-gray-200' + ' ' + className}>
      <BoxDrawingCharacter
        className={'mx-2' + ' ' + listDecorationStyle}
        depth={1}
        start={false}
        end={takeNumber === 1}
      />
      <RecorderOpenButton
        className="text-sm"
        onClick={() => setUserCursor(documentId, sceneId, shotId)}>
        <TakePreview
          title={takeName}
          caption={takeCaption}
          previewImage=""
          Icon={TakeRecordVideoIcon}
        />
      </RecorderOpenButton>
    </div>
  );
}
