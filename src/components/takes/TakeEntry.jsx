import { useCallback, useState } from 'react';

import { useInterval } from '@/lib/UseInterval';
import { getVideoBlob } from '@/recorder/cache/VideoCache';
import { useTakeExporter } from '@/serdes/UseTakeExporter';
import { useShotTakeCount, useTake, useTakeNumber } from '@/stores/document';

import TakeLayout from './TakeLayout';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 * @param {boolean} props.cloudExportable
 * @param {'list'|'inline'} props.viewMode
 */
export function TakeEntry({
  className,
  documentId,
  sceneId,
  shotId,
  takeId,
  cloudExportable,
  viewMode,
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
      documentId={documentId}
      sceneId={sceneId}
      shotId={shotId}
      takeId={takeId}
      className={className}
      title={`T${takeNumber}`}
      timestamp={take.exportedMillis}
      fileName={take.exportedFileName || '--'}
      firstTake={false}
      lastTake={takeNumber === 1}
      previewImage={take.previewImage}
      viewMode={viewMode}
      isCloudExported={!!take.exportedGDriveFileId}
      isCloudExportable={cloudExportable}
      isCached={isCached}
      onCloudClick={onCloudClick}
    />
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {'list'|'inline'} props.viewMode
 */
export function NewTake({ documentId, shotId, viewMode }) {
  const takeCount = useShotTakeCount(documentId, shotId);
  const takeNumber = takeCount + 1;
  return (
    <TakeLayout
      documentId={documentId}
      sceneId=""
      shotId=""
      takeId=""
      title={`T${takeNumber}`}
      timestamp={0}
      fileName="--"
      firstTake={false}
      lastTake={takeNumber === 1}
      previewImage=""
      viewMode={viewMode}
    />
  );
}
