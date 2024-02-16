import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { useEffect, useRef, useState } from 'react';

import { parse } from '@/fountain/FountainParser';
import { fountainToDocument } from '@/serdes/FountainToDocumentParser';
import {
  getBlockById,
  getBlockOrder,
  getSceneById,
  useAddBlock,
} from '@/stores/document';
import { createBlock } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} [props.editable]
 * @param {Function} [props.setEditable]
 * @param {import('react').ReactNode} [props.children]
 */
export default function BlockContent({
  className,
  documentId,
  sceneId,
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
        sceneId={sceneId}
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
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} [props.editable]
 * @param {Function} [props.setEditable]
 * @param {import('react').ReactNode} [props.children]
 */
function BlockContentFountainJSON({
  className,
  documentId,
  sceneId,
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
        sceneId={sceneId}
        blockId={blockId}
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
        <div
          className={
            'my-4 ml-[15%] mr-[20%] whitespace-normal' + ' ' + className
          }>
          <pre className="mx-[30%] whitespace-normal font-bold">{lines[0]}</pre>
          {lines.slice(1).map((line, index) => (
            <pre
              key={line + '.' + index}
              className={
                'whitespace-normal' +
                ' ' +
                (line.startsWith('(') ? 'ml-[15%]' : '')
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
        'whitespace-normal' + ' ' + contentClassName.join(' ') + ' ' + className
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
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {Function} [props.setEditable]
 * @param {import('react').ReactNode} [props.children]
 */
function BlockContentFountainJSONInput({
  className,
  documentId,
  sceneId,
  blockId,
  setEditable,
  children,
}) {
  const block = useDocumentStore((ctx) =>
    getBlockById(ctx, documentId, blockId),
  );
  const [state, setState] = useState(
    formatTextWithOverrides(block.content, block.contentStyle),
  );
  const inputRef = useRef(/** @type {HTMLTextAreaElement|null} */ (null));
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setBlockContent = useDocumentStore((ctx) => ctx.setBlockContent);
  const addBlock = useAddBlock();
  const deleteBlock = useDocumentStore((ctx) => ctx.deleteBlock);
  useEffect(() => {
    inputRef.current?.focus();
  });

  function onBlur() {
    setEditable?.(false);
    let blocks = parseTextToBlocks(state);

    let store = UNSAFE_getStore();
    let firstBlock = blocks.shift();
    if (!firstBlock) {
      // Delete this block if it's empty.
      setBlockContent(documentId, blockId, 'fountain-json', '');

      let block = getBlockById(store, documentId, blockId);
      if (block.shotIds.length <= 0) {
        deleteBlock(documentId, blockId);
      }
      return;
    }

    let blockOrder = getBlockOrder(store, documentId, sceneId, blockId);

    setBlockContent(
      documentId,
      blockId,
      'fountain-json',
      firstBlock.content ?? '',
      firstBlock.contentStyle,
    );

    if (blocks.length > 0) {
      let currentIndex = blockOrder - 1;
      for (let block of blocks) {
        addBlock(documentId, sceneId, block, ++currentIndex);
      }
    }
  }

  /** @type {import('react').ChangeEventHandler<HTMLTextAreaElement>} */
  function onChange(e) {
    setState(e.target.value);
  }

  return (
    <>
      <textarea
        ref={inputRef}
        className={
          'w-full resize-none bg-transparent font-mono' + ' ' + className
        }
        value={state}
        placeholder="< What happened next? >"
        onChange={onChange}
        onBlur={onBlur}
      />
      {children}
    </>
  );
}

const FIRST_SCENE_HEADING = '__CURRENT_SCENE__';

/**
 * @param {string} text
 * @param {import('@/stores/document/DocumentStore').BlockContentStyle} style
 */
function formatTextWithOverrides(text, style) {
  switch (style) {
    case 'centered':
      return `>${text}<`;
    case 'lyric':
      return `~${text}`;
    case 'note':
      return `[[${text}]]`;
    case 'transition':
      if (text.endsWith(':')) {
        return text;
      }
      return `>${text}`;
    case 'dialogue':
    case 'action':
    default:
      return text;
  }
}

/**
 * @param {string} text
 * @returns {Array<import('@/stores/document/DocumentStore').Block>}
 */
function parseTextToBlocks(text) {
  let preparedText = `.${FIRST_SCENE_HEADING}\n\n${text}`;
  let parsed = parse(preparedText);
  let tempDocument = fountainToDocument(parsed.tokens);
  let tempDocumentId = tempDocument.documentId;
  let tempStore = {
    documents: { [tempDocumentId]: tempDocument },
  };
  let result = [];
  // NOTE: We do not allow scenes while writing in blocks. So
  //  scene tokens should be converted to just text.
  //  ... we also do not allow shots.
  for (let sceneId of tempDocument.sceneOrder) {
    let scene = getSceneById(tempStore, tempDocumentId, sceneId);
    if (scene.sceneHeading !== FIRST_SCENE_HEADING) {
      // This is unexpected scene header. Make it a text block.
      let block = createBlock();
      block.content = `!${scene.sceneHeading}`;
      block.contentType = 'fountain-json';
      block.contentStyle = 'action';
      result.push(block);
    }
    for (let blockId of scene.blockIds) {
      result.push(tempDocument.blocks[blockId]);
    }
  }
  return result;
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
            <div className="pointer-events-none absolute left-2 top-2 opacity-30">
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
