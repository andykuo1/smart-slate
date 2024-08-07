import { useCallback } from 'react';

import { tokenize } from '@/fdx/FDXTokenizer';
import { parse } from '@/fountain/FountainParser';
import { useAddDocument } from '@/stores/document';
import { uuid } from '@/utils/uuid';

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
        case 'fdx': {
          const tokens = tokenize(data);
          const document = fountainToDocument(tokens, {
            defaultDocumentTitle: 'My FinalDraft Movie',
          });
          if (documentId) {
            document.documentId = documentId;
          }
          addDocument(document);
          return document.documentId;
        }
        case 'fountain-text': {
          const { tokens } = parse(data);
          let document = fountainToDocument(tokens, {
            defaultDocumentTitle: 'My Fountain Movie',
          });
          if (documentId) {
            document.documentId = documentId;
          }
          addDocument(document);
          return document.documentId;
        }
        case 'project-json': {
          /** @type {import('@/stores/document/DocumentStore').Document} */
          let document = JSON.parse(data);
          // Treat this as a new document.
          document.documentId = uuid();
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
