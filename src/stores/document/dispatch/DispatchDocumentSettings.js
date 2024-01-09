import { formatProjectId } from '@/components/takes/TakeNameFormat';

import { zi } from '../../ZustandImmerHelper';
import {
  getDocumentById,
  getDocumentSettingsById,
} from '../DocumentStoreHelper';

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatchDocumentSettings(set, get) {
  return {
    setDocumentSettingsProjectId: zi(set, setDocumentSettingsProjectId),
    setDocumentSettingsAspectRatio: zi(set, setDocumentSettingsAspectRatio),
    setDocumentSettingsVideoResolution: zi(
      set,
      setDocumentSettingsVideoResolution,
    ),
  };
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {string} projectId
 */
function setDocumentSettingsProjectId(store, documentId, projectId) {
  let settings = getDocumentSettingsById(store, documentId);
  if (!settings) {
    // @ts-ignore
    settings = {};
    getDocumentById(store, documentId).settings = settings;
  }
  if (projectId && projectId.trim().length > 0) {
    settings.projectId = formatProjectId(projectId);
  } else {
    settings.projectId = '';
  }
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {'16:9'|'4:3'} aspectRatio
 */
function setDocumentSettingsAspectRatio(store, documentId, aspectRatio) {
  let settings = getDocumentSettingsById(store, documentId);
  if (!settings) {
    // @ts-ignore
    settings = {};
    getDocumentById(store, documentId).settings = settings;
  }
  settings.aspectRatio = aspectRatio;
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {'4K'|'HD'} videoResolution
 */
function setDocumentSettingsVideoResolution(
  store,
  documentId,
  videoResolution,
) {
  let settings = getDocumentSettingsById(store, documentId);
  if (!settings) {
    // @ts-ignore
    settings = {};
    getDocumentById(store, documentId).settings = settings;
  }
  settings.videoResolution = videoResolution;
}
