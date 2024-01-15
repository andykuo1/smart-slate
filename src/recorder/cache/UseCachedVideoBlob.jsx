import { useEffect, useState } from 'react';

import { getTakeById, useDocumentStore } from '@/stores/document';

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
    (ctx) => getTakeById(ctx, documentId, takeId)?.exportedIDBKey,
  );
  const exportedMillis = useDocumentStore(
    (ctx) => getTakeById(ctx, documentId, takeId)?.exportedMillis,
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
