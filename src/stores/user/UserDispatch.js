import { zi } from '../ZustandImmerHelper';

/** @typedef {ReturnType<createDispatch>} Dispatch */

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatch(set, get) {
  return {
    /** @type {() => import('./UserStore').Store} */
    UNSAFE_getUserStore: get,
    setUserCursor: zi(set, setUserCursor),
    setRecorderActive: zi(set, setRecorderActive),
    setEditMode: zi(set, setEditMode),
    setShotListMode: zi(set, setShotListMode),
    setRecordMode: zi(set, setRecordMode),
    setGoogleContextCredentialResponse: zi(
      set,
      setGoogleContextCredentialResponse,
    ),
    setGoogleContextTokenResponse: zi(set, setGoogleContextTokenResponse),
    toggleDrawer: zi(set, toggleDrawer),
    setDrawerActiveTab: zi(set, setDrawerActiveTab),
    setDrawerShowDetails: zi(set, setDrawerShowDetails),
  };
}

/**
 * @param {import('./UserStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} [takeId]
 * @param {import('@/stores/document/DocumentStore').BlockId} [blockId]
 */
function setUserCursor(
  store,
  documentId,
  sceneId,
  shotId,
  takeId = undefined,
  blockId = undefined,
) {
  let cursor = store.cursor;
  cursor.documentId = documentId;
  cursor.sceneId = sceneId;
  cursor.shotId = shotId;
  if (typeof takeId !== 'undefined') {
    cursor.takeId = takeId;
  }
  if (typeof blockId !== 'undefined') {
    cursor.blockId = blockId;
  }
}

/**
 * @param {import('./UserStore').Store} store
 * @param {boolean} active
 * @param {boolean} forceStart
 */
function setRecorderActive(store, active, forceStart) {
  let recorder = store.recorder;
  recorder.active = active;
  recorder.forceStart = forceStart;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {'inline'|'sequence'|'textonly'|'shotonly'} editMode
 */
function setEditMode(store, editMode) {
  store.editMode = editMode;
}

/**
 *
 * @param {import('./UserStore').Store} store
 * @param {'detail'|'hidden'} shotListMode
 */
function setShotListMode(store, shotListMode) {
  store.shotListMode = shotListMode;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {'recorder'|'clapper'} recordMode
 */
function setRecordMode(store, recordMode) {
  store.recordMode = recordMode;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {boolean} [force]
 */
function toggleDrawer(store, force = undefined) {
  store.drawer.open = typeof force !== 'undefined' ? force : !store.drawer.open;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {'outline'|'settings'} tabName
 */
function setDrawerActiveTab(store, tabName) {
  store.drawer.activeTab = tabName;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {boolean} enabled
 */
function setDrawerShowDetails(store, enabled) {
  store.drawer.showDetails = enabled;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {import('@react-oauth/google').CredentialResponse} response
 */
function setGoogleContextCredentialResponse(store, response) {
  store.googleContext.credential = response;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {import('@react-oauth/google').TokenResponse|null} response
 */
function setGoogleContextTokenResponse(store, response) {
  store.googleContext.token = response;
}
