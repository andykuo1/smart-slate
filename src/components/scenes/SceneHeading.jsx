import { useSceneHeading, useSceneNumber } from '@/stores/document';
import { useCurrentCursor } from '@/stores/user';
import BarberpoleStyle from '@/styles/Barberpole.module.css';

import SceneFocusButton from './SceneFocusButton';
import SceneNumber from './SceneNumber';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SceneHeading({ className, documentId, sceneId }) {
  const [sceneHeading, setSceneHeading] = useSceneHeading(documentId, sceneId);
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const currentCursor = useCurrentCursor();
  const isActive =
    currentCursor.documentId === documentId &&
    currentCursor.sceneId === sceneId &&
    !currentCursor.shotId;

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
        className +
        ' ' +
        (isActive && 'bg-black text-white' + ' ' + BarberpoleStyle.barberpole)
      }>
      <SceneNumber sceneNumber={sceneNumber} />
      <input
        className="flex-1 bg-transparent px-2 py-6 text-xl"
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
      <SceneFocusButton documentId={documentId} sceneId={sceneId} />
      <SceneNumber sceneNumber={sceneNumber} />
    </div>
  );
}
