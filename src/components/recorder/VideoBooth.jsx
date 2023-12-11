import { useCallback } from 'react';

import { createTake, toScenShotTakeType } from '@/stores/DocumentStore';
import {
  useAddTake,
  useDocumentTitle,
  useSceneNumber,
  useShotNumber,
  useShotTakeCount,
  useShotType,
  useTakeNumber,
} from '@/stores/DocumentStoreContext';
import { ANY_SHOT } from '@/stores/ShotTypes';
import { useCurrentCursor, useSetUserCursor } from '@/stores/UserStoreContext';
import { downloadURLImpl } from '@/utils/Downloader';

import RecorderPanel from './RecorderPanel';

export default function VideoBooth() {
  const cursor = useCurrentCursor();
  const setUserCursor = useSetUserCursor();
  const addTake = useAddTake();
  const exportedFileName = useNextAvailableExportedFileName();

  const onChange = useCallback(
    /** @param {string} data */
    function onChange(data) {
      let newTake = createTake();
      addTake(cursor.documentId, cursor.shotId, newTake);
      setUserCursor(
        cursor.documentId,
        cursor.sceneId,
        cursor.shotId,
        newTake.takeId,
      );
      downloadURLImpl(exportedFileName, data);
    },
    [addTake, cursor, exportedFileName],
  );

  return (
    <>
      <h2 className="absolute text-white top-5 left-0 right-0 text-center text-xl z-10 pointer-events-none mx-40">
        <span className="inline-block">{exportedFileName}</span>
        <span className="mx-4" />
        <span className="inline-block">{new Date().toLocaleString()}</span>
      </h2>
      <RecorderPanel onChange={onChange} />
    </>
  );
}

export function useNextAvailableExportedFileName() {
  const { documentId, sceneId, shotId } = useCurrentCursor();
  const documentTitle = useDocumentTitle(documentId) || 'Untitled';
  const documentName =
    documentTitle.charAt(0).toUpperCase() + documentId.substring(0, 4);
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const takeNumber = useShotTakeCount(documentId, shotId) + 1;
  const shotType = useShotType(documentId, shotId);
  const [scen, shot, take, type] = toScenShotTakeType(
    sceneNumber,
    shotNumber,
    takeNumber,
    shotType,
  );
  return (
    `${documentName}_${scen}${shot}${take}` +
    (shotType !== ANY_SHOT.value ? `_${type}` : '')
  );
}
