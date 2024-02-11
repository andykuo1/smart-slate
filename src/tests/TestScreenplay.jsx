import ExampleScript from '@/fountain/BrickAndSteel.fountain?raw';
import { parse } from '@/fountain/FountainParser';
import { fountainToDocument } from '@/serdes/FountainToDocumentParser';
import {
  getBlockById,
  getSceneById,
  getShotById,
  getTakeById,
} from '@/stores/document';

export default function TestScreenplay() {
  const { tokens } = parse(ExampleScript);
  const document = fountainToDocument(tokens);
  const store = {
    documents: {
      [document.documentId]: document,
    },
  };
  return (
    <div className="w-full py-20">
      <output>
        {tokens.map((token) => (
          <pre>
            <code>{JSON.stringify(token)}</code>
          </pre>
        ))}
      </output>
      <h2 className="text-center text-2xl font-bold">
        {document.documentTitle}
      </h2>
      <div className="flex flex-col">
        <Document
          store={store}
          documentId={document.documentId}
          value={document}
        />
      </div>
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').Store} props.store
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').Document} props.value
 */
function Document({ store, documentId, value }) {
  return (
    <article>
      {Object.values(value.sceneOrder).map((sceneId) => (
        <Scene
          store={store}
          documentId={documentId}
          value={getSceneById(store, documentId, sceneId)}
        />
      ))}
    </article>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').Store} props.store
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').Scene} props.value
 */
function Scene({ store, documentId, value }) {
  return (
    <section>
      <h2 className="text-xl font-bold">{value.sceneHeading}</h2>
      {Object.values(value.blockIds).map((blockId) => (
        <Block
          store={store}
          documentId={documentId}
          value={getBlockById(store, documentId, blockId)}
        />
      ))}
    </section>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').Store} props.store
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').Block} props.value
 */
function Block({ store, documentId, value }) {
  let json = value.content || null;
  try {
    if (json) {
      json = JSON.parse(json);
    }
  } catch {
    // Do nothing.
  }
  if (!json) {
    return <p className="opacity-30">{'<empty>'}</p>;
  }
  let style = '';
  switch (value.contentStyle) {
    case 'note':
      style = 'opacity-30';
      break;
    case 'centered':
      style = 'text-center';
      break;
    case 'transition':
      style = 'text-right';
      break;
    case 'lyric':
      style = 'italic';
      break;
    case 'dialogue':
      style = 'ml-10';
      break;
    // @ts-expect-error This is the unprocessed catch-all.
    case 'unknown':
      style = 'text-red-500';
      break;
  }
  return (
    <div className="my-10">
      <p className={style}>
        <pre>
          {typeof json === 'object'
            ? // @ts-expect-error json should be a lexical object.
              json?.root?.children?.[0]?.children?.[0]?.text
            : json}
        </pre>
      </p>
      <ul>
        {Object.values(value.shotIds).map((shotId) => (
          <Shot
            store={store}
            documentId={documentId}
            value={getShotById(store, documentId, shotId)}
          />
        ))}
      </ul>
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').Store} props.store
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').Shot} props.value
 */
function Shot({ store, documentId, value }) {
  return (
    <li className="ml-4 flex flex-row gap-2">
      <div className="font-bold">- {value.shotType}</div>
      <div>{value.description}</div>
      <div className="ml-8">
        {Object.values(value.takeIds).map((takeId) => (
          <Take
            store={store}
            documentId={documentId}
            value={getTakeById(store, documentId, takeId)}
          />
        ))}
      </div>
    </li>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').Store} props.store
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').Take} props.value
 */
function Take({ store, value }) {
  return <output>Take {value.takeNumber}</output>;
}
