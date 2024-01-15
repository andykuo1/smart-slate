// NOTE: https://www.studiobinder.com/blog/how-to-use-a-film-slate/
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@material-symbols/svg-400/rounded/add.svg';
import ArrowBackIcon from '@material-symbols/svg-400/rounded/arrow_back.svg';

import { useInterval } from '@/libs/UseInterval';
import { useDefineTake } from '@/serdes/UseTakeExporter';
import {
  findBlockWithShotId,
  findSceneWithBlockId,
  useBlockIds,
  useDocumentStore,
  useSceneIds,
  useSceneNumber,
  useSceneShotCount,
  useShotIds,
  useShotNumber,
  useTakeIds,
} from '@/stores/document';
import { useCurrentCursor, useSetUserCursor } from '@/stores/user';
import { formatYearMonthDay } from '@/utils/StringFormat';

import ClapperCameraNameField from './clapper/ClapperCameraNameField';
import ClapperDirectorNameField from './clapper/ClapperDirectorNameField';
import ClapperMoreFields from './clapper/ClapperMoreFields';
import ClapperProductionTitleField from './clapper/ClapperProductionTitleField';
import ClapperQRCodeField from './clapper/ClapperQRCodeField';
import {
  formatSceneShotNumber,
  formatTakeNumber,
} from './takes/TakeNameFormat';

export default function ClapperboardV2() {
  const { documentId, sceneId, shotId, takeId } = useCurrentCursor();
  const setUserCursor = useSetUserCursor();
  const dateString = useDateString();
  const navigate = useNavigate();
  const defineTake = useDefineTake();

  function onBackClick() {
    navigate('/edit');
  }

  function onAddClick() {
    if (!documentId || !sceneId || !shotId) {
      return;
    }
    defineTake(documentId, sceneId, shotId);
    setUserCursor(documentId, sceneId, shotId, '');
  }

  return (
    <fieldset className="relative w-full h-full flex flex-col text-white text-[5vmin] font-mono overflow-hidden">
      <button
        className="absolute left-1 top-1 bg-black rounded"
        onClick={onBackClick}>
        <ArrowBackIcon className="w-6 h-6 fill-current" />
      </button>
      <button
        className="absolute right-1 top-1 bg-black rounded"
        onClick={onAddClick}>
        <AddIcon className="w-6 h-6 fill-current" />
      </button>

      <table className="table-fixed text-center border-y-4 border-white overflow-hidden text-[20vmin]">
        <thead>
          <tr>
            <th className="border-r-4 border-white w-[33%] text-xs">ROLL</th>
            <th className="border-x-4 border-white w-[33%] text-xs">SCENE</th>
            <th className="border-l-4 border-white w-[33%] text-xs">TAKE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-r-4 border-white">A001</td>
            <td className="border-x-4 border-white">
              <SceneShotSelector documentId={documentId} shotId={shotId} />
            </td>
            <td className="relative border-l-4 border-white">
              <TakeSelector />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="grid grid-cols-2">
        <ul>
          <li className="flex items-center">
            <VerticalLabel title="PROD" />
            <ClapperProductionTitleField
              className="mx-1 w-full uppercase bg-transparent h-[50%]"
              documentId={documentId}
            />
          </li>
          <li className="flex items-center">
            <VerticalLabel title="DIR" />
            <ClapperDirectorNameField
              className="mx-1 w-full uppercase bg-transparent h-[50%]"
              documentId={documentId}
            />
          </li>
          <li className="flex items-center">
            <VerticalLabel title="CAM" />
            <ClapperCameraNameField
              className="mx-1 w-full uppercase bg-transparent h-[50%]"
              documentId={documentId}
            />
          </li>
        </ul>

        <div className="sticky bottom-0 right-0 overflow-hidden">
          <ClapperQRCodeField
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            takeId={takeId}
          />
        </div>

        <div className="col-span-2 flex flex-row">
          <div className="flex-1 flex items-center">
            <VerticalLabel title="DATE" />
            <output className="uppercase">{dateString}</output>
          </div>
          <div className="flex-1 flex items-center">
            <VerticalLabel title="ETC" />
            <ClapperMoreFields className="flex-1" documentId={documentId} />
          </div>
        </div>
      </div>
    </fieldset>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} [props.title]
 * @param {import('react').ReactNode} [props.children]
 */
function VerticalLabel({ className, title = '', children }) {
  return (
    <label
      className={'text-[2vmin] upright-rl py-1 text-center' + ' ' + className}>
      {title}
      {children}
    </label>
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

  return (
    <select
      className={'w-full bg-transparent text-center' + ' ' + className}
      value={takeId}
      onChange={onChange}>
      <optgroup label="New">
        <option value="">{takeIds.length + 1}</option>
      </optgroup>
      <optgroup label="Old">
        {takeIds.map((takeId, index) => (
          <option value={takeId}>{formatTakeNumber(index + 1, true)}</option>
        ))}
      </optgroup>
    </select>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
function SceneShotSelector({ className, documentId, shotId }) {
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
    setUserCursor(documentId, scene.sceneId, value);
  }
  return (
    <select
      className={'w-full text-center bg-transparent' + ' ' + className}
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
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const blockIds = useBlockIds(documentId, sceneId);
  const shotCount = useSceneShotCount(documentId, sceneId);
  if (shotCount <= 0) {
    return null;
  }
  return (
    <optgroup label={'Scene ' + sceneNumber}>
      {blockIds.map((blockId) => (
        <SceneShotByBlockOptions
          key={blockId}
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
        />
      ))}
    </optgroup>
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

function useDateString() {
  const [dateString, setDateString] = useState('----.--.--');

  const onInterval = useCallback(
    function _onInterval() {
      setDateString(formatYearMonthDay(new Date()));
    },
    [setDateString],
  );
  useInterval(onInterval, 1_000);
  // NOTE: Run once at the start.
  useEffect(onInterval, [onInterval]);

  return dateString;
}
