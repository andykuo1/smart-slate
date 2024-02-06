import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  findDocumentsWithProjectId,
  getBlockById,
  getDocumentSettingsById,
  getSceneById,
  getShotById,
  getTakeById,
} from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

import {
  compareNominalSlugs,
  createNominalSlug,
  createSlug,
  decodeNominalSlugFromSearchParams,
  encodeNominalSlugToSearchParams,
} from './Slug';
import { useNominalSlugFromStore, useSlug } from './UseSlug';

export function useSlugToSearchParams() {
  const { currentSlugChangeRef, currentSlug, setCurrentSlug } = useSlug();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentNominalSlug = useNominalSlugFromStore(currentSlug);
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);

  useEffect(() => {
    /** @param {import('./Slug').Slug} slug */
    function onChange(slug) {
      const store = UNSAFE_getStore();
      const nominalSlug = findNominalSlugBySlugFromStore(store, slug);
      if (nominalSlug) {
        const searchParams = encodeNominalSlugToSearchParams(nominalSlug);
        setSearchParams(searchParams);
      } else {
        setSearchParams({});
      }
    }
    currentSlugChangeRef.current.push(onChange);
    return () => {
      currentSlugChangeRef.current.splice(
        currentSlugChangeRef.current.indexOf(onChange),
        1,
      );
    };
  }, [UNSAFE_getStore, setSearchParams]);

  useEffect(() => {
    console.log('[SlugToSearchParams] Applying slug to search params...');
    const searchParamNominalSlug =
      decodeNominalSlugFromSearchParams(searchParams);
    if (searchParamNominalSlug) {
      if (
        currentNominalSlug &&
        compareNominalSlugs(searchParamNominalSlug, currentNominalSlug) === 0
      ) {
        // ... the same, so do nothing.
        console.log('...the same.', searchParamNominalSlug, currentNominalSlug);
        return;
      }
      // ... different search param than current, so update!
      const searchParamSlug = findSlugByNominalSlugFromStore(
        UNSAFE_getStore(),
        searchParamNominalSlug,
      );
      if (!searchParamSlug) {
        // ... it doesn't exist, so skip it.
        console.log(
          '...did not exist.',
          searchParamNominalSlug,
          currentNominalSlug,
        );
        return;
      }
      console.log(
        '...set to store!',
        searchParamNominalSlug,
        currentNominalSlug,
      );
      setCurrentSlug(searchParamSlug);
    } else {
      if (!currentNominalSlug) {
        // ... nothing is set. Ignore it all.
        console.log(
          '...nothing is set.',
          searchParamNominalSlug,
          currentNominalSlug,
        );
        return;
      }
      // ... no search params in url, so set it!
      const result = encodeNominalSlugToSearchParams(currentNominalSlug);
      setSearchParams(result);
      console.log(
        '...changed search params!',
        searchParamNominalSlug,
        currentNominalSlug,
      );
    }
  }, [searchParams, setSearchParams, currentNominalSlug]);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('./Slug').NominalSlug} nominalSlug
 */
function findSlugByNominalSlugFromStore(store, nominalSlug) {
  const { projectId, sceneNum, shotNum, takeNum } = nominalSlug;
  const documents = findDocumentsWithProjectId(store, projectId);
  if (documents.length <= 0) {
    return null;
  }
  if (!(sceneNum > 0)) {
    return createSlug(documents[0].documentId, '', '', '');
  }
  for (const document of documents) {
    const documentId = document.documentId;
    for (let sceneId of document.sceneOrder) {
      const scene = getSceneById(store, documentId, sceneId);
      if (!scene || scene.sceneNumber !== sceneNum) {
        continue;
      }
      if (!(shotNum > 0)) {
        return createSlug(documentId, sceneId, '', '');
      }
      for (let blockId of scene.blockIds) {
        const block = getBlockById(store, documentId, blockId);
        if (!block) {
          continue;
        }
        for (let shotId of block.shotIds) {
          const shot = getShotById(store, documentId, shotId);
          if (!shot || shot.shotNumber !== shotNum) {
            continue;
          }
          if (!(takeNum > 0)) {
            return createSlug(documentId, sceneId, shotId, '');
          }
          for (let takeId of shot.takeIds) {
            const take = getTakeById(store, documentId, takeId);
            if (!take || take.takeNumber !== takeNum) {
              continue;
            }
            return createSlug(documentId, sceneId, shotId, takeId);
          }
        }
      }
    }
  }
  return null;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('./Slug').Slug} slug
 */
function findNominalSlugBySlugFromStore(store, slug) {
  const { documentId, sceneId, shotId, takeId } = slug;
  const settings = getDocumentSettingsById(store, documentId);
  const projectId = settings?.projectId;
  if (!projectId) {
    return null;
  }
  const sceneNum = getSceneById(store, documentId, sceneId)?.sceneNumber || -1;
  const shotNum = getShotById(store, documentId, shotId)?.shotNumber || -1;
  const takeNum = getTakeById(store, documentId, takeId)?.takeNumber || -1;
  return createNominalSlug(projectId, sceneNum, shotNum, takeNum);
}
