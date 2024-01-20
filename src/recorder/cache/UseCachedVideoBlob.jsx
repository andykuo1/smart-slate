import { useEffect, useState } from 'react';

import { getTakeById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

import { useVideoCache } from './UseVideoCache';
import { getVideoBlob } from './VideoCache';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 * @returns {Blob|null}
 */
export function useCachedVideoBlob(documentId, takeId) {
  const videoCacheReady = useVideoCache();
  const [videoBlob, setVideoBlob] = useState(/** @type {Blob|null} */ (null));
  const exportedIDBKey = useDocumentStore(
    (ctx) => getTakeById(ctx, documentId, takeId)?.exportDetails?.idbKey || '',
  );
  const exportedMillis = useDocumentStore(
    (ctx) =>
      getTakeById(ctx, documentId, takeId)?.exportDetails?.timestampMillis,
  );
  useEffect(() => {
    if (!videoCacheReady) {
      return;
    }
    // NOTE: Re-fetch anytime there's a new export time.
    exportedMillis;
    // Actually get the cached video blob
    getVideoBlob(documentId, exportedIDBKey)
      .then((blob) => setVideoBlob(blob))
      .catch(() => setVideoBlob(null));
  }, [videoCacheReady, exportedMillis, exportedIDBKey, documentId]);

  return videoBlob;
}
