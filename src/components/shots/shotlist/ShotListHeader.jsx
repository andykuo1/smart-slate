import SettingsSceneShotsDetailButton from '@/components/scenes/settings/SettingsSceneShotsDetailButton';
import SettingsSceneShotsRenumberButton from '@/components/scenes/settings/SettingsSceneShotsRenumberButton';
import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import { useUserStore } from '@/stores/user';

import AddShotTray from '../AddShotTray';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
export default function ShotListHeader({
  className,
  documentId,
  sceneId,
  blockId,
}) {
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const sequenceMode = useUserStore((ctx) => ctx.editMode === 'sequence');
  return (
    <div
      className={
        'my-2 flex items-center gap-2 rounded-xl bg-gray-100 px-2 italic dark:bg-gray-800' +
        ' ' +
        className
      }>
      <div className="flex flex-1 items-center">
        <div className="ml-auto">{'Shot List ' + sceneNumber}</div>
        <div className="ml-2 h-6 border-l-2" />
      </div>
      <AddShotTray
        className={'hidden' + ' ' + (sequenceMode ? 'lg:flex' : 'sm:flex')}
        documentId={documentId}
        sceneId={sceneId}
        blockId={blockId}
      />
      <div className="flex flex-1 items-center">
        <div className="h-6 border-l-2" />
        <SettingsSceneShotsRenumberButton
          className=""
          documentId={documentId}
          sceneId={sceneId}
        />
        <SettingsSceneShotsDetailButton className="w-auto" />
      </div>
    </div>
  );
}
