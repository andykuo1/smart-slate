import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { useEffect } from 'react';

import { getBlockById, useDocumentStore } from '@/stores/document';

// https://dio.la/article/lexical-state-updates

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} [props.editable]
 */
export default function BlockContent({
  className,
  documentId,
  blockId,
  editable = true,
}) {
  const blockContentType = useDocumentStore(
    (ctx) => getBlockById(ctx, documentId, blockId)?.contentType,
  );
  const blockContent = useDocumentStore(
    (ctx) => getBlockById(ctx, documentId, blockId)?.content,
  );
  const setBlockContent = useDocumentStore((ctx) => ctx.setBlockContent);

  /** @type {import('@lexical/react/LexicalComposer').InitialConfigType} */
  const initialConfig = {
    namespace: 'blockContent',
    editorState: blockContent || undefined,
    editable: Boolean(editable),
    /**
     * @param {Error} error
     */
    onError(error) {
      console.error(error);
    },
  };

  /**
   * @param {import('lexical').EditorState} editorState
   */
  function onChange(editorState) {
    const jsonString = JSON.stringify(editorState.toJSON());
    setBlockContent(documentId, blockId, 'lexical', jsonString);
  }

  if (blockContent && blockContentType !== 'lexical') {
    return <p>{blockContent}</p>;
  }

  return (
    <div className={'relative m-2' + ' ' + className}>
      <LexicalComposer initialConfig={initialConfig}>
        <PlainTextPlugin
          contentEditable={<ContentEditable className="p-2" />}
          placeholder={
            <div className="absolute top-2 left-2 opacity-30 pointer-events-none">
              {editable && 'What happens?...'}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onChange} />
      </LexicalComposer>
    </div>
  );
}

/**
 * @param {object} props
 * @param {(editorState: import('lexical').EditorState) => void} props.onChange
 */
function OnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}
