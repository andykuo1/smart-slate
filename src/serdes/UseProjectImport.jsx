import { useCallback } from 'react';

import { Fountain } from 'fountain-js';

import { useAddDocument } from '@/stores/document';

import { fountainTokensToDocument } from './FountainToDocumentParser';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} [documentId]
 */
export function useProjectImport(documentId = undefined) {
  const addDocument = useAddDocument();
  const importProject = useCallback(
    /**
     * @param {string} type
     * @param {any} data
     */
    function _importProject(type, data) {
      switch (type) {
        case 'fountain-text':
          {
            const fountain = new Fountain();
            const { tokens } = fountain.parse(data, true);
            let document = fountainTokensToDocument(tokens);
            if (documentId) {
              document.documentId = documentId;
            }
            addDocument(document);
          }
          break;
        case 'json':
          break;
        default:
      }
    },
    [documentId, addDocument],
  );
  return importProject;
}
