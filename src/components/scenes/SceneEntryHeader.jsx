import { useRef } from 'react';

import SettingsSceneOpenClapperButton from '@/components/scenes/settings/SettingsSceneOpenClapperButton';
import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import { useSceneHeading } from '@/stores/document';
import {
  useCurrentCursor,
  useSetUserCursor,
  useUserStore,
} from '@/stores/user';
import BarberpoleStyle from '@/styles/Barberpole.module.css';

import SceneNumber from './SceneNumber';
import SettingsSceneShotsRenumberButton from './settings/SettingsSceneShotsRenumberButton';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SceneEntryHeader({ className, documentId, sceneId }) {
  const containerRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const [sceneHeading, setSceneHeading] = useSceneHeading(documentId, sceneId);
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const currentCursor = useCurrentCursor();
  const setUserCursor = useSetUserCursor();
  const setEditMode = useUserStore((ctx) => ctx.setEditMode);
  const isActive =
    currentCursor.documentId === documentId &&
    currentCursor.sceneId === sceneId &&
    !currentCursor.shotId;

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
    }
    setEditMode('story');
    // Debounce to wait for layout changes...
    setTimeout(
      () =>
        containerRef.current?.scrollIntoView({
          block: 'start',
          behavior: 'instant',
        }),
      0,
    );
  }

  return (
    <div
      ref={containerRef}
      className={
        'relative flex flex-row items-center' +
        ' ' +
        className +
        ' ' +
        (isActive && 'bg-black text-white' + ' ' + BarberpoleStyle.barberpole)
      }>
      <SceneNumber sceneNumber={sceneNumber} onClick={onClick} />
      <input
        className="flex-1 w-full bg-transparent px-2 py-6 text-xl font-bold"
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
      <SceneStatus documentId={documentId} sceneId={sceneId} />
      <SceneNumber sceneNumber={sceneNumber} onClick={onClick} />
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
function SceneStatus({ documentId, sceneId }) {
  return (
    <div className="flex flex-row">
      <SettingsSceneShotsRenumberButton
        documentId={documentId}
        sceneId={sceneId}
      />
      <SettingsSceneOpenClapperButton
        documentId={documentId}
        sceneId={sceneId}
      />
    </div>
  );
}
