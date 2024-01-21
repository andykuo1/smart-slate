import { uuid } from '@/utils/uuid';

/**
 * @typedef {ReturnType<createStore>} Store
 * @typedef {ReturnType<createDocument>} Document
 * @typedef {ReturnType<createScene>} Scene
 * @typedef {ReturnType<createBlock>} Block
 * @typedef {ReturnType<createShot>} Shot
 * @typedef {ReturnType<createTake>} Take
 *
 * @typedef {string} DocumentId
 * @typedef {string} SceneId
 * @typedef {string} ShotId
 * @typedef {string} TakeId
 * @typedef {string} BlockId
 *
 * @typedef {'string'|'lexical'|'fountain-json'} BlockContentType
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

/**
 * @param {DocumentId} documentId
 */
export function createDocument(documentId = uuid()) {
  return {
    documentId,
    documentTitle: '',
    firstCreatedMillis: 0,
    lastUpdatedMillis: 0,
    lastDeletedMillis: 0,
    lastExportedMillis: 0,
    // NOTE: To be used in the future, when we download project data separately.
    lastDataExportedMillis: 0,
    revisionNumber: 0,
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
  };
}

/**
 * @param {SceneId} sceneId
 */
export function createScene(sceneId = uuid()) {
  return {
    sceneId,
    sceneHeading: '',
    /** @type {Array<BlockId>} */
    blockIds: [],
  };
}

/**
 * @param {BlockId} blockId
 */
export function createBlock(blockId = uuid()) {
  return {
    blockId,
    /** @type {'action'|'dialogue'|'transition'|'centered'|'note'|'lyric'|''} */
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
    /** @type {string} */
    referenceImage: '',
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
    takeNumber: 0,
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
  };
}

/**
 * @param {Partial<Store>} out
 * @param {Partial<Store>} store
 */
export function cloneStore(out, store) {
  if (typeof store.documents !== 'undefined') {
    let outDocuments = out.documents || {};
    for (let document of Object.values(store.documents || {})) {
      let outDocument =
        outDocuments[document.documentId] ||
        createDocument(document.documentId);
      let newDocument = cloneDocument(outDocument, document);
      outDocuments[newDocument.documentId] = newDocument;
    }
    out.documents = outDocuments;
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
  if (typeof document.sceneOrder !== 'undefined')
    out.sceneOrder = document.sceneOrder.slice();
  if (typeof document.shotHashes !== 'undefined')
    out.shotHashes = document.shotHashes.slice();
  if (typeof document.settings !== 'undefined')
    out.settings = {
      ...out.settings,
      ...document.settings,
    };

  if (typeof document.scenes !== 'undefined') {
    let outScenes = out.scenes || {};
    for (let scene of Object.values(document.scenes)) {
      let sceneId = scene.sceneId;
      let outScene = outScenes[sceneId] || createScene(sceneId);
      let newScene = cloneScene(outScene, scene);
      outScenes[sceneId] = newScene;
    }
    out.scenes = outScenes;
  }

  if (typeof document.blocks !== 'undefined') {
    let outBlocks = out.blocks || {};
    for (let block of Object.values(document.blocks)) {
      let blockId = block.blockId;
      let outBlock = outBlocks[blockId] || createBlock(blockId);
      let newBlock = cloneBlock(outBlock, block);
      outBlocks[blockId] = newBlock;
    }
    out.blocks = outBlocks;
  }

  if (typeof document.shots !== 'undefined') {
    let outShots = out.shots || {};
    for (let shot of Object.values(document.shots)) {
      let shotId = shot.shotId;
      let outShot = outShots[shotId] || createShot(shotId);
      let newShot = cloneShot(outShot, shot);
      outShots[shotId] = newShot;
    }
    out.shots = outShots;
  }

  if (typeof document.takes !== 'undefined') {
    let outTakes = out.takes || {};
    for (let take of Object.values(document.takes)) {
      let takeId = take.takeId;
      let outTake = outTakes[takeId] || createTake(takeId);
      let newTake = cloneTake(outTake, take);
      outTakes[takeId] = newTake;
    }
    out.takes = outTakes;
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
  if (typeof scene.blockIds !== 'undefined')
    out.blockIds = scene.blockIds.slice();
  if (typeof scene.sceneHeading !== 'undefined')
    out.sceneHeading = scene.sceneHeading;
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
  if (typeof shot.referenceImage !== 'undefined')
    out.referenceImage = shot.referenceImage;
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
