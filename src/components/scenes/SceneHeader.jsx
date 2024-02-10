import { useRef } from 'react';

import { useScrollIntoView } from '@/libs/UseScrollIntoView';
import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import { useSceneHeading } from '@/stores/document';
import { useCurrentCursor, useSetUserCursor } from '@/stores/user';
import BarberpoleStyle from '@/styles/Barberpole.module.css';

import SceneCollapse from './SceneCollapse';
import { getSceneFocusId } from './SceneFocus';
import SceneNumber from './SceneNumber';
import SceneStatus from './SceneStatus';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SceneHeader({ className, documentId, sceneId }) {
  const containerRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const [sceneHeading, setSceneHeading] = useSceneHeading(documentId, sceneId);
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const currentCursor = useCurrentCursor();
  const setUserCursor = useSetUserCursor();
  const scrollIntoView = useScrollIntoView(containerRef);
  const isActive =
    currentCursor.documentId === documentId &&
    currentCursor.sceneId === sceneId;

  /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
  function onChange(e) {
    const el = e.target;
    setSceneHeading(documentId, sceneId, el.value.toUpperCase());
  }

  function onClick() {
    if (isActive) {
      setUserCursor(documentId, '', '');
    } else {
      setUserCursor(documentId, sceneId, '');
      scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  }

  const dataListId = 'sceneHeading-' + sceneId;
  return (
    <div
      ref={containerRef}
      id={getSceneFocusId(sceneId)}
      className={
        'relative flex flex-row items-center' +
        ' ' +
        className +
        ' ' +
        (isActive && 'bg-black text-white' + ' ' + BarberpoleStyle.barberpole)
      }>
      <SceneNumber sceneNumber={sceneNumber} onClick={onClick} />
      <SceneCollapse
        containerRef={containerRef}
        documentId={documentId}
        sceneId={sceneId}
      />
      <input
        className="flex-1 w-full bg-transparent px-2 py-6 text-xl font-bold"
        type="text"
        list={dataListId}
        placeholder="INT/EXT. SCENE - DAY"
        value={sceneHeading}
        onChange={onChange}
        autoCapitalize="characters"
      />
      <datalist id={dataListId}>
        <option value="INT. " />
        <option value="EXT. " />
      </datalist>
      <SceneStatus documentId={documentId} sceneId={sceneId} />
      <SceneNumber sceneNumber={sceneNumber} onClick={onClick} />
    </div>
  );
}
