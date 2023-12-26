import { useState } from 'react';

import AddNotesIcon from '@material-symbols/svg-400/rounded/add_notes.svg';
import { Fountain } from 'fountain-js';

import ExampleScript from '@/serdes/BrickAndSteel.fountain?raw';
import { fountainTokensToDocument } from '@/serdes/FountainToDocumentParser';

export default function Screenplay() {
  const fountain = new Fountain();
  const { tokens } = fountain.parse(ExampleScript, true);
  const document = fountainTokensToDocument(tokens);
  const documentId = document.documentId;
  const sceneIds = document.sceneOrder;
  return (
    <article className="md:mx-[20vw] py-20">
      <h2 className="text-center">{document.documentTitle}</h2>
      <div className="flex flex-col">
        {sceneIds.map((sceneId) => (
          <SceneBlock
            key={`sceneblock-${sceneId}`}
            documentId={documentId}
            sceneId={sceneId}
            document={document}
          />
        ))}
      </div>
    </article>
  );
}

/**
 *
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').Document} props.document
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
function SceneBlock({ document, documentId, sceneId }) {
  const scene = document.scenes[sceneId];
  const blockIds = scene.blockIds;
  return (
    <section className="flex flex-row my-10">
      <div className="flex-1">
        <HeadingBlock
          document={document}
          documentId={documentId}
          sceneId={sceneId}
        />
        {blockIds.map((blockId, index) => (
          <Block
            key={`block-${blockId}`}
            documentId={documentId}
            blockId={blockId}
            block={document.blocks[blockId]}
            blockNumber={index + 1}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').Document} props.document
 */
function HeadingBlock({ documentId, sceneId, document }) {
  const scene = document.scenes[sceneId];
  return (
    <BlockLayout title={'Scene Heading'} blockNumber={'#'} disabled={true}>
      <h2 className="flex-1 flex flex-row items-center underline">
        {scene.sceneHeading || '---'}
      </h2>
    </BlockLayout>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/document/DocumentStore').Block} props.block
 * @param {number} props.blockNumber
 */
function Block({ documentId, blockId, block, blockNumber }) {
  const [opened, setOpened] = useState(false);

  function onClick() {
    setOpened(true);
  }

  return (
    <BlockLayout
      title={'Block ' + blockNumber}
      blockNumber={blockNumber}
      onClick={onClick}>
      <div className="flex-1">
        {block.content.split('\n').map((text) => (
          <p>{text}</p>
        ))}
      </div>
      {opened && (
        <div className="flex-1 flex">
          <textarea className="flex-1 resize-none bg-transparent px-2" />
        </div>
      )}
    </BlockLayout>
  );
}

/**
 * @param {object} props
 * @param {string} props.title
 * @param {number|string} props.blockNumber
 * @param {() => void} [props.onClick]
 * @param {import('react').ReactNode} props.children
 * @param {boolean} [props.disabled]
 */
function BlockLayout({
  title,
  blockNumber,
  onClick = undefined,
  disabled = false,
  children,
}) {
  return (
    <div className="relative group flex flex-row my-4">
      <BlockOptions
        title={title}
        displayName={String(blockNumber)}
        onClick={onClick}
        disabled={disabled}
      />
      <div className="flex-1 flex flex-row">{children}</div>
      <BlockOptions
        title={title}
        displayName={String(blockNumber)}
        onClick={onClick}
        disabled={disabled}
      />
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.displayName
 * @param {() => void} [props.onClick]
 * @param {boolean} [props.disabled]
 */
function BlockOptions({
  title,
  displayName,
  onClick = undefined,
  disabled = false,
}) {
  return (
    <div className="flex flex-col items-center">
      <button
        className="w-10 text-center bg-gray-100 rounded-full mx-2 py-2"
        title={title}
        onClick={onClick}
        disabled={disabled}>
        {displayName}
        <AddNotesIcon
          className={
            'fill-current w-6 h-6 mx-auto' +
            ' ' +
            'opacity-0' +
            ' ' +
            (!disabled && 'transition-opacity group-hover:opacity-100')
          }
        />
      </button>
    </div>
  );
}
