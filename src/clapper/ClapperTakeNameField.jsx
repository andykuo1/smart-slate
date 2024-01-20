import {
  findBlockWithShotId,
  findSceneWithBlockId,
  useBlockIds,
  useSceneNumber,
  useShotIds,
  useShotNumber,
  useTakeIds,
} from '@/stores/document';
import {
  useDocumentStore,
  useSceneIds,
  useSceneShotCount,
} from '@/stores/document/use';
import { useCurrentCursor, useSetUserCursor } from '@/stores/user';

import {
  formatSceneShotNumber,
  formatTakeNumber,
} from '../components/takes/TakeNameFormat';
import ClapperShotHashField from './ClapperShotHashField';
import ClapperShotTypeField from './ClapperShotTypeField';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function ClapperTakeNameField({ className, documentId }) {
  const { sceneId, shotId } = useCurrentCursor();
  return (
    <table
      className={
        'table-fixed text-center border-y-4 border-white overflow-hidden text-[20vmin]' +
        ' ' +
        className
      }>
      <thead>
        <tr>
          <th className="border-r-4 border-white w-[33%] text-xs">ROLL</th>
          <th className="border-x-4 border-white w-[33%] text-xs">SCENE</th>
          <th className="border-l-4 border-white w-[33%] text-xs">TAKE</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border-r-4 border-white">
            <select className="bg-transparent">
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </td>
          <td className="relative border-x-4 border-white">
            <SceneShotSelector
              documentId={documentId}
              sceneId={sceneId}
              shotId={shotId}
            />
            <ClapperShotHashField
              className="absolute text-[5vmin] bottom-0 left-0 right-0"
              documentId={documentId}
              shotId={shotId}
            />
          </td>
          <td className="relative border-l-4 border-white">
            <TakeSelector />
            <ClapperShotTypeField
              className="absolute text-[5vmin] bottom-0 left-0 right-0"
              documentId={documentId}
              shotId={shotId}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 */
function TakeSelector({ className }) {
  const { documentId, sceneId, shotId, takeId } = useCurrentCursor();
  const takeIds = useTakeIds(documentId, shotId);
  const setUserCursor = useSetUserCursor();

  /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
  function onChange(e) {
    const target = /** @type {HTMLSelectElement} */ (e.target);
    const value = target.value;
    setUserCursor(documentId, sceneId, shotId, value);
  }

  const takeCount = takeIds.length;
  const takeOptions = [];
  for (let i = takeCount - 1; i >= 0; --i) {
    let takeId = takeIds[i];
    takeOptions.push(
      <option key={takeId} value={takeId}>
        {formatTakeNumber(i + 1, true)}
      </option>,
    );
  }
  return (
    <select
      className={'bg-transparent text-center outline-none' + ' ' + className}
      value={takeId}
      onChange={onChange}>
      <option value="">{takeIds.length + 1}</option>
      {takeOptions}
    </select>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
function SceneShotSelector({ className, documentId, sceneId, shotId }) {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setUserCursor = useSetUserCursor();

  const sceneIds = useSceneIds(documentId);
  /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
  function onChange(e) {
    const target = /** @type {HTMLSelectElement} */ (e.target);
    const value = target.value;
    const store = UNSAFE_getStore();
    const block = findBlockWithShotId(store, documentId, value);
    if (!block) {
      return;
    }
    const scene = findSceneWithBlockId(store, documentId, block.blockId);
    if (!scene) {
      return;
    }
    setUserCursor(documentId, scene.sceneId, value, '');
  }
  return (
    <select
      className={'text-center bg-transparent outline-none' + ' ' + className}
      value={shotId}
      onChange={onChange}>
      {sceneIds.map((sceneId) => (
        <SceneShotOptions
          key={sceneId}
          documentId={documentId}
          sceneId={sceneId}
        />
      ))}
    </select>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
function SceneShotOptions({ documentId, sceneId }) {
  const blockIds = useBlockIds(documentId, sceneId);
  const shotCount = useSceneShotCount(documentId, sceneId);
  if (shotCount <= 0) {
    return null;
  }
  return (
    <>
      {blockIds.map((blockId) => (
        <SceneShotByBlockOptions
          key={blockId}
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
        />
      ))}
    </>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.blockId
 */
function SceneShotByBlockOptions({ documentId, sceneId, blockId }) {
  const shotIds = useShotIds(documentId, blockId);
  return (
    <>
      {shotIds.map((shotId) => (
        <SceneShotOption
          key={shotId}
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
        />
      ))}
    </>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
function SceneShotOption({ documentId, sceneId, shotId }) {
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  return (
    <option value={shotId}>
      {formatSceneShotNumber(sceneNumber, shotNumber, true)}
    </option>
  );
}
