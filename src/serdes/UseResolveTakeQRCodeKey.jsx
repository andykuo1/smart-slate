import { useCallback } from 'react';

import { getDocumentSettingsById, getTakeById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

import { useResolveTakeShotHash } from './UseResolveTakeShotHash';

export const QR_CODE_KEY_V1_DECODED_PATTERN = /^(.+)\.(\d+)\.(.+)$/;

/**
 * @param {string} projectId
 * @param {string} shotHash
 * @param {string} takeId
 */
export function tryEncodeQRCodeKeyV1(projectId, shotHash, takeId) {
  const codeString = `${projectId}.${shotHash}.${takeId}`;
  const base64 = window.btoa(codeString);
  return `v1:${base64}`;
}

/**
 * @param {string} qrCodeKey
 */
export function tryDecodeQRCodeKeyV1(qrCodeKey) {
  if (!qrCodeKey.startsWith('v1:')) {
    return null;
  }
  const decoded = window.atob(qrCodeKey.substring('v1:'.length));
  const result = QR_CODE_KEY_V1_DECODED_PATTERN.exec(decoded);
  if (!result) {
    return null;
  }
  const [_, projectId, shotHash, takeId] = result;
  return {
    projectId,
    shotHash,
    takeId,
  };
}

const QR_CODE_KEY_V0_DECODED_PROJECT_ID_PATTERN = /^(.+)_S\d+\w+_T/;
const QR_CODE_KEY_V0_DECODED_SHOT_HASH_PATTERN = /_(\d+)$/;
const QR_CODE_KEY_V0_DECODED_TAKE_NUMBER_PATTERN = /_T(\d+)_/;

/**
 * @param {string} qrCodeKey
 */
export function tryDecodeQRCodeKeyV0(qrCodeKey) {
  if (!qrCodeKey.startsWith('https://jsonhero.io/new?j=')) {
    return null;
  }
  const jsonString = window.atob(
    qrCodeKey.substring('https://jsonhero.io/new?j='.length),
  );
  const json = JSON.parse(jsonString);
  const decoded = json.key;
  const projectIdExecArray =
    QR_CODE_KEY_V0_DECODED_PROJECT_ID_PATTERN.exec(decoded);
  if (!projectIdExecArray) {
    return null;
  }
  const [_, projectIdCaptured] = projectIdExecArray;
  const projectId = String(projectIdCaptured);

  const shotHashExecArray =
    QR_CODE_KEY_V0_DECODED_SHOT_HASH_PATTERN.exec(decoded);
  if (!shotHashExecArray) {
    return null;
  }
  const [_1, shotHashCaptured] = shotHashExecArray;
  const shotHash = String(shotHashCaptured);

  const takeNumberExecArray =
    QR_CODE_KEY_V0_DECODED_TAKE_NUMBER_PATTERN.exec(decoded);
  if (!takeNumberExecArray) {
    return null;
  }
  const [_2, takeNumberCaptured] = takeNumberExecArray;
  const takeNumber = Number(takeNumberCaptured);

  return {
    projectId,
    shotHash,
    takeNumber,
  };
}

export function useResolveTakeQRCodeKey() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setTakeExportedQRCodeKey = useDocumentStore(
    (ctx) => ctx.setTakeExportedQRCodeKey,
  );
  const resolveTakeShotHash = useResolveTakeShotHash();
  const resolveTakeQRCodeKey = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {import('@/stores/document/DocumentStore').TakeId} takeId
     * @param {boolean} [readonly]
     */
    function _resolveTakeQRCodeKey(
      documentId,
      sceneId,
      shotId,
      takeId,
      readonly = false,
    ) {
      const store = UNSAFE_getStore();
      const take = getTakeById(store, documentId, takeId);
      let result = take?.exportDetails?.qrCodeKey;
      if (result) {
        return result;
      }
      const documentSettings = getDocumentSettingsById(store, documentId);
      const projectId = documentSettings?.projectId || '';
      const shotHash = resolveTakeShotHash(documentId, shotId);
      result = tryEncodeQRCodeKeyV1(projectId, shotHash, takeId);
      if (!readonly && takeId) {
        setTakeExportedQRCodeKey(documentId, takeId, result);
      }
      return result;
    },
    [UNSAFE_getStore, resolveTakeShotHash, setTakeExportedQRCodeKey],
  );
  return resolveTakeQRCodeKey;
}
