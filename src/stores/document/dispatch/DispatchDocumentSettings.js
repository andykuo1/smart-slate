import { formatProjectId } from '@/components/takes/TakeNameFormat';

import { zi } from '../../ZustandImmerHelper';
import { getDocumentById } from '../get';
import { getDocumentSettingsById } from '../get/GetDocumentSettings';

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
    setDocumentSettingsDirectorName: zi(set, setDocumentSettingsDirectorName),
    setDocumentSettingsCameraName: zi(set, setDocumentSettingsCameraName),
    setDocumentSettingsAutoSaveGDriveFileId: zi(
      set,
      setDocumentSettingsAutoSaveGDriveFileId,
    ),
  };
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 */
function resolveDocumentSettingsById(store, documentId) {
  /** @type {Partial<import('../DocumentStore').Document['settings']>} */
  let settings = getDocumentSettingsById(store, documentId);
  if (!settings) {
    settings = {};
    // @ts-expect-error settings should always be able to be partially constructed.
    getDocumentById(store, documentId).settings = settings;
  }
  return settings;
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {string} projectId
 */
function setDocumentSettingsProjectId(store, documentId, projectId) {
  let settings = resolveDocumentSettingsById(store, documentId);
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
  let settings = resolveDocumentSettingsById(store, documentId);
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
  let settings = resolveDocumentSettingsById(store, documentId);
  settings.videoResolution = videoResolution;
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {string} name
 */
function setDocumentSettingsDirectorName(store, documentId, name) {
  let settings = resolveDocumentSettingsById(store, documentId);
  settings.directorName = name;
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {string} name
 */
function setDocumentSettingsCameraName(store, documentId, name) {
  let settings = resolveDocumentSettingsById(store, documentId);
  settings.cameraName = name;
}

/**
 * @param {import('../DocumentStore').Store} store
 * @param {import('../DocumentStore').DocumentId} documentId
 * @param {string} fileId
 */
function setDocumentSettingsAutoSaveGDriveFileId(store, documentId, fileId) {
  let settings = resolveDocumentSettingsById(store, documentId);
  settings.autoSaveGDriveFileId = fileId;
}
