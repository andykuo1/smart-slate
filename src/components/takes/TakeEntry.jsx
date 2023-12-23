import { useCallback, useState } from 'react';

import { useInterval } from '@/lib/UseInterval';
import { useTakeExporter } from '@/serdes/UseTakeExporter';
import {
  useShotTakeCount,
  useTake,
  useTakeNumber,
} from '@/stores/DocumentStoreContext';
import { getVideoBlob } from '@/stores/VideoCache';

import TakeLayout from './TakeLayout';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/DocumentStore').TakeId} props.takeId
 * @param {boolean} props.cloudExportable
 */
export function TakeEntry({
  documentId,
  sceneId,
  shotId,
  takeId,
  cloudExportable,
}) {
  const takeNumber = useTakeNumber(documentId, shotId, takeId);
  const take = useTake(documentId, takeId);
  const exportTake = useTakeExporter();
  const [isCached, setIsCached] = useState(false);

  function onCloudClick() {
    getVideoBlob(takeId).then((blob) => {
      if (blob) {
        exportTake(blob, documentId, sceneId, shotId, { uploadOnly: true });
      }
    });
  }

  const onInterval = useCallback(
    function _onInterval() {
      getVideoBlob(takeId).then((blob) => {
        setIsCached(Boolean(blob));
      });
    },
    [setIsCached, takeId],
  );

  useInterval(onInterval, 5_000);

  return (
    <TakeLayout
      title={`T${takeNumber}`}
      timestamp={take.exportedMillis}
      fileName={take.exportedFileName || '--'}
      firstTake={false}
      lastTake={takeNumber === 1}
      previewImage={take.previewImage}
      isCloudExported={!!take.exportedGoogleDriveFileId}
      isCloudExportable={cloudExportable}
      isCached={isCached}
      onCloudClick={onCloudClick}
    />
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
export function NewTake({ documentId, shotId }) {
  const takeCount = useShotTakeCount(documentId, shotId);
  const takeNumber = takeCount + 1;
  return (
    <TakeLayout
      title={`T${takeNumber}`}
      timestamp={0}
      fileName="--"
      firstTake={false}
      lastTake={takeNumber === 1}
      previewImage=""
    />
  );
}
