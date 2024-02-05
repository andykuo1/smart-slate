import { useEffect } from 'react';

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
  useShotDescription,
  useShotType,
  useTakeRating,
} from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useSettingsStore } from '@/stores/settings';
import { useCurrentCursor, useSetUserCursor } from '@/stores/user';

import ClapperCameraNameField from './ClapperCameraNameField';
import ClapperDateField from './ClapperDateField';
import ClapperDirectorNameField from './ClapperDirectorNameField';
import ClapperProductionTitleField from './ClapperProductionTitleField';
import ClapperQRCodeField from './ClapperQRCodeField';
import ClapperVerticalLabel from './ClapperVerticalLabel';

export default function Clapperboard() {
  const { documentId, sceneId, shotId, takeId } = useCurrentCursor();
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setUserCursor = useSetUserCursor();
  const enableThumbnailWhileRecording = useSettingsStore(
    (ctx) => ctx.user.enableThumbnailWhileRecording,
  );

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

  return (
    <fieldset className="relative w-full h-full p-[2vmin] flex flex-col text-white text-[5vmin] font-mono overflow-hidden">
      <div className="flex-1 grid grid-cols-2 text-md">
        <ul className="flex flex-col">
          <li className="flex items-center">
            <ClapperIdentifierFields
              className="flex-1"
              documentId={documentId}
              sceneId={sceneId}
              shotId={shotId}
              takeId={takeId}
            />
          </li>
          <li className="flex items-center">
            <ClapperVerticalLabel>DATE</ClapperVerticalLabel>
            <ClapperDateField />
          </li>
          <li className="flex items-center">
            <ClapperVerticalLabel>PROD</ClapperVerticalLabel>
            <ClapperProductionTitleField
              className="mx-1 w-full bg-transparent h-[50%]"
              documentId={documentId}
            />
          </li>
          <ClapperDirectorNameEntry documentId={documentId} />
          <ClapperCameraNameEntry documentId={documentId} />
          <li className="flex-1 flex flex-col-reverse sm:flex-row gap-1">
            {enableThumbnailWhileRecording && (
              <ShotThumbnail
                className="text-base"
                documentId={documentId}
                sceneId={sceneId}
                shotId={shotId}
                editable={false}
                referenceOnly={true}
              />
            )}
            <ClapperCommentField documentId={documentId} shotId={shotId} />
          </li>
        </ul>

        <div className="flex flex-col">
          <div className="flex-1 overflow-hidden">
            <ClapperQRCodeField
              documentId={documentId}
              sceneId={sceneId}
              shotId={shotId}
              takeId={takeId}
            />
          </div>
          <ClapperControlFields
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            takeId={takeId}
          />
        </div>
      </div>
    </fieldset>
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
    <li className="flex items-center">
      <ClapperVerticalLabel>CAM</ClapperVerticalLabel>
      <ClapperCameraNameField
        className="mx-1 w-full bg-transparent h-[50%]"
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
    <li className="flex items-center">
      <ClapperVerticalLabel>DIR</ClapperVerticalLabel>
      <ClapperDirectorNameField
        className="mx-1 w-full bg-transparent h-[50%]"
        documentId={documentId}
      />
    </li>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
function ClapperCommentField({ documentId, shotId }) {
  const description = useShotDescription(documentId, shotId);
  const shotType = useShotType(documentId, shotId);
  const hasShotText = shotType && description;
  return (
    <textarea
      className="flex-1 resize-none p-1 bg-transparent"
      placeholder={
        !hasShotText
          ? 'Comments'
          : shotType + (description ? ` of ${description}` : '')
      }
    />
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
function ClapperControlFields({
  className,
  documentId,
  sceneId,
  shotId,
  takeId,
}) {
  const takeRating = useTakeRating(documentId, takeId);
  const toggleGoodTake = useDocumentStore((ctx) => ctx.toggleGoodTake);
  const setUserCursor = useSetUserCursor();

  function onNextClick() {
    setUserCursor(documentId, sceneId, shotId, '');
  }

  function onPrintClick() {
    toggleGoodTake(documentId, takeId);
  }

  return (
    <div className="w-full flex items-center">
      <ClapperVerticalLabel>CTRL</ClapperVerticalLabel>
      <div className="flex-1 flex flex-col items-start gap-2 p-2">
        <SettingsFieldButton
          className="w-full text-left"
          Icon={AddIcon}
          title="New take"
          onClick={onNextClick}
          disabled={!takeId}>
          <span className="ml-2">New take</span>
        </SettingsFieldButton>
        <SettingsFieldButton
          className={
            'w-[50%] text-left outline-none' +
            ' ' +
            (takeRating <= 0 ? 'line-through' : '')
          }
          Icon={takeRating > 0 ? ThumbUpFillIcon : ThumbUpIcon}
          title="Mark good take"
          onClick={onPrintClick}
          disabled={!takeId}>
          <span className="ml-2">PRINT</span>
        </SettingsFieldButton>
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
function ClapperIdentifierFields({
  className,
  documentId,
  sceneId,
  shotId,
  takeId,
}) {
  return (
    <fieldset
      className={
        'flex items-center border-2 rounded-xl m-1 overflow-hidden' +
        ' ' +
        className
      }>
      <div className="flex flex-col border-r-2 px-2">
        <ClapperSceneShotNumberField
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
        />
        <ClapperShotHashField documentId={documentId} shotId={shotId} />
      </div>
      <div className="flex flex-row px-1 mx-auto">
        <ClapperTakeNumberField
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          takeId={takeId}
        />
      </div>
    </fieldset>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 */
function ClapperTakeNumberField({ documentId, sceneId, shotId, takeId }) {
  const takeNumber = useTakeNumber(documentId, shotId, takeId);
  const takeOutputId = 'clapTakeNo-' + takeId;
  return (
    <div className="flex flex-col">
      <ClapperLabel htmlFor={takeOutputId} className="text-center">
        TAKE
      </ClapperLabel>
      <output
        id={takeOutputId}
        style={{ lineHeight: '1.5em' }}
        className="text-[10vw] scale-y-150 whitespace-nowrap">
        {formatTakeNumber(takeNumber, true).padStart(2, '0')}
      </output>
    </div>
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
          className="text-[10vw] whitespace-nowrap">
          {formatSceneNumber(sceneNumber, true).padStart(3, '0')}
        </output>
      </div>
      <div className="flex flex-col items-start">
        <ClapperLabel htmlFor={shotOutputId}>SHOT</ClapperLabel>
        <output
          id={shotOutputId}
          style={{ lineHeight: '1em' }}
          className="text-[10vw] whitespace-nowrap">
          {formatShotNumber(shotNumber)}
        </output>
      </div>
    </div>
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
    <output
      style={{ lineHeight: '1em' }}
      className="text-[5vw] text-right mx-1">
      #{shotHash}
    </output>
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
    <label className={'text-[2vw] px-1' + ' ' + className} htmlFor={htmlFor}>
      {children}
    </label>
  );
}
