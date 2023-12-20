import AddNotesIcon from '@material-symbols/svg-400/rounded/add_notes.svg';
import { Fountain } from 'fountain-js';

import ExampleScript from '@/serdes/BrickAndSteel.fountain?raw';
import { fountainTokensToDocument } from '@/serdes/FountainToDocumentParser';

export default function Screenplay() {
  const fountain = new Fountain();
  const { tokens } = fountain.parse(ExampleScript, true);
  const document = fountainTokensToDocument(tokens);
  const documentId = document.documentId;
  const blockIds = Object.keys(document.blocks);
  return (
    <article>
      <h2>{document.documentTitle}</h2>
      <div className="flex flex-row">
        <div className="flex-1 border-r-2 border-dashed">
          {blockIds.map((blockId) => (
            <Block
              key={`block-${blockId}`}
              documentId={documentId}
              blockId={blockId}
              block={document.blocks[blockId]}
            />
          ))}
        </div>
        <div className="flex-1"></div>
      </div>
    </article>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/DocumentStore').Block} props.block
 */
function Block({ documentId, blockId, block }) {
  return (
    <div className="group relative my-10 rounded bg-red-300">
      {block.content.split('\n').map((text) => (
        <p>{text}</p>
      ))}
      <button className="absolute top-0 right-0 rounded-full bg-white p-2 transition-opacity opacity-0 group-hover:opacity-100">
        <AddNotesIcon className="fill-current w-6 h-6" />
      </button>
    </div>
  );
}
