// NOTE: https://www.studiobinder.com/blog/how-to-use-a-film-slate/
import { useCallback, useEffect, useRef, useState } from 'react';

import QRCode from 'qrcode';

import GridStyle from '@/components/shots/GridStyle.module.css';
import { useInterval } from '@/libs/UseInterval';
import {
  useDefineTake,
  useTakeFileNameResolver,
  useTakeShotHashResolver,
} from '@/serdes/UseTakeExporter';
import {
  findBlockWithShotId,
  findSceneWithBlockId,
  getDocumentSettingsById,
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

import {
  formatSceneShotNumber,
  formatTakeNumber,
} from './takes/TakeNameFormat';

export default function Clapperboard() {
  const [dataString, setDataString] = useState('');
  const { documentId, sceneId, shotId, takeId } = useCurrentCursor();
  const projectId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );
  const dateString = useDateString();
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const resolveTakeFileName = useTakeFileNameResolver();
  const resolveTakeShotHash = useTakeShotHashResolver();
  const defineTake = useDefineTake();

  useEffect(() => {
    if (!documentId || !sceneId || !shotId) {
      return;
    }
    const store = UNSAFE_getStore();
    const takeShotHash = resolveTakeShotHash(store, documentId, shotId);
    const takeFileName = resolveTakeFileName(
      store,
      documentId,
      sceneId,
      shotId,
      takeId,
      takeShotHash,
      '',
    );
    let takeFileNameWithoutExt = takeFileName;
    const extIndex = takeFileName.lastIndexOf('.');
    if (extIndex >= 0) {
      takeFileNameWithoutExt = takeFileName.substring(0, extIndex);
    }
    const result = JSON.stringify({ key: takeFileNameWithoutExt });
    const base64 = btoa(result);
    setDataString('https://jsonhero.io/new?j=' + base64);
  }, [
    documentId,
    sceneId,
    shotId,
    takeId,
    UNSAFE_getStore,
    resolveTakeFileName,
    resolveTakeShotHash,
    setDataString,
  ]);

  function onNextTake() {
    if (!documentId || !sceneId || !shotId) {
      return;
    }
    defineTake(documentId, sceneId, shotId);
  }

  return (
    <fieldset className="grid grid-cols-4 w-full h-full border-white text-white text-md md:text-4xl px-4 font-mono">
      <div className="relative col-span-4 flex overflow-hidden">
        <label className="inline-block text-xs text-center upright-rl p-1 pl-0">
          PROD
        </label>
        <output className="m-auto">{projectId}</output>
      </div>
      <table className="relative table-fixed col-span-4 text-center border-y-4 border-white overflow-hidden">
        <thead>
          <tr>
            <th className="border-r-4 border-white scale-50 w-[33%]">ROLL</th>
            <th className="border-x-4 border-white scale-50 w-[33%]">SCENE</th>
            <th className="border-l-4 border-white scale-50 w-[33%]">TAKE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-r-4 border-white">A001</td>
            <td className="border-x-4 border-white">
              <SceneShotSelector documentId={documentId} shotId={shotId} />
            </td>
            <td className="border-l-4 border-white">
              <TakeSelector
                documentId={documentId}
                sceneId={sceneId}
                shotId={shotId}
                takeId={takeId}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="col-span-3">
        <button onClick={onNextTake} disabled={!shotId}>
          NEXT
        </button>
      </div>
      <div className="relative col-span-2 overflow-hidden flex flex-col">
        <div className="flex-1 flex items-center">
          <label className="text-xs text-left upright-rl p-1 pl-0">DIR</label>
          <div className="flex-1 px-2">
            <DirectorInput className="inline-block w-full uppercase bg-transparent" />
          </div>
        </div>
        <div className="flex-1 flex items-center">
          <label className="text-xs upright-rl p-1 pl-0">CAM</label>
          <div className="flex-1 px-2">
            <CameraInput className="inline-block w-full uppercase bg-transparent" />
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex-1 flex items-center">
          <label className="text-xs upright-rl p-1 pl-0">DATE</label>
          <output className="uppercase">{dateString}</output>
        </div>
        <div className="flex-1 flex items-center">
          <label className="text-xs upright-rl p-1 pl-0">ETC</label>
          <div className={GridStyle.grid + ' ' + 'flex-1'}>
            <ToggleSyncButton />
            <ToggleMOSButton />
          </div>
        </div>
      </div>
      <div className="relative col-span-2 row-span-2 flex flex-col overflow-hidden">
        <TakeQRCode data={dataString} />
        <span className="text-xs overflow-x-auto">{dataString}</span>
      </div>
    </fieldset>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 */
function TakeSelector({ className, documentId, sceneId, shotId, takeId }) {
  const setUserCursor = useSetUserCursor();

  const takeIds = useTakeIds(documentId, shotId);
  /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
  function onChange(e) {
    const target = /** @type {HTMLSelectElement} */ (e.target);
    const value = target.value;
    setUserCursor(documentId, sceneId, shotId, value);
  }
  return (
    <select
      className={'bg-transparent text-center' + ' ' + className}
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

function ToggleSyncButton() {
  const [state, setState] = useState(true);

  function onClick() {
    setState((prev) => !prev);
  }
  return (
    <button
      className={!state ? 'line-through opacity-30' : ''}
      onClick={onClick}>
      SYNC
    </button>
  );
}

function ToggleMOSButton() {
  const [state, setState] = useState(false);

  function onClick() {
    setState((prev) => !prev);
  }
  return (
    <button
      className={!state ? 'line-through opacity-30' : ''}
      onClick={onClick}>
      MOS
    </button>
  );
}

/**
 * @param {object} props
 * @param {string} props.className
 */
function DirectorInput({ className }) {
  const [state, setState] = useState('');
  /** @type {import('react').FormEventHandler<HTMLTextAreaElement>} */
  function onInput(e) {
    const target = /** @type {HTMLTextAreaElement} */ (e.target);
    const value = target.value;
    setState(value);
  }
  return (
    <textarea
      className={'resize-none' + ' ' + className}
      name="director-name"
      value={state}
      onInput={onInput}
      placeholder="Director's name"
    />
  );
}

/**
 * @param {object} props
 * @param {string} props.className
 */
function CameraInput({ className }) {
  const [state, setState] = useState('');
  /** @type {import('react').FormEventHandler<HTMLTextAreaElement>} */
  function onInput(e) {
    const target = /** @type {HTMLTextAreaElement} */ (e.target);
    const value = target.value;
    setState(value);
  }
  return (
    <textarea
      className={'resize-none' + ' ' + className}
      name="director-of-photography-name"
      value={state}
      onInput={onInput}
      placeholder="DP's name"
    />
  );
}

/**
 * @param {object} props
 * @param {string} props.data
 */
function TakeQRCode({ data }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    if (!data) {
      return;
    }
    QRCode.toCanvas(canvas, data, { errorCorrectionLevel: 'L' });
  }, [data]);
  return <canvas ref={canvasRef} className="block" />;
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
      className={'text-center bg-transparent' + ' ' + className}
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

  return dateString;
}
