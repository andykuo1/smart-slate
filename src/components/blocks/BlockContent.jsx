import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { useEffect, useRef } from 'react';

import { getBlockById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} [props.editable]
 * @param {Function} [props.setEditable]
 * @param {import('react').ReactNode} [props.children]
 */
export default function BlockContent({
  className,
  documentId,
  blockId,
  editable = true,
  setEditable,
  children,
}) {
  const blockContentType = useDocumentStore(
    (ctx) => getBlockById(ctx, documentId, blockId)?.contentType,
  );
  const blockContent = useDocumentStore(
    (ctx) => getBlockById(ctx, documentId, blockId)?.content,
  );
  if (blockContentType === 'lexical') {
    return (
      <BlockContentLexical
        className={className}
        documentId={documentId}
        blockId={blockId}
        blockContent={blockContent}
        editable={editable}>
        {children}
      </BlockContentLexical>
    );
  } else if (blockContentType === 'string') {
    return (
      <pre className={className}>
        {blockContent}
        {children}
      </pre>
    );
  } else if (blockContentType === 'fountain-json') {
    return (
      <BlockContentFountainJSON
        className={className}
        documentId={documentId}
        blockId={blockId}
        editable={editable}
        setEditable={setEditable}>
        {children}
      </BlockContentFountainJSON>
    );
  } else {
    return (
      <pre className={className}>
        {blockContentType}:{blockContent}
        {children}
      </pre>
    );
  }
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} [props.editable]
 * @param {Function} [props.setEditable]
 * @param {import('react').ReactNode} [props.children]
 */
function BlockContentFountainJSON({
  className,
  documentId,
  blockId,
  editable,
  setEditable,
  children,
}) {
  const content = useDocumentStore(
    (ctx) => getBlockById(ctx, documentId, blockId)?.content,
  );
  const contentStyle = useDocumentStore(
    (ctx) => getBlockById(ctx, documentId, blockId)?.contentStyle,
  );
  if (editable) {
    return (
      <BlockContentFountainJSONInput
        className={className}
        documentId={documentId}
        blockId={blockId}
        content={content}
        setEditable={setEditable}>
        {children}
      </BlockContentFountainJSONInput>
    );
  }
  let contentClassName = [];
  switch (contentStyle) {
    case 'centered':
      contentClassName.push('text-center whitespace-normal');
      break;
    case 'dialogue': {
      const lines = content.split('\n');
      return (
        <div className={'my-4 ml-[15%] whitespace-normal' + ' ' + className}>
          <pre className="ml-[15%] font-bold whitespace-normal">{lines[0]}</pre>
          {lines.slice(1).map((line, index) => (
            <pre
              key={line + '.' + index}
              className={
                'whitespace-normal' +
                ' ' +
                (line.startsWith('(') ? 'mx-[7%]' : '')
              }>
              {line}
            </pre>
          ))}
          {children}
        </div>
      );
    }
    case 'transition':
      contentClassName.push('text-right');
      break;
    case 'lyric':
      contentClassName.push('italic');
      break;
    case 'note':
      contentClassName.push('opacity-30');
      break;
  }
  return (
    <pre
      className={
        'my-4 whitespace-normal' +
        ' ' +
        contentClassName.join(' ') +
        ' ' +
        className
      }>
      {content || (
        <span className="opacity-30">
          {'< '}What happened?{' >'}
        </span>
      )}
      {children}
    </pre>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {string} props.content
 * @param {Function} [props.setEditable]
 * @param {import('react').ReactNode} [props.children]
 */
function BlockContentFountainJSONInput({
  className,
  documentId,
  blockId,
  content,
  setEditable,
  children,
}) {
  const inputRef = useRef(/** @type {HTMLTextAreaElement|null} */ (null));
  const setBlockContent = useDocumentStore((ctx) => ctx.setBlockContent);
  useEffect(() => {
    inputRef.current?.focus();
  });
  // TOOD: This should grow with content :(
  return (
    <>
      <textarea
        ref={inputRef}
        className={
          'font-mono bg-transparent resize-none w-full' + ' ' + className
        }
        value={content}
        placeholder="< What happened? >"
        onChange={(e) =>
          setBlockContent(
            documentId,
            blockId,
            'fountain-json',
            /** @type {HTMLTextAreaElement} */ (e.target).value,
          )
        }
        onBlur={(e) => setEditable?.(false)}
      />
      {children}
    </>
  );
}

// https://dio.la/article/lexical-state-updates

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {string} props.blockContent
 * @param {boolean} [props.editable]
 * @param {import('react').ReactNode} [props.children]
 */
function BlockContentLexical({
  className,
  documentId,
  blockId,
  blockContent,
  editable = true,
  children,
}) {
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

  return (
    <div className={'relative' + ' ' + className}>
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
      {children}
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
