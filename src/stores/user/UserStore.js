import { createEditorStore } from './EditorStore';

/**
 * @typedef {ReturnType<createStore>} Store
 * @typedef {ReturnType<createCursor>} Cursor
 * @typedef {ReturnType<createRecorder>} Recorder
 * @typedef {ReturnType<createGoogleContext>} GoogleContext
 */

export function createStore() {
  return {
    cursor: createCursor(),
    recorder: createRecorder(),
    viewer: createViewerStore(),
    editor: createEditorStore(),
    drawer: createDrawer(),
    /** @type {'inline'|'sequence'|'textonly'|'shotonly'} */
    editMode: 'sequence',
    /** @type {'group'|'detail'|'hidden'} */
    shotListMode: 'hidden',
    /** @type {'recorder'|'clapper'} */
    recordMode: 'clapper',
    googleContext: createGoogleContext(),
  };
}

/** @typedef {'pdf'|'video'} ViewerMode */

export function createViewerStore() {
  return {
    /** @type {ViewerMode} */
    mode: 'pdf',
  };
}

export function createDrawer() {
  return {
    open: false,
    /** @type {'outline'|'settings'} */
    activeTab: 'outline',
    showDetails: false,
  };
}

export function createGoogleContext() {
  return {
    /** @type {import('@react-oauth/google').CredentialResponse|null} */
    credential: null,
    /** @type {import('@react-oauth/google').TokenResponse|null} */
    token: null,
  };
}

export function createCursor() {
  return {
    /** @type {import('@/stores/document/DocumentStore').DocumentId} */
    documentId: '',
    /** @type {import('@/stores/document/DocumentStore').SceneId} */
    sceneId: '',
    /** @type {import('@/stores/document/DocumentStore').ShotId} */
    shotId: '',
    /** @type {import('@/stores/document/DocumentStore').TakeId} */
    takeId: '',
    /** @type {import('@/stores/document/DocumentStore').BlockId} */
    blockId: '',
  };
}

export function createRecorder() {
  return {
    active: false,
    forceStart: false,
  };
}
