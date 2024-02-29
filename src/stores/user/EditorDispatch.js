import { zi, ziget } from '../ZustandImmerHelper';
import {
  createBlockViewOptions,
  createDocumentEditorOptions,
  createSceneViewOptions,
} from './EditorStore';

/**
 * @param {import('zustand').StoreApi<any>['setState']} set
 * @param {import('zustand').StoreApi<any>['getState']} get
 */
export function createDispatchForEditor(set, get) {
  return {
    UNSAFE_getEditorStore: ziget(get, UNSAFE_getEditorStore),
    setShotEditorShotId: zi(set, setShotEditorShotId),
    toggleDocumentEditorCursorType: zi(set, toggleDocumentEditorCursorType),
    setDocumentEditorBlockViewShotListType: zi(
      set,
      setDocumentEditorBlockViewShotListType,
    ),
    setDocumentEditorSceneViewShotListType: zi(
      set,
      setDocumentEditorSceneViewShotListType,
    ),
  };
}

/**
 * @param {import('./UserStore').Store} store
 */
function UNSAFE_getEditorStore(store) {
  return store.editor;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
function setShotEditorShotId(store, shotId) {
  store.editor.shotEditor.shotId = shotId;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {import('./EditorStore').DocumentEditorCursorType} cursorType
 */
function toggleDocumentEditorCursorType(store, cursorType) {
  let prev = store.editor.documentEditor ?? {};
  if (prev.cursorType === cursorType) {
    cursorType = '';
  }
  store.editor.documentEditor = {
    ...prev,
    cursorType: cursorType,
  };
}

/**
 * @param {import('./UserStore').Store} store
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 * @param {import('./EditorStore').BlockViewShotListType} shotListType
 */
function setDocumentEditorBlockViewShotListType(store, blockId, shotListType) {
  let prev = resolveBlockViewOption(store, blockId);
  prev.shotListType = shotListType;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 */
function resolveBlockViewOption(store, blockId) {
  let documentEditor = store.editor.documentEditor;
  if (!documentEditor) {
    documentEditor = createDocumentEditorOptions();
    store.editor.documentEditor = documentEditor;
  }
  let blockViews = documentEditor.blockViews;
  if (!blockViews) {
    blockViews = {};
    documentEditor.blockViews = blockViews;
  }
  /** @type {import('./EditorStore').BlockViewOptions} */
  let blockViewOptions = blockViews[blockId];
  if (!blockViewOptions) {
    blockViewOptions = createBlockViewOptions();
    blockViews[blockId] = blockViewOptions;
  }
  return blockViewOptions;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('./EditorStore').BlockViewShotListType} shotListType
 */
function setDocumentEditorSceneViewShotListType(store, sceneId, shotListType) {
  let prev = resolveSceneViewOption(store, sceneId);
  prev.shotListType = shotListType;
}

/**
 * @param {import('./UserStore').Store} store
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 */
function resolveSceneViewOption(store, sceneId) {
  let documentEditor = store.editor.documentEditor;
  if (!documentEditor) {
    documentEditor = createDocumentEditorOptions();
    store.editor.documentEditor = documentEditor;
  }
  let sceneViews = documentEditor.sceneViews;
  if (!sceneViews) {
    sceneViews = {};
    documentEditor.sceneViews = sceneViews;
  }
  /** @type {import('./EditorStore').SceneViewOptions} */
  let sceneViewOptions = sceneViews[sceneId];
  if (!sceneViewOptions) {
    sceneViewOptions = createSceneViewOptions();
    sceneViews[sceneId] = sceneViewOptions;
  }
  return sceneViewOptions;
}
