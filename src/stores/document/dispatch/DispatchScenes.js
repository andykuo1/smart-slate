import { zi } from '@/stores/ZustandImmerHelper';

import { incrementDocumentRevisionNumber } from './DispatchDocuments';

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatchScenes(set, get) {
  return {
    setSceneNumber: zi(set, setSceneNumber),
  };
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {number} sceneNumber
 */
function setSceneNumber(store, documentId, sceneId, sceneNumber) {
  let document = store.documents[documentId];
  let scene = document.scenes[sceneId];
  scene.sceneNumber = sceneNumber;
  incrementDocumentRevisionNumber(document);
}
