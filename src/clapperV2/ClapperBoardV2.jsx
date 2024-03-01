import {
  Select,
  SelectItem,
  SelectPopover,
  SelectProvider,
} from '@ariakit/react';
import { useCallback, useEffect, useState } from 'react';

import AddIcon from '@material-symbols/svg-400/rounded/add.svg';
import ThumbUpFillIcon from '@material-symbols/svg-400/rounded/thumb_up-fill.svg';
import ThumbUpIcon from '@material-symbols/svg-400/rounded/thumb_up.svg';

import ShotThumbnail from '@/components/shots/ShotThumbnail';
import {
  formatSceneNumber,
  formatShotNumber,
  formatTakeNumber,
} from '@/components/takes/TakeNameFormat';
import FieldButton from '@/fields/FieldButton';
import { useInterval } from '@/libs/UseInterval';
import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import { useSceneShotNumber } from '@/serdes/UseResolveSceneShotNumber';
import { useShotHash } from '@/serdes/UseResolveShotHash';
import { useShotNumber } from '@/serdes/UseResolveShotNumber';
import { useTakeNumber } from '@/serdes/UseResolveTakeNumber';
import {
  findSceneWithShotId,
  findShotWithTakeId,
  getDocumentIds,
  getDocumentSettingsById,
  getFirstEmptyShotInDocument,
  getFirstEmptyShotInScene,
  getTakeExportDetailsById,
  useShotDescription,
  useShotType,
  useTakeRating,
} from '@/stores/document';
import {
  useDocumentStore,
  useSceneIdsInDocumentOrder,
  useShotIdsInSceneOrder,
} from '@/stores/document/use';
import { useSettingsStore } from '@/stores/settings';
import {
  useCurrentCursor,
  useCurrentSceneId,
  useSetUserCursor,
  useUserStore,
} from '@/stores/user';
import SelectStyle from '@/styles/Select.module.css';

import ClapperCameraNameField from '../clapper/ClapperCameraNameField';
import ClapperDirectorNameField from '../clapper/ClapperDirectorNameField';
import ClapperInput from '../clapper/ClapperInput';
import ClapperProductionTitleField from '../clapper/ClapperProductionTitleField';
import ClapperQRCodeField from '../clapper/ClapperQRCodeField';

export default function ClapperBoardV2() {
  const { documentId, sceneId, shotId, takeId } =
    useNiceDefaultCursorResolver();
  const preferDarkSlate = useSettingsStore((ctx) => ctx.user.preferDarkSlate);

  const [state, setState] = useState('');
  const rollName = useDocumentStore(
    (ctx) => getTakeExportDetailsById(ctx, documentId, takeId)?.rollName,
  );
  const setRollName = useDocumentStore(
    (ctx) => ctx.setTakeExportDetailRollName,
  );
  const onRollNameChange = useCallback(
    /**
     * @param {string} value
     */
    function _onRollNameChange(value) {
      if (takeId) {
        setRollName(documentId, takeId, value);
      } else {
        setState(value);
      }
    },
    [documentId, takeId, setRollName, setState],
  );

  function onNewTake() {
    // TODO: Would be nice to just keep the name of LAST seen (not just new take?)
    if (!state && rollName) {
      setState(rollName);
    }
  }

  const portraitStyle = 'portrait:flex portrait:flex-col';
  const landscapeStyle =
    'landscape:grid landscape:grid-cols-2 landscape:grid-rows-1';
  const smallestStyle = 'flex flex-col';
  const smallStyle = 'sm:grid sm:grid-cols-2 sm:grid-rows-1';

  return (
    <div
      className={
        'flex h-full w-full flex-col gap-x-4 gap-y-0 p-[2em] text-[3vmin]' +
        ' ' +
        smallestStyle +
        ' ' +
        smallStyle +
        ' ' +
        landscapeStyle +
        ' ' +
        portraitStyle
      }>
      <div className="flex flex-col">
        <ClapperProductionTitleField
          className="-mt-2 mb-1 w-full truncate text-center text-[3em] disabled:opacity-100"
          documentId={documentId}
        />
        <ClapperIdentifierFields
          className="w-full"
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          takeId={takeId}
        />
        <ClapperShotDescriptionField
          className="my-2 w-full px-2"
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
        />
        <div className="hidden flex-1 flex-col sm:flex portrait:hidden landscape:flex">
          <ClapperAdditionalFields
            className="w-full"
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            takeId={takeId}
            rollName={takeId ? rollName || '' : state}
            onRollNameChange={onRollNameChange}
          />
          <ClapperCommentField
            className="w-full flex-1 short:hidden"
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            takeId={takeId}
          />
        </div>
      </div>
      <div
        className={
          'flex flex-1 flex-row gap-4' +
          ' ' +
          'sm:flex-row portrait:flex-col landscape:flex-row'
        }>
        <div
          className={
            'min-h-[40vh] flex-1 overflow-hidden rounded-xl' +
            ' ' +
            (preferDarkSlate ? 'bg-black text-white' : 'bg-white text-black')
          }>
          <ClapperQRCodeField
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            takeId={takeId}
            onChange={(newTakeId) => {
              setRollName(documentId, newTakeId, state);
              setState('');
            }}
          />
        </div>
        <ClapperControlFields
          className="rounded-xl font-bold"
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          takeId={takeId}
          onNewTake={onNewTake}
        />
      </div>
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 * @param {() => void} props.onNewTake
 */
function ClapperControlFields({
  className,
  documentId,
  sceneId,
  shotId,
  takeId,
  onNewTake,
}) {
  const setUserCursor = useSetUserCursor();

  function onNextClick() {
    setUserCursor(documentId, sceneId, shotId, '');
    onNewTake();
  }

  return (
    <FieldButton
      className={'flex items-center gap-2 landscape:flex-col' + ' ' + className}
      Icon={AddIcon}
      title="New take"
      onClick={onNextClick}
      disabled={!takeId}>
      <div className="whitespace-nowrap landscape:vertical-rl">NEW TAKE</div>
    </FieldButton>
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
function ClapperPrintButton({ className, documentId, takeId }) {
  const takeRating = useTakeRating(documentId, takeId);
  const toggleGoodTake = useDocumentStore((ctx) => ctx.toggleGoodTake);

  function onPrintClick() {
    toggleGoodTake(documentId, takeId);
  }

  return (
    <FieldButton
      className={
        'relative mt-auto flex flex-col pb-[0.5em] text-[2em] outline-none' +
        ' ' +
        className
      }
      Icon={takeRating > 0 ? ThumbUpFillIcon : ThumbUpIcon}
      title="Mark good take"
      onClick={onPrintClick}
      disabled={!takeId}>
      <span
        className={
          'absolute bottom-0 left-0 right-0 translate-y-[25%] text-[0.5em]' +
          ' ' +
          (takeRating <= 0 ? 'line-through' : '')
        }>
        PRINT
      </span>
    </FieldButton>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 * @param {string} props.rollName
 * @param {(value: string) => void} props.onRollNameChange
 */
function ClapperAdditionalFields({
  className,
  documentId,
  rollName,
  onRollNameChange,
}) {
  const hasAdditionalFields = useDocumentStore((ctx) => {
    const settings = getDocumentSettingsById(ctx, documentId);
    return settings?.directorName || settings?.cameraName;
  });
  return (
    <fieldset
      className={
        'mx-auto flex flex-row gap-4 overflow-hidden rounded-xl border-2 px-4 font-mono' +
        ' ' +
        className
      }>
      <ClapperDateField />
      <ul className="my-auto flex flex-1 flex-col items-center">
        {!hasAdditionalFields && <div>...</div>}
        <ClapperDirectorNameEntry documentId={documentId} />
        <ClapperCameraNameEntry documentId={documentId} />
      </ul>
      <ClapperRollField value={rollName} onChange={onRollNameChange} />
    </fieldset>
  );
}

function ClapperDateField() {
  const { year, month, day } = useRealTimeDate();
  return (
    <div className="m-auto flex flex-col items-center">
      <div className="flex flex-row gap-1 text-[1.5em]">
        <span>{getMonthString(month)}</span>
        <span>{String(day).padStart(2, '0')}</span>
      </div>
      <div className="text-[2em]">{year}</div>
    </div>
  );
}

/**
 * @param {number} month
 */
function getMonthString(month) {
  switch (month) {
    case 0:
      return 'JAN';
    case 1:
      return 'FEB';
    case 2:
      return 'MAR';
    case 3:
      return 'APR';
    case 4:
      return 'MAY';
    case 5:
      return 'JUN';
    case 6:
      return 'JUL';
    case 7:
      return 'AUG';
    case 8:
      return 'SEP';
    case 9:
      return 'OCT';
    case 10:
      return 'NOV';
    case 11:
      return 'DEC';
    default:
      return '---';
  }
}

function useRealTimeDate() {
  const [date, setDate] = useState({ year: 0, month: 0, day: 0 });

  const onInterval = useCallback(
    function _onInterval() {
      let now = new Date();
      setDate({
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate(),
      });
    },
    [setDate],
  );
  useInterval(onInterval, 1_000);
  // NOTE: Run once at the start.
  useEffect(onInterval, [onInterval]);
  return date;
}

/**
 * @param {object} props
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 */
function ClapperRollField({ value, onChange }) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <ClapperLabel className="text-[1em]">ROLL</ClapperLabel>
      <ClapperInput
        className="w-full translate-y-[25%] scale-y-150 rounded-xl bg-gray-900 text-center text-[2em]"
        name="camera-roll"
        value={value}
        onChange={(e) => {
          const value = /** @type {HTMLInputElement} */ (
            e.target
          ).value.toUpperCase();
          onChange(value);
        }}
        onFocus={(e) => e.target.select()}
        autoCapitalize="characters"
      />
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.className
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
function ClapperShotDescriptionField({
  className,
  documentId,
  sceneId,
  shotId,
}) {
  const description = useShotDescription(documentId, shotId);
  const shotType = useShotType(documentId, shotId);
  const enableThumbnailWhileRecording = useSettingsStore(
    (ctx) => ctx.user.enableThumbnailWhileRecording,
  );
  const hasShotText = shotType && description;
  return (
    <div className={'flex flex-row gap-2' + ' ' + className}>
      <p
        className="max-h-[72px] flex-1 overflow-auto font-mono"
        hidden={!shotType && !description}>
        {shotType + (hasShotText ? ' of ' : '') + description}
      </p>
      {enableThumbnailWhileRecording && (
        <div className="flex flex-col items-end">
          <ShotThumbnail
            className="overflow-hidden rounded text-base"
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            editable={false}
            referenceOnly={true}
          />
        </div>
      )}
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.className
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 */
function ClapperCommentField({
  className,
  documentId,
  sceneId,
  shotId,
  takeId,
}) {
  const [comments, setComments] = useState('');
  return (
    <div className={'flex flex-row gap-1' + ' ' + className}>
      <textarea
        style={{ lineHeight: '1em' }}
        className="my-1 w-full resize-none rounded-xl bg-transparent p-2 font-mono text-[1.5em] placeholder:opacity-30"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Comments"
      />
      <ClapperPrintButton
        documentId={documentId}
        sceneId={sceneId}
        shotId={shotId}
        takeId={takeId}
      />
    </div>
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
function ClapperIdentifierFields({
  className,
  documentId,
  sceneId,
  shotId,
  takeId,
}) {
  const setUserCursor = useSetUserCursor();
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);

  /**
   * @param {import('@/stores/document/DocumentStore').ShotId} value
   */
  function setValue(value) {
    let store = UNSAFE_getStore();
    let scene = findSceneWithShotId(store, documentId, value);
    if (!scene) {
      return;
    }
    setUserCursor(documentId, scene.sceneId, value, '');
  }

  return (
    <fieldset
      className={
        'mx-auto flex flex-row gap-4 overflow-hidden font-mono text-[1em]' +
        ' ' +
        className
      }>
      <div className="flex flex-1 flex-col items-center rounded-xl border-2 px-2">
        <SelectProvider value={shotId} setValue={setValue}>
          <Select className="flex flex-col items-end">
            <ClapperSceneShotNumberField
              documentId={documentId}
              sceneId={sceneId}
              shotId={shotId}
            />
            <ClapperShotHashField documentId={documentId} shotId={shotId} />
          </Select>
          <SelectPopover
            className={
              '-mt-[4em] ml-[1em] text-[2em]' + ' ' + SelectStyle.popover
            }>
            <SceneShotListItems documentId={documentId} />
          </SelectPopover>
        </SelectProvider>
      </div>
      <ClapperTakeNumberField
        className="flex-1 rounded-xl border-2 px-2"
        documentId={documentId}
        shotId={shotId}
        takeId={takeId}
      />
    </fieldset>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
function SceneShotListItems({ documentId }) {
  const sceneIds = useSceneIdsInDocumentOrder(documentId);
  return sceneIds.map((sceneId) => (
    <SceneShotListItemsInnerScene
      key={sceneId}
      documentId={documentId}
      sceneId={sceneId}
    />
  ));
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
function SceneShotListItemsInnerScene({ documentId, sceneId }) {
  const shotIds = useShotIdsInSceneOrder(documentId, sceneId);
  const currentSceneId = useCurrentSceneId();
  if (shotIds.length <= 0) {
    return null;
  }
  return (
    <div
      className={
        'my-2 rounded' + ' ' + (currentSceneId === sceneId && 'bg-blue-100')
      }>
      {shotIds.map((shotId) => (
        <SceneShotListItemsInnerSceneShot
          key={shotId}
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
        />
      ))}
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
function SceneShotListItemsInnerSceneShot({ documentId, sceneId, shotId }) {
  const sceneShotNumber = useSceneShotNumber(documentId, sceneId, shotId);
  const { shotId: currentShotId } = useCurrentCursor();
  return (
    <SelectItem
      className={
        (shotId === currentShotId && 'bg-blue-300') +
        ' ' +
        SelectStyle.selectItem
      }
      value={shotId}>
      {sceneShotNumber}
    </SelectItem>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
function ClapperShotHashField({ documentId, shotId }) {
  let shotHash = useShotHash(documentId, shotId);
  return (
    <output style={{ lineHeight: '1em' }} className="text-[1.5em]">
      #{shotHash}
    </output>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
function ClapperSceneShotNumberField({ documentId, sceneId, shotId }) {
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);

  const sceneOutputId = 'clapSceneNo-' + sceneId;
  const shotOutputId = 'clapShotNo-' + shotId;

  return (
    <div className="flex flex-row gap-1">
      <div className="flex flex-col items-end">
        <ClapperLabel htmlFor={sceneOutputId}>SCENE</ClapperLabel>
        <output
          id={sceneOutputId}
          style={{ lineHeight: '1em' }}
          className="whitespace-nowrap text-[3em]">
          {formatSceneNumber(sceneNumber, true).padStart(3, '0')}
        </output>
      </div>
      <div className="flex flex-col items-center">
        <ClapperLabel htmlFor={shotOutputId}>SHOT</ClapperLabel>
        <output
          id={shotOutputId}
          style={{ lineHeight: '1em' }}
          className="whitespace-nowrap text-[3em]">
          {shotNumber <= 0 ? '-' : formatShotNumber(shotNumber)}
        </output>
      </div>
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.className
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 */
function ClapperTakeNumberField({ className, documentId, shotId, takeId }) {
  const takeNumber = useTakeNumber(documentId, shotId, takeId);
  const takeOutputId = 'clapTakeNo-' + takeId;
  const toggleDrawer = useUserStore((ctx) => ctx.toggleDrawer);

  function onClick() {
    toggleDrawer(true);
  }
  return (
    <div
      className={'flex flex-col items-center' + ' ' + className}
      onClick={onClick}>
      <ClapperLabel htmlFor={takeOutputId}>TAKE</ClapperLabel>
      <output
        id={takeOutputId}
        style={{ lineHeight: '1em' }}
        className="translate-y-[25%] scale-y-150 whitespace-nowrap pb-[0.5em] text-[3em]">
        {formatTakeNumber(takeNumber, true)}
      </output>
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} [props.htmlFor]
 * @param {import('react').ReactNode} [props.children]
 */
function ClapperLabel({ className, htmlFor, children }) {
  return (
    <label className={'text-[1em]' + ' ' + className} htmlFor={htmlFor}>
      {children}
    </label>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
function ClapperCameraNameEntry({ documentId }) {
  const cameraName = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.cameraName,
  );
  if (!cameraName) {
    return null;
  }
  return (
    <li className="flex items-center gap-1">
      <ClapperLabel className="self-end text-right text-[0.5em]">
        DP
      </ClapperLabel>
      <ClapperCameraNameField
        className="flex-1 truncate text-left"
        documentId={documentId}
      />
    </li>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
function ClapperDirectorNameEntry({ documentId }) {
  const directorName = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.directorName,
  );
  if (!directorName) {
    return null;
  }
  return (
    <li className="flex items-center gap-1">
      <ClapperLabel className="self-end text-right text-[0.5em]">
        DIR
      </ClapperLabel>
      <ClapperDirectorNameField
        className="flex-1 truncate text-left"
        documentId={documentId}
      />
    </li>
  );
}

function useNiceDefaultCursorResolver() {
  const { documentId, sceneId, shotId, takeId } = useCurrentCursor();
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setUserCursor = useSetUserCursor();

  useEffect(() => {
    const store = UNSAFE_getStore();
    let newDocumentId = documentId;
    let newSceneId = sceneId;
    let newShotId = shotId;
    let newTakeId = takeId;
    if (!documentId) {
      newDocumentId = getDocumentIds(store)?.[0] || '';
    }
    if (newDocumentId && !sceneId) {
      const { sceneId, shotId } = getFirstEmptyShotInDocument(
        store,
        newDocumentId,
      );
      newSceneId = sceneId;
      newShotId = shotId;
      newTakeId = '';
    }
    if (newDocumentId && newSceneId && !shotId) {
      if (takeId) {
        // Take exists, just find the parent shot.
        let shot = findShotWithTakeId(store, documentId, takeId);
        newShotId = shot?.shotId || '';
      } else {
        // Take doesn't exist, so let's find a new shot that will take one.
        const { shotId } = getFirstEmptyShotInScene(
          store,
          newDocumentId,
          newSceneId,
        );
        newShotId = shotId;
        newTakeId = '';
      }
    }
    if (
      newDocumentId !== documentId ||
      newSceneId !== sceneId ||
      newShotId !== shotId ||
      newTakeId !== takeId
    ) {
      setUserCursor(newDocumentId, newSceneId, newShotId, newTakeId);
    }
  }, [documentId, sceneId, shotId, takeId, UNSAFE_getStore, setUserCursor]);

  return {
    documentId,
    sceneId,
    shotId,
    takeId,
  };
}