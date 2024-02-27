import { useCallback, useEffect, useRef, useState } from 'react';

import { blobToDataURI } from '@/components/shots/options/ShotThumbnailHelper';
import ShotListAddButton from '@/components/shots/shotlist/ShotListAddButton';
import BlockContentTextArea from '@/documentV2/BlockContentTextArea';
import { getBlockById, getSceneCount, getSceneOrder } from '@/stores/document';
import { createShot } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';
import {
  useCurrentCursor,
  useSetUserCursor,
  useUserStore,
} from '@/stores/user';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

import { useTextToBlockSerializer } from './UseTextToBlockSerializer';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('react').ReactNode} [props.children]
 */
export default function BlockParts({ documentId, sceneId, blockId, children }) {
  return (
    <Block documentId={documentId} sceneId={sceneId} blockId={blockId}>
      {children}
    </Block>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('react').ReactNode} [props.children]
 */
function Block({ documentId, sceneId, blockId, children }) {
  const [editing, setEditing] = useState(false);
  const ref = useRef(/** @type {HTMLDivElement|null} */ (null));
  const text = useDocumentStore(
    (ctx) => getBlockById(ctx, documentId, blockId)?.content,
  );
  const type = useDocumentStore(
    (ctx) => getBlockById(ctx, documentId, blockId)?.contentStyle,
  );
  const userCursor = useCurrentCursor();
  const setUserCursor = useSetUserCursor();
  const isCursorEditType = useUserStore(
    (ctx) => ctx.editor?.documentEditor?.cursorType === 'edit',
  );
  const isLastScene = useDocumentStore(
    (ctx) =>
      getSceneOrder(ctx, documentId, sceneId) >= getSceneCount(ctx, documentId),
  );
  const serializeTextToBlock = useTextToBlockSerializer();

  function onEdit() {
    if (userCursor.blockId !== blockId) {
      setUserCursor(documentId, sceneId, '', '', blockId);
    }
    setEditing(true);
  }

  function onClick() {
    if (isCursorEditType) {
      if (userCursor.blockId !== blockId) {
        setUserCursor(documentId, sceneId, '', '', blockId);
      }
      setEditing(true);
    }
  }

  /**
   * @param {string} value
   */
  function onChange(value) {
    setEditing(false);
    serializeTextToBlock(documentId, sceneId, blockId, value, isLastScene);
  }

  useBlockDataDrop(ref, documentId, sceneId, blockId);

  // TODO: Add a text editable version for shot list
  // TODO: Make the textarea LOOK like it's editing.
  // TODO: Add shortcuts to textarea editing.
  return (
    <div ref={ref} className={'group relative hover:bg-gray-100'}>
      <div className="" onClick={onClick}>
        {editing ? (
          <BlockContentTextArea
            className={'w-full bg-transparent pb-5'}
            text={text}
            type={type}
            placeholder={
              isLastScene
                ? '< Describe or paste your scenes here >'
                : '< What happened? >'
            }
            onChange={onChange}
          />
        ) : (
          <BlockContentReadOnly
            className="w-full pb-5"
            text={text}
            type={type}
          />
        )}
      </div>
      {/* NOTE: Since sticky only works for relative parents, height 0 makes it act like an absolute element. */}
      <div
        className={'sticky top-20 z-20 h-0' + ' ' + 'hidden group-hover:block'}>
        <BlockPartContentToolbar
          className="pointer-events-none flex -translate-y-[50%] flex-row"
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}>
          <button
            className="pointer-events-auto -ml-6 mr-auto rounded-full bg-white px-6 py-2 shadow-xl"
            onClick={onEdit}>
            {editing ? 'CANCEL' : 'EDIT'}
          </button>
        </BlockPartContentToolbar>
      </div>
      {children}
    </div>
  );
}

/**
 * @template {HTMLElement} T
 * @param {import('react').RefObject<T>} elementRef
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 */
function useBlockDataDrop(elementRef, documentId, sceneId, blockId) {
  const addShot = useDocumentStore((ctx) => ctx.addShot);

  const onDragEnter = useCallback(
    /** @param {DragEvent} e */
    function _onDragEnter(e) {
      e.preventDefault();
      const target = elementRef.current;
      if (!target) {
        return;
      }
      target.style.setProperty('background', 'slategray');
    },
    [],
  );

  const onDragLeave = useCallback(
    /** @param {DragEvent} e */
    function _onDragLeave(e) {
      e.preventDefault();
      const target = elementRef.current;
      if (!target) {
        return;
      }
      target.style.removeProperty('background');
    },
    [],
  );

  const onDragOver = useCallback(
    /** @param {DragEvent} e */
    function _onDragOver(e) {
      e.preventDefault();
      const target = elementRef.current;
      if (!target) {
        return;
      }
      target.style.setProperty('background', 'slategray');
    },
    [],
  );

  const onDrop = useCallback(
    /** @param {DragEvent} e */
    function _onDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      if (!e.dataTransfer) {
        return;
      }

      const target = elementRef.current;
      if (!target) {
        return;
      }
      target.style.removeProperty('background');

      if (e.dataTransfer.types.includes('Files')) {
        const items = e.dataTransfer.items;
        for (let item of items) {
          if (item.kind === 'file') {
            const file = item.getAsFile();
            if (!file) {
              continue;
            }
            if (!file.type.startsWith('image/')) {
              console.log('[BLOCKDROP] Found unsupported file type', file.type);
              continue;
            }
            const canvasElement = document.createElement('canvas');
            blobToDataURI(file, MAX_THUMBNAIL_WIDTH, MAX_THUMBNAIL_HEIGHT, {
              current: canvasElement,
            }).then((result) => {
              let shot = createShot();
              shot.referenceImage = result;
              addShot(documentId, sceneId, blockId, shot);
            });
          }
        }
      } else if (e.dataTransfer.types.includes('text/uri-list')) {
        const dataURI = e.dataTransfer.getData('text/uri-list');
        let shot = createShot();
        shot.referenceImage = dataURI;
        addShot(documentId, sceneId, blockId, shot);
      } else {
        console.log('[BLOCKDROP] Dropped data types:', e.dataTransfer.types);
      }
    },
    [documentId, sceneId, blockId, addShot],
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }
    element.addEventListener('dragenter', onDragEnter);
    element.addEventListener('dragleave', onDragLeave);
    element.addEventListener('dragover', onDragOver);
    element.addEventListener('drop', onDrop);
    return () => {
      element.removeEventListener('dragenter', onDragEnter);
      element.removeEventListener('dragleave', onDragLeave);
      element.removeEventListener('dragover', onDragOver);
      element.removeEventListener('drop', onDrop);
    };
  }, [elementRef]);
}

/**
 * @param {object} props
 * @param {string} props.className
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('react').ReactNode} props.children
 */
export function BlockPartContentToolbar({
  className,
  documentId,
  sceneId,
  blockId,
  children,
}) {
  return (
    <div className={className}>
      {children}
      <BlockPartNewShotTray
        className="pointer-events-auto -mr-6 flex gap-2 py-2 shadow-xl sm:gap-10"
        documentId={documentId}
        sceneId={sceneId}
        blockId={blockId}
      />
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
function BlockPartNewShotTray({ className, documentId, sceneId, blockId }) {
  return (
    <div
      className={
        'flex-row rounded-full bg-white px-6 text-gray-400 dark:bg-gray-600 dark:text-gray-800' +
        ' ' +
        (className ?? 'flex')
      }>
      <div className="h-6 w-6 rounded hover:text-black dark:hover:text-white">
        <ShotListAddButton
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotType=""
          title="New shot"
        />
      </div>
      <div className="h-6 w-6 rounded hover:text-black dark:hover:text-white">
        <ShotListAddButton
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotType="WS"
          title="New wide shot"
        />
      </div>
      <div className="h-6 w-6 rounded hover:text-black dark:hover:text-white">
        <ShotListAddButton
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotType="MS"
          title="New medium shot"
        />
      </div>
      <div className="h-6 w-6 rounded hover:text-black dark:hover:text-white">
        <ShotListAddButton
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotType="CU"
          title="New close-up shot"
        />
      </div>
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.className
 * @param {string} props.text
 * @param {import('@/stores/document/DocumentStore').BlockContentStyle} props.type
 */
function BlockContentReadOnly({ className, text, type }) {
  switch (type) {
    case 'action':
      return (
        <p className={className}>
          {text.split('\n').map((t, index) => (
            <span key={t + '.' + index} className="block whitespace-pre-wrap">
              {t}
            </span>
          ))}
        </p>
      );
    case 'centered':
      return (
        <p className={'whitespace-pre-wrap text-center' + ' ' + className}>
          {text}
        </p>
      );
    case 'dialogue': {
      const lines = text.split('\n');
      const character = lines[0];
      const spokenLines = lines.slice(1);
      return (
        <blockquote className={'pl-[15%] pr-[20%]' + ' ' + className}>
          <header className="whitespace-pre-wrap pl-[30%] font-bold">
            {character}
          </header>
          <p>
            {spokenLines.map((line, index) => (
              <span
                key={line + '.' + index}
                className={
                  'whitespace-pre-wrap' +
                  ' ' +
                  (line.startsWith('(') ? 'block pl-[15%]' : '')
                }>
                {line}
              </span>
            ))}
          </p>
        </blockquote>
      );
    }
    case 'lyric':
      return (
        <p className={className}>
          <span className="whitespace-pre-wrap italic">{text}</span>
        </p>
      );
    case 'note':
      return (
        <p className={'whitespace-pre-wrap opacity-30' + ' ' + className}>
          {text}
        </p>
      );
    case 'transition':
      return (
        <p className={'whitespace-pre-wrap text-right' + ' ' + className}>
          {text}
        </p>
      );
    case '':
    default:
      return <pre className="whitespace-pre-wrap">{text}</pre>;
  }
}
