import { uuid } from '@/utils/uuid';

/**
 * @typedef {ReturnType<createStore>} Store
 * @typedef {ReturnType<createDocument>} Document
 * @typedef {ReturnType<createScene>} Scene
 * @typedef {ReturnType<createBlock>} Block
 * @typedef {ReturnType<createShot>} Shot
 * @typedef {ReturnType<createTake>} Take
 * @typedef {ReturnType<createShotList>} ShotList
 *
 * @typedef {string} DocumentId
 * @typedef {string} SceneId
 * @typedef {string} ShotId
 * @typedef {string} TakeId
 * @typedef {string} BlockId
 * @typedef {string} ShotListId
 *
 * @typedef {'string'|'lexical'|'fountain-json'} BlockContentType
 * @typedef {'action'|'dialogue'|'transition'|'centered'|'note'|'lyric'|''} BlockContentStyle
 * @typedef {string} ShotHash
 * @typedef {Partial<ReturnType<createDocumentSettings>>} DocumentSettings
 * @typedef {Partial<ReturnType<createTakeExportDetails>>} TakeExportDetails
 */

export function createStore() {
  return {
    /** @type {Record<DocumentId, Document>} */
    documents: {},
  };
}

export const CURRENT_DOCUMENT_VERSION = 1;

/**
 * @param {DocumentId} documentId
 */
export function createDocument(documentId = uuid()) {
  return {
    documentId,
    documentTitle: '',
    documentVersion: CURRENT_DOCUMENT_VERSION,
    // Timestamps for syncing
    firstCreatedMillis: 0,
    lastUpdatedMillis: 0,
    lastDeletedMillis: 0,
    lastExportedMillis: 0,
    // NOTE: To be used in the future, when we download project data separately.
    lastDataExportedMillis: 0,
    // Check for changes.
    revisionNumber: 0,
    // For creating scenes.
    nextSceneNumber: 1,
    /** @type {DocumentSettings} */
    settings: createDocumentSettings(),
    /** @type {Array<SceneId>} */
    sceneOrder: [],
    /** @type {Record<SceneId, Scene>} */
    scenes: {},
    /** @type {Record<BlockId, Block>} */
    blocks: {},
    /** @type {Array<ShotHash>} */
    shotHashes: [],
    /** @type {Record<ShotId, Shot>} */
    shots: {},
    /** @type {Record<TakeId, Take>} */
    takes: {},
  };
}

function createDocumentSettings() {
  return {
    projectId: '',
    /** @type {'16:9'|'4:3'|''} */
    aspectRatio: '',
    /** @type {'4K'|'HD'|''} */
    videoResolution: '',
    /** @type {'local'|'gdrive'|''} */
    autoSaveTo: '',
    autoSaveGDriveFileId: '',
    directorName: '',
    cameraName: '',
    writerName: '',
  };
}

/**
 * @param {SceneId} sceneId
 */
export function createScene(sceneId = uuid()) {
  return {
    sceneId,
    sceneHeading: '',
    /** The 1-indexed number of this scene. Per document. */
    sceneNumber: 0,
    /** @type {Array<BlockId>} */
    blockIds: [],
    nextShotNumber: 1,
  };
}

/**
 * @param {BlockId} blockId
 */
export function createBlock(blockId = uuid()) {
  return {
    blockId,
    /** @type {BlockContentStyle} */
    contentStyle: '',
    /** @type {BlockContentType} */
    contentType: 'string',
    /** @type {string} */
    content: '',
    /** @type {Array<ShotId>} */
    shotIds: [],
  };
}

/**
 * @param {ShotListId} shotListId
 */
export function createShotList(shotListId = uuid()) {
  return {
    shotListId,
    shotListName: '',
    shotIds: [],
  };
}

/**
 * @param {ShotId} shotId
 */
export function createShot(shotId = uuid()) {
  return {
    shotId,
    shotType: '',
    /**
     * A unique hash to identify shots-- the unit of story for editors.
     * @type {ShotHash}
     */
    shotHash: '',
    /** The 1-indexed number of this shot. Per scene. */
    shotNumber: 0,
    /** @type {string} */
    referenceImage: '',
    referenceOffsetX: 0,
    referenceOffsetY: 0,
    referenceMargin: 0,
    description: '',
    /** @type {Array<TakeId>} */
    takeIds: [],
    nextTakeNumber: 1,
  };
}

/**
 * @param {TakeId} takeId
 */
export function createTake(takeId = uuid()) {
  return {
    takeId,
    /** The 1-indexed number of this take. Per shot. */
    takeNumber: 0, // NOTE: Should this be -1?
    comments: '',
    rating: 0,
    previewImage: '',
    /** @type {TakeExportDetails} */
    exportDetails: createTakeExportDetails(),
  };
}

function createTakeExportDetails() {
  return {
    sizeBytes: 0,
    timestampMillis: 0,
    fileName: '',
    shotType: '',
    gdriveFileId: '',
    /** @type {IDBValidKey} */
    idbKey: '',
    qrCodeKey: '',
    rollName: '',
  };
}

/**
 * @param {Partial<Store>} out
 * @param {Partial<Store>} store
 */
export function cloneStore(out, store) {
  if (typeof store.documents !== 'undefined') {
    let result = out.documents ?? {};
    for (const key of Object.keys(store.documents)) {
      let next = store.documents[key];
      let prev = out.documents?.[key];
      if (!prev) {
        prev = createDocument(key);
      }
      let cloned = cloneDocument(prev, next);
      result[cloned.documentId] = cloned;
    }
    out.documents = result;
  }
  return /** @type {Store} */ (out);
}

/**
 * @param {Partial<Document>} out
 * @param {Partial<Document>} document
 * @returns {Document}
 */
export function cloneDocument(out, document) {
  if (typeof document.documentId !== 'undefined')
    out.documentId = document.documentId;
  if (typeof document.documentTitle !== 'undefined')
    out.documentTitle = document.documentTitle;
  if (typeof document.documentVersion !== 'undefined')
    out.documentVersion = document.documentVersion;
  if (typeof document.firstCreatedMillis !== 'undefined')
    out.firstCreatedMillis = document.firstCreatedMillis;
  if (typeof document.lastUpdatedMillis !== 'undefined')
    out.lastUpdatedMillis = document.lastUpdatedMillis;
  if (typeof document.lastDeletedMillis !== 'undefined')
    out.lastDeletedMillis = document.lastDeletedMillis;
  if (typeof document.lastExportedMillis !== 'undefined')
    out.lastExportedMillis = document.lastExportedMillis;
  if (typeof document.lastDataExportedMillis !== 'undefined')
    out.lastDataExportedMillis = document.lastDataExportedMillis;
  if (typeof document.revisionNumber !== 'undefined')
    out.revisionNumber = document.revisionNumber;
  if (typeof document.nextSceneNumber !== 'undefined')
    out.nextSceneNumber = document.nextSceneNumber;
  if (typeof document.settings !== 'undefined')
    out.settings = {
      ...out.settings,
      ...document.settings,
    };
  if (typeof document.sceneOrder !== 'undefined')
    out.sceneOrder = document.sceneOrder.slice();
  if (typeof document.shotHashes !== 'undefined')
    out.shotHashes = document.shotHashes.slice();
  if (typeof document.scenes !== 'undefined') {
    let result = out.scenes ?? {};
    for (const key of Object.keys(document.scenes)) {
      let next = document.scenes[key];
      let prev = out.scenes?.[key];
      if (!prev) {
        prev = createScene(key);
      }
      let cloned = cloneScene(prev, next);
      result[cloned.sceneId] = cloned;
    }
    out.scenes = result;
  }

  if (typeof document.blocks !== 'undefined') {
    let result = out.blocks ?? {};
    for (const key of Object.keys(document.blocks)) {
      let next = document.blocks[key];
      let prev = out.blocks?.[key];
      if (!prev) {
        prev = createBlock(key);
      }
      let cloned = cloneBlock(prev, next);
      result[cloned.blockId] = cloned;
    }
    out.blocks = result;
  }

  if (typeof document.shots !== 'undefined') {
    let result = out.shots ?? {};
    for (const key of Object.keys(document.shots)) {
      let next = document.shots[key];
      let prev = out.shots?.[key];
      if (!prev) {
        prev = createShot(key);
      }
      let cloned = cloneShot(prev, next);
      result[cloned.shotId] = cloned;
    }
    out.shots = result;
  }

  if (typeof document.takes !== 'undefined') {
    let result = out.takes ?? {};
    for (const key of Object.keys(document.takes)) {
      let next = document.takes[key];
      let prev = out.takes?.[key];
      if (!prev) {
        prev = createTake(key);
      }
      let cloned = cloneTake(prev, next);
      result[cloned.takeId] = cloned;
    }
    out.takes = result;
  }

  return /** @type {Document} */ (out);
}

/**
 * @param {Partial<Scene>} out
 * @param {Partial<Scene>} scene
 * @returns {Scene}
 */
export function cloneScene(out, scene) {
  if (typeof scene.sceneId !== 'undefined') out.sceneId = scene.sceneId;
  if (typeof scene.sceneNumber !== 'undefined')
    out.sceneNumber = scene.sceneNumber;
  if (typeof scene.sceneHeading !== 'undefined')
    out.sceneHeading = scene.sceneHeading;
  if (typeof scene.blockIds !== 'undefined')
    out.blockIds = scene.blockIds.slice();
  if (typeof scene.nextShotNumber !== 'undefined')
    out.nextShotNumber = scene.nextShotNumber;
  return /** @type {Scene} */ (out);
}

/**
 * @param {Partial<Block>} out
 * @param {Partial<Block>} block
 * @returns {Block}
 */
export function cloneBlock(out, block) {
  if (typeof block.blockId !== 'undefined') out.blockId = block.blockId;
  if (typeof block.shotIds !== 'undefined') out.shotIds = block.shotIds.slice();
  if (typeof block.contentType !== 'undefined')
    out.contentType = block.contentType;
  if (typeof block.contentStyle !== 'undefined')
    out.contentStyle = block.contentStyle;
  if (typeof block.content !== 'undefined') out.content = block.content;
  return /** @type {Block} */ (out);
}

/**
 * @param {Partial<Shot>} out
 * @param {Partial<Shot>} shot
 * @returns {Shot}
 */
export function cloneShot(out, shot) {
  if (typeof shot.shotId !== 'undefined') out.shotId = shot.shotId;
  if (typeof shot.shotType !== 'undefined') out.shotType = shot.shotType;
  if (typeof shot.shotHash !== 'undefined') out.shotHash = shot.shotHash;
  if (typeof shot.shotNumber !== 'undefined') out.shotNumber = shot.shotNumber;
  if (typeof shot.referenceImage !== 'undefined')
    out.referenceImage = shot.referenceImage;
  if (typeof shot.referenceOffsetX !== 'undefined')
    out.referenceOffsetX = shot.referenceOffsetX;
  if (typeof shot.referenceOffsetY !== 'undefined')
    out.referenceOffsetY = shot.referenceOffsetY;
  if (typeof shot.referenceMargin !== 'undefined')
    out.referenceMargin = shot.referenceMargin;
  if (typeof shot.description !== 'undefined')
    out.description = shot.description;
  if (typeof shot.takeIds !== 'undefined') out.takeIds = shot.takeIds.slice();
  if (typeof shot.nextTakeNumber !== 'undefined')
    out.nextTakeNumber = shot.nextTakeNumber;
  return /** @type {Shot} */ (out);
}

/**
 * @param {Partial<Take>} out
 * @param {Partial<Take>} take
 * @returns {Take}
 */
export function cloneTake(out, take) {
  if (typeof take.takeId !== 'undefined') out.takeId = take.takeId;
  if (typeof take.takeNumber !== 'undefined') out.takeNumber = take.takeNumber;
  if (typeof take.comments !== 'undefined') out.comments = take.comments;
  if (typeof take.rating !== 'undefined') out.rating = take.rating;
  if (typeof take.previewImage !== 'undefined')
    out.previewImage = take.previewImage;
  if (typeof take.exportDetails !== 'undefined')
    out.exportDetails = {
      ...out.exportDetails,
      ...take.exportDetails,
    };
  // From version 0
  let oldTake = /** @type {any} */ (take);
  /** @type {TakeExportDetails} */
  let outDetails = oldTake.exportDetails || {};
  if (typeof oldTake.exportedSize !== 'undefined')
    outDetails.sizeBytes = oldTake.exportedSize;
  if (typeof oldTake.exportedMillis !== 'undefined')
    outDetails.timestampMillis = oldTake.exportedMillis;
  if (typeof oldTake.exportedShotType !== 'undefined')
    outDetails.shotType = oldTake.exportedShotType;
  if (typeof oldTake.exportedGDriveFileId !== 'undefined')
    outDetails.gdriveFileId = oldTake.exportedGDriveFileId;
  if (typeof oldTake.exportedIDBKey !== 'undefined')
    outDetails.idbKey = oldTake.exportedIDBKey;
  if (typeof oldTake.exportedQRCodeKey !== 'undefined')
    outDetails.qrCodeKey = oldTake.exportedQRCodeKey;
  return /** @type {Take} */ (out);
}
