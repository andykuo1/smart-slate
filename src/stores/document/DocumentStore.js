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
 * @typedef {'wide'|'medium'|'closeup'|'full'|'long'|''} ShotType
 * @typedef {'string'|'lexical'} BlockContentType
 * @typedef {string} ShotHash
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
    lastUpdatedMillis: 0,
    revisionNumber: 0,
    settings: {
      projectId: '',
      /** @type {'16:9'|'4:3'|''} */
      aspectRatio: '',
      /** @type {'4K'|'HD'|''} */
      videoResolution: '',
      /** @type {'local'|'gdrive'|''} */
      autoSaveTo: '',
      directorName: '',
      cameraName: '',
    },
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
    /** @type {ShotType} */
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
  };
}

/**
 * @param {TakeId} takeId
 */
export function createTake(takeId = uuid()) {
  return {
    takeId,
    notes: '',
    rating: 0,
    previewImage: '',
    exportedSize: 0,
    exportedMillis: 0,
    exportedFileName: '',
    /** @type {ShotType} */
    exportedShotType: '',
    exportedGDriveFileId: '',
    /** @type {IDBValidKey} */
    exportedIDBKey: '',
    exportedQRCodeKey: '',
  };
}

/**
 * @param {Partial<Store>} out
 * @param {Store} store
 */
export function cloneStore(out, store) {
  let outDocuments = out.documents || {};
  for (let document of Object.values(store.documents)) {
    let outDocument =
      outDocuments[document.documentId] || createDocument(document.documentId);
    let newDocument = cloneDocument(outDocument, document);
    outDocuments[newDocument.documentId] = newDocument;
  }
  out.documents = outDocuments;
  return /** @type {Store} */ (out);
}

/**
 * @param {Partial<Document>} out
 * @param {Document} document
 * @returns {Document}
 */
export function cloneDocument(out, document) {
  out.documentId = document.documentId;
  out.documentTitle = document.documentTitle;
  out.revisionNumber = document.revisionNumber;
  out.sceneOrder = document.sceneOrder.slice();
  out.shotHashes = document.shotHashes.slice();
  out.settings = { ...(document.settings || {}) };

  let outScenes = out.scenes || {};
  for (let scene of Object.values(document.scenes)) {
    let sceneId = scene.sceneId;
    let outScene = outScenes[sceneId] || createScene(sceneId);
    let newScene = cloneScene(outScene, scene);
    outScenes[sceneId] = newScene;
  }
  out.scenes = outScenes;

  let outBlocks = out.blocks || {};
  for (let block of Object.values(document.blocks)) {
    let blockId = block.blockId;
    let outBlock = outBlocks[blockId] || createBlock(blockId);
    let newBlock = cloneBlock(outBlock, block);
    outBlocks[blockId] = newBlock;
  }
  out.blocks = outBlocks;

  let outShots = out.shots || {};
  for (let shot of Object.values(document.shots)) {
    let shotId = shot.shotId;
    let outShot = outShots[shotId] || createShot(shotId);
    let newShot = cloneShot(outShot, shot);
    outShots[shotId] = newShot;
  }
  out.shots = outShots;

  let outTakes = out.takes || {};
  for (let take of Object.values(document.takes)) {
    let takeId = take.takeId;
    let outTake = outTakes[takeId] || createTake(takeId);
    let newTake = cloneTake(outTake, take);
    outTakes[takeId] = newTake;
  }
  out.takes = outTakes;

  return /** @type {Document} */ (out);
}

/**
 * @param {Partial<Scene>} out
 * @param {Scene} scene
 * @returns {Scene}
 */
export function cloneScene(out, scene) {
  out.sceneId = scene.sceneId;
  out.blockIds = scene.blockIds.slice();
  out.sceneHeading = scene.sceneHeading;
  return /** @type {Scene} */ (out);
}

/**
 * @param {Partial<Block>} out
 * @param {Block} block
 * @returns {Block}
 */
export function cloneBlock(out, block) {
  out.blockId = block.blockId;
  out.shotIds = block.shotIds.slice();
  out.contentType = block.contentType;
  out.content = block.content;
  return /** @type {Block} */ (out);
}

/**
 * @param {Partial<Shot>} out
 * @param {Shot} shot
 * @returns {Shot}
 */
export function cloneShot(out, shot) {
  out.shotId = shot.shotId;
  out.shotType = shot.shotType;
  out.shotHash = shot.shotHash;
  out.referenceImage = shot.referenceImage;
  out.description = shot.description;
  out.takeIds = shot.takeIds.slice();
  return /** @type {Shot} */ (out);
}

/**
 * @param {Partial<Take>} out
 * @param {Take} take
 * @returns {Take}
 */
export function cloneTake(out, take) {
  out.takeId = take.takeId;
  out.notes = take.notes;
  out.rating = take.rating;
  out.previewImage = take.previewImage;
  out.exportedSize = take.exportedSize;
  out.exportedMillis = take.exportedMillis;
  out.exportedFileName = take.exportedFileName;
  out.exportedShotType = take.exportedShotType;
  out.exportedGDriveFileId = take.exportedGDriveFileId;
  out.exportedIDBKey = take.exportedIDBKey;
  out.exportedQRCodeKey = take.exportedQRCodeKey;
  return /** @type {Take} */ (out);
}
