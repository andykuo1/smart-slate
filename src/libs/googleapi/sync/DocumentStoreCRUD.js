import { clearVideoCache } from '@/recorder/cache';
import { getDocumentById } from '@/stores/document';
import { cloneDocument, createDocument } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';

import CRUD from './CRUD';
import { createConfiguration, createSyncFile } from './Sync';

export function useGetDocumentStoreConfiguration() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  async function getDocumentStoreConfiguration() {
    const store = UNSAFE_getStore();
    let result = createConfiguration();
    for (let document of Object.values(store.documents)) {
      if (!document.documentId) {
        continue;
      }
      if (!document.settings || document.settings.autoSaveTo !== 'gdrive') {
        continue;
      }
      let file = createSyncFile(document.documentId);
      file.fileId = document.settings.autoSaveGDriveFileId || undefined;
      file.lastDeletedMillis = document.lastDeletedMillis;
      file.lastUpdatedMillis = document.lastUpdatedMillis;
      result.files.push(file);
    }
    return result;
  }
  return getDocumentStoreConfiguration;
}

/**
 * @returns {CRUD<import('@/stores/document/DocumentStore').Document>}
 */
export function useDocumentStoreCRUD() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const addDocument = useDocumentStore((ctx) => ctx.addDocument);
  const updateDocument = useDocumentStore((ctx) => ctx.updateDocument);
  const deleteDocument = useDocumentStore((ctx) => ctx.deleteDocument);
  return {
    async create(key, name, data) {
      const result = createDocument(key);
      cloneDocument(result, data);
      result.settings.autoSaveGDriveFileId = name;
      addDocument(result);
      return result.documentId;
    },
    async read(key) {
      const store = UNSAFE_getStore();
      return getDocumentById(store, key);
    },
    async update(key, name, data) {
      updateDocument(key, (result) => {
        cloneDocument(result, data);
        result.settings.autoSaveGDriveFileId = name;
      });
    },
    async delete(key) {
      deleteDocument(key);
      clearVideoCache(key);
    },
    async list() {
      const store = UNSAFE_getStore();
      return Object.keys(store.documents).map((documentId) => ({
        id: documentId,
        name: documentId,
      }));
    },
  };
}
