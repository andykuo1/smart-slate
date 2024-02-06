import { useContext } from 'react';

import {
  getDocumentSettingsById,
  getSceneById,
  getShotById,
  getTakeById,
} from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

import { createNominalSlug } from './Slug';
import { SlugContext } from './SlugContext';

export function useSlug() {
  const result = useContext(SlugContext);
  if (!result) {
    throw new Error('Missing SlugContextProvider.');
  }
  return result;
}

/**
 * @param {import('./Slug').Slug} slug
 */
export function useNominalSlugFromStore(slug) {
  return useDocumentStore((ctx) => {
    const { documentId, sceneId, shotId, takeId } = slug;
    const settings = getDocumentSettingsById(ctx, documentId);
    const projectId = settings?.projectId;
    if (!projectId) {
      return null;
    }
    const sceneNum = getSceneById(ctx, documentId, sceneId)?.sceneNumber || -1;
    const shotNum = getShotById(ctx, documentId, shotId)?.shotNumber || -1;
    const takeNum = getTakeById(ctx, documentId, takeId)?.takeNumber || -1;
    return createNominalSlug(projectId, sceneNum, shotNum, takeNum);
  });
}
