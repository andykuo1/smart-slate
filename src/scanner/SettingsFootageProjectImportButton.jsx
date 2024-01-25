import PlaylistAddIcon from '@material-symbols/svg-400/rounded/playlist_add.svg';
import PlaylistAddCheckIcon from '@material-symbols/svg-400/rounded/playlist_add_check.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import {
  findBlockWithShotId,
  findSceneWithBlockId,
  findShotWithShotHash,
  getDocumentById,
  getTakeById,
  useAddBlock,
  useAddScene,
  useAddShot,
  useAddTake,
  useSetTakePreviewImage,
} from '@/stores/document';
import {
  createBlock,
  createScene,
  createShot,
  createTake,
} from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';

import {
  createScannerChangeEvent,
  errorScanner,
  isScannerFailure,
  updateScannerStatus,
} from './ScannerResult';

/**
 * @param {object} props
 * @param {import('./ScannerResult').ScannerOutputRef} props.outputRef
 * @param {import('./ScannerResult').OnScannerChangeCallback} props.onChange
 * @param {boolean} [props.disabled]
 */
export default function SettingsFootageSaveToDiskButton({
  outputRef,
  onChange,
  disabled,
}) {
  const documentId = useCurrentDocumentId();
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setTakePreview = useSetTakePreviewImage();
  const addTake = useAddTake();
  const addShot = useAddShot();
  const addBlock = useAddBlock();
  const addScene = useAddScene();

  async function onImportVerified() {
    let output = outputRef.current;
    if (!output) {
      return;
    }
    if (!documentId) {
      return;
    }
    let event = createScannerChangeEvent(output);
    let count = 0;

    for (const key of Object.keys(output)) {
      let result = output[key];
      if (isScannerFailure(result)) {
        continue;
      }
      if (!result.takeId) {
        // Not verified.
        continue;
      }
      if (!result.snapshot) {
        // Did not have a snapshot to use.
        updateScannerStatus(
          result,
          '[ERROR: No snapshot for verified footage.]',
        );
        onChange(event);
        continue;
      }
      try {
        console.log('[TakeScanner] Imported take with snapshot in project!');
        setTakePreview(documentId, result.takeId, result.snapshot);

        updateScannerStatus(result, '[IMPORTED]');
        onChange(event);
        ++count;
      } catch (e) {
        errorScanner(result, e);
        onChange(event);
      }
    }

    // Complete!
    onChange(event);

    console.log(`[TakeScanner] Imported ${count} verified videos.`);
  }

  async function onImportAll() {
    let output = outputRef.current;
    if (!output) {
      return;
    }
    if (!documentId) {
      return;
    }
    const store = UNSAFE_getStore();
    const document = getDocumentById(store, documentId);
    let event = createScannerChangeEvent(output);
    let count = 0;

    let importedFootageBlock = null;
    let importedFootageScene = null;

    for (const key of Object.keys(output)) {
      let result = output[key];
      if (isScannerFailure(result)) {
        continue;
      }
      if (!result.snapshot) {
        // Did not have a snapshot to use.
        updateScannerStatus(result, '[ERROR: No snapshot for footage.]');
        onChange(event);
        continue;
      }
      if (result.takeId && getTakeById(store, documentId, result.takeId)) {
        // This is a valid take. Just import it.
        try {
          setTakePreview(documentId, result.takeId, result.snapshot);

          console.log(
            '[TakeScanner] Imported verified take with snapshot in project!',
          );
          updateScannerStatus(result, '[IMPORTED]');
          onChange(event);
          ++count;
        } catch (e) {
          errorScanner(result, e);
          onChange(event);
        }
        continue;
      } else {
        if (!result.takeInfo) {
          // Did not have take info to use.
          updateScannerStatus(result, '[ERROR: No take metadata for footage.]');
          onChange(event);
          continue;
        }

        console.log('[TakeScanner] Importing unverified footage...');

        // Resolve a valid scene & shot for this.
        let scene;
        let block;
        let shot;
        if (document.shotHashes.includes(result.takeInfo.shotHash)) {
          shot = findShotWithShotHash(
            store,
            documentId,
            result.takeInfo.shotHash,
          );
          if (shot) {
            block = findBlockWithShotId(store, documentId, shot.shotId);
            if (block) {
              scene = findSceneWithBlockId(store, documentId, block.blockId);
            }
          }
        }
        if (!scene) {
          if (!importedFootageScene) {
            importedFootageScene = createScene();
            importedFootageScene.sceneHeading = 'IMPORTED FOOTAGE';
          }
          scene = importedFootageScene;
        }
        if (!block) {
          if (!importedFootageBlock) {
            importedFootageBlock = createBlock();
            addScene(documentId, scene);
            addBlock(documentId, scene.sceneId, importedFootageBlock);
          }
          block = importedFootageBlock;
        }
        if (!shot) {
          shot = createShot();
          shot.shotHash = result.takeInfo.shotHash;
          addShot(documentId, scene.sceneId, block.blockId, shot);
        }

        // Resolve a valid take for this.
        let take = createTake(result.takeId || undefined);
        take.previewImage = result.snapshot;
        addTake(documentId, shot.shotId, take);

        console.log('[TakeScanner] Imported take with snapshot in project!');
        result.takeId = take.takeId;
        updateScannerStatus(result, '[IMPORTED]');
        onChange(event);
        ++count;
      }
    }

    // Complete!
    onChange(event);

    console.log(`[TakeScanner] Imported all ${count} videos.`);
  }

  return (
    <>
      <SettingsFieldButton
        Icon={PlaylistAddCheckIcon}
        onClick={onImportVerified}
        disabled={!documentId || disabled}>
        Import verified () into project
      </SettingsFieldButton>
      <SettingsFieldButton
        Icon={PlaylistAddIcon}
        onClick={onImportAll}
        disabled={!documentId || disabled}>
        Import ALL () into project
      </SettingsFieldButton>
    </>
  );
}
