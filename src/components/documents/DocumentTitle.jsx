import { useCallback } from 'react';

import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentTitle } from '@/stores/document/use';
import { useDocumentStore } from '@/stores/document/use';

import DocumentContentCount from './DocumentContentCount';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {string} [props.className]
 */
export default function DocumentTitle({ className, documentId }) {
  const projectId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );
  const [documentTitle, setDocumentTitle] = useDocumentTitle(documentId);
  const onDocumentTitleChange = useCallback(
    /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
    function onTitleChange(e) {
      let el = e.target;
      setDocumentTitle(documentId, el.value);
    },
    [documentId, setDocumentTitle],
  );

  return (
    <h2 className={'flex flex-col text-center my-2' + ' ' + className}>
      <div className="flex-1 flex flex-row underline mx-2">
        <input
          className="flex-1 text-center text-2xl bg-transparent"
          title="Project title"
          value={documentTitle}
          placeholder="Untitled"
          onChange={onDocumentTitleChange}
        />
      </div>
      <label className="text-xs opacity-30 flex flex-col">
        <output>{projectId}</output>
      </label>
      <DocumentContentCount documentId={documentId} />
    </h2>
  );
}
