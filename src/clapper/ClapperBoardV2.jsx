import { useCallback, useEffect, useState } from 'react';

import AddIcon from '@material-symbols/svg-400/rounded/add.svg';
import ThumbUpFillIcon from '@material-symbols/svg-400/rounded/thumb_up-fill.svg';
import ThumbUpIcon from '@material-symbols/svg-400/rounded/thumb_up.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import ShotThumbnail from '@/components/shots/ShotThumbnail';
import {
  formatSceneNumber,
  formatShotNumber,
  formatTakeNumber,
} from '@/components/takes/TakeNameFormat';
import { useInterval } from '@/libs/UseInterval';
import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import { useShotHash } from '@/serdes/UseResolveShotHash';
import { useShotNumber } from '@/serdes/UseResolveShotNumber';
import { useTakeNumber } from '@/serdes/UseResolveTakeNumber';
import {
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
import { useDocumentStore } from '@/stores/document/use';
import { useSettingsStore } from '@/stores/settings';
import {
  useCurrentCursor,
  useSetUserCursor,
  useUserStore,
} from '@/stores/user';

import ClapperCameraNameField from './ClapperCameraNameField';
import ClapperDirectorNameField from './ClapperDirectorNameField';
import ClapperInput from './ClapperInput';
import ClapperProductionTitleField from './ClapperProductionTitleField';
import ClapperQRCodeField from './ClapperQRCodeField';

export default function ClapperBoardV2() {
  const { documentId, sceneId, shotId, takeId } =
    useNiceDefaultCursorResolver();

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
        'w-full h-full text-[3vmin] flex flex-col gap-x-4 gap-y-0 p-[2em]' +
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
          className="w-full text-center text-[3em] mb-1 -mt-2 disabled:opacity-100 truncate"
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
          className="w-full px-2 my-2"
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
        />
        <div className="flex-1 hidden sm:flex portrait:hidden landscape:flex flex-col">
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
            className="flex-1 w-full"
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            takeId={takeId}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 min-h-[40vh]">
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
 */
function ClapperPrintButton({ className, documentId, takeId }) {
  const takeRating = useTakeRating(documentId, takeId);
  const toggleGoodTake = useDocumentStore((ctx) => ctx.toggleGoodTake);

  function onPrintClick() {
    toggleGoodTake(documentId, takeId);
  }

  return (
    <SettingsFieldButton
      className={
        'outline-none text-[2em] mt-auto flex pb-[0.5em] flex-col' +
        ' ' +
        className
      }
      Icon={takeRating > 0 ? ThumbUpFillIcon : ThumbUpIcon}
      title="Mark good take"
      onClick={onPrintClick}
      disabled={!takeId}>
      <span
        className={
          'absolute bottom-0 left-0 right-0 text-[0.5em] translate-y-[25%]' +
          ' ' +
          (takeRating <= 0 ? 'line-through' : '')
        }>
        PRINT
      </span>
    </SettingsFieldButton>
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
    <div className={'flex items-center' + ' ' + className}>
      <div className="flex-1" />
      <SettingsFieldButton
        className="flex-1 w-full text-left px-4 my-4"
        Icon={AddIcon}
        title="New take"
        onClick={onNextClick}
        disabled={!takeId}>
        <span className="ml-2 whitespace-nowrap">NEW TAKE</span>
      </SettingsFieldButton>
      <div className="flex-1" />
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
        'flex flex-row gap-4 px-4 mx-auto font-mono overflow-hidden border-2 rounded-xl' +
        ' ' +
        className
      }>
      <ClapperDateField />
      <ul className="flex-1 my-auto flex flex-col items-center">
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
    <div className="flex flex-col items-center m-auto">
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
    <div className="flex-1 flex flex-col items-center">
      <ClapperLabel className="text-[1em]">ROLL</ClapperLabel>
      <ClapperInput
        className="w-full text-center text-[2em] scale-y-150 translate-y-[25%]"
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
        className="flex-1 font-mono max-h-[72px] overflow-auto"
        hidden={!shotType && !description}>
        {shotType + (hasShotText ? ' of ' : '') + description}
      </p>
      {enableThumbnailWhileRecording && (
        <div className="flex flex-col items-end">
          <ShotThumbnail
            className="text-base rounded overflow-hidden"
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
        className="w-full text-[1.5em] font-mono resize-none bg-transparent p-2 my-1 rounded-xl placeholder:opacity-30"
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
  const toggleDrawer = useUserStore((ctx) => ctx.toggleDrawer);
  function onClick() {
    toggleDrawer();
  }
  return (
    <fieldset
      className={
        'flex flex-row gap-4 mx-auto text-[1em] font-mono overflow-hidden' +
        ' ' +
        className
      }
      onClick={onClick}>
      <div className="flex-1 flex flex-col items-center px-2 border-2 rounded-xl">
        <div className="flex flex-col items-end">
          <ClapperSceneShotNumberField
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
          />
          <ClapperShotHashField documentId={documentId} shotId={shotId} />
        </div>
      </div>
      <ClapperTakeNumberField
        className="flex-1 px-2 border-2 rounded-xl"
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
          className="text-[3em] whitespace-nowrap">
          {formatSceneNumber(sceneNumber, true).padStart(3, '0')}
        </output>
      </div>
      <div className="flex flex-col items-center">
        <ClapperLabel htmlFor={shotOutputId}>SHOT</ClapperLabel>
        <output
          id={shotOutputId}
          style={{ lineHeight: '1em' }}
          className="text-[3em] whitespace-nowrap">
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
  return (
    <div className={'flex flex-col items-center' + ' ' + className}>
      <ClapperLabel htmlFor={takeOutputId}>TAKE</ClapperLabel>
      <output
        id={takeOutputId}
        style={{ lineHeight: '1em' }}
        className="text-[3em] pb-[0.5em] scale-y-150 translate-y-[25%] whitespace-nowrap">
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
    <li className="flex gap-1 items-center">
      <ClapperLabel className="text-right text-[0.5em] self-end">
        DP
      </ClapperLabel>
      <ClapperCameraNameField
        className="flex-1 text-left truncate"
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
    <li className="flex gap-1 items-center">
      <ClapperLabel className="text-right text-[0.5em] self-end">
        DIR
      </ClapperLabel>
      <ClapperDirectorNameField
        className="flex-1 text-left truncate"
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
