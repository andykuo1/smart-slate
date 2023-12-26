import { useSceneHeading, useSceneNumber } from '@/stores/document';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SceneHeading({ className, documentId, sceneId }) {
  const [sceneHeading, setSceneHeading] = useSceneHeading(documentId, sceneId);
  const sceneNumber = useSceneNumber(documentId, sceneId);

  /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
  function onChange(e) {
    const el = e.target;
    setSceneHeading(documentId, sceneId, el.value.toUpperCase());
  }
  return (
    <div
      className={
        'relative flex flex-row items-center w-full border-b-2 border-dotted border-black' +
        ' ' +
        className
      }>
      <SceneNumber sceneNumber={sceneNumber} />
      <input
        className="flex-1 bg-transparent px-2 text-xl"
        type="text"
        list="sceneHeading"
        placeholder="INT/EXT. SCENE - DAY"
        value={sceneHeading}
        onChange={onChange}
        autoCapitalize="characters"
      />
      <datalist id="sceneHeading">
        <option value="INT. " />
        <option value="EXT. " />
      </datalist>
      <SceneNumber sceneNumber={sceneNumber} />
    </div>
  );
}

/**
 * @param {object} props
 * @param {number} props.sceneNumber
 */
function SceneNumber({ sceneNumber }) {
  const result = sceneNumber < 0 ? '??' : String(sceneNumber).padStart(2, '0');
  return <span className="px-2 font-mono opacity-30">{result}</span>;
}
