import { useEffect, useState } from 'react';

import { getTakeById } from '@/stores/DocumentDispatch';
import { useDocumentStore } from '@/stores/DocumentStoreContext';

import { useVideoCache } from './UseVideoCache';
import { getVideoBlob } from './VideoCache';

/**
 * @param {import('@/stores/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/DocumentStore').TakeId} takeId
 * @returns {Blob|null}
 */
export function useCachedVideoBlob(documentId, takeId) {
  const videoCacheReady = useVideoCache();
  const [videoBlob, setVideoBlob] = useState(null);
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
    getVideoBlob(exportedIDBKey)
      .then((blob) => setVideoBlob(blob))
      .catch(() => setVideoBlob(null));
  }, [videoCacheReady, exportedMillis, exportedIDBKey, documentId, takeId]);

  return videoBlob;
}
