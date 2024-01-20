import { useCallback } from 'react';

import { useAddDocument } from '@/stores/document';

import { parse } from './FountainParser';
import { fountainToDocument } from './FountainToDocumentParser';

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
        case 'fountain-text': {
          const { tokens } = parse(data);
          let document = fountainToDocument(tokens);
          if (documentId) {
            document.documentId = documentId;
          }
          addDocument(document);
          return document.documentId;
        }
        case 'project-json': {
          /** @type {import('@/stores/document/DocumentStore').Document} */
          let document = JSON.parse(data);
          // TODO: Maybe some versioning would be helpful here :P
          addDocument(document);
          break;
        }
        default:
          throw new Error('Unsupported import type.');
      }
    },
    [documentId, addDocument],
  );
  return importProject;
}
