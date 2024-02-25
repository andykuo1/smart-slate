import ShotListAddButton from '@/components/shots/shotlist/ShotListAddButton';
import { getBlockById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

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
  const text = useDocumentStore(
    (ctx) => getBlockById(ctx, documentId, blockId)?.content,
  );
  const type = useDocumentStore(
    (ctx) => getBlockById(ctx, documentId, blockId)?.contentStyle,
  );
  return (
    <div className="group relative hover:bg-gray-100">
      <BlockContentReadOnly className="w-full pb-5" text={text} type={type} />
      {/* NOTE: Since sticky only works for relative parents, height 0 makes it act like an absolute element. */}
      <div className="sticky top-20 z-20 h-0">
        <BlockPartContentToolbar
          className="pointer-events-none flex -translate-y-[50%] flex-row opacity-0 group-hover:opacity-100"
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
        />
      </div>
      {children}
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.className
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
export function BlockPartContentToolbar({
  className,
  documentId,
  sceneId,
  blockId,
}) {
  return (
    <div className={className}>
      <button className="pointer-events-auto -ml-6 mr-auto rounded-full bg-white px-6 py-2 shadow-xl">
        EDIT
      </button>
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
            <span key={t + '.' + index} className="block">
              {t}
            </span>
          ))}
        </p>
      );
    case 'centered':
      return <p className={'text-center' + ' ' + className}>{text}</p>;
    case 'dialogue': {
      const lines = text.split('\n');
      const character = lines[0];
      const spokenLines = lines.slice(1);
      return (
        <blockquote className={'pl-[15%] pr-[20%]' + ' ' + className}>
          <header className="px-[30%] font-bold">{character}</header>
          <p>
            {spokenLines.map((line, index) => (
              <span
                key={line + '.' + index}
                className={line.startsWith('(') ? 'block pl-[15%]' : ''}>
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
          <span className="italic">{text}</span>
        </p>
      );
    case 'note':
      return <p className={'opacity-30' + ' ' + className}>{text}</p>;
    case 'transition':
      return <p className={'text-right' + ' ' + className}>{text}</p>;
    case '':
    default:
      return <pre>{text}</pre>;
  }
}
