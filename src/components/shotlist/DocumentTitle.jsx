import { useCallback } from 'react';

import { useDocumentTitle } from '@/stores/document';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function DocumentTitle({ documentId }) {
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
    <h2 className="flex flex-col text-center my-2">
      <div className="flex-1 flex flex-row underline">
        <div className="flex-1" />
        <input
          className="text-center text-2xl bg-transparent"
          title="Project title"
          value={documentTitle}
          placeholder="Untitled"
          onChange={onDocumentTitleChange}
        />
        <div className="flex-1" />
      </div>
      <label className="text-xs opacity-30">
        <span>ID: </span>
        <output>{documentId}</output>
      </label>
    </h2>
  );
}
