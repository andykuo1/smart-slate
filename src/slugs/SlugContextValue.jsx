import { useCallback, useRef, useState } from 'react';

import { createSlug } from './Slug';

export function useSlugContextValue() {
  const [currentSlug, setCurrentSlug] = useState(createSlug('', '', '', ''));
  const currentSlugChangeRef = useRef(
    /** @type {Array<(slug: import('./Slug').Slug) => void>} */ ([]),
  );

  const changeCurrentSlug = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {import('@/stores/document/DocumentStore').TakeId} takeId
     */
    function _setCurrentSlug(documentId, sceneId, shotId, takeId) {
      const slug = createSlug(documentId, sceneId, shotId, takeId);
      for (let handler of currentSlugChangeRef.current) {
        handler(slug);
      }
      setCurrentSlug(slug);
    },
    [currentSlugChangeRef, setCurrentSlug],
  );

  return {
    currentSlug,
    setCurrentSlug,
    changeCurrentSlug,
    currentSlugChangeRef,
  };
}
