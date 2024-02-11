import { useEffect } from 'react';

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
    <fieldset className="relative flex h-full w-full flex-col overflow-hidden p-[2vmin] font-mono text-[5vmin] text-white">
      <div className="text-md grid flex-1 grid-cols-2">
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
              className="mx-1 h-[50%] w-full bg-transparent"
              documentId={documentId}
            />
          </li>
          <ClapperDirectorNameEntry documentId={documentId} />
          <ClapperCameraNameEntry documentId={documentId} />
          <li className="sm:flex-row flex flex-1 flex-col-reverse gap-1">
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
        className="mx-1 h-[50%] w-full bg-transparent"
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
        className="mx-1 h-[50%] w-full bg-transparent"
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
      className="flex-1 resize-none bg-transparent p-1"
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
    <div className="flex w-full items-center">
      <ClapperVerticalLabel>CTRL</ClapperVerticalLabel>
      <div className="flex flex-1 flex-col items-start gap-2 p-2">
        <FieldButton
          className="w-full text-left"
          Icon={AddIcon}
          title="New take"
          onClick={onNextClick}
          disabled={!takeId}>
          <span className="ml-2">New take</span>
        </FieldButton>
        <FieldButton
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
        </FieldButton>
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
        'm-1 flex items-center overflow-hidden rounded-xl border-2' +
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
      <div className="mx-auto flex flex-row px-1">
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
        className="scale-y-150 whitespace-nowrap text-[10vw]">
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
          className="whitespace-nowrap text-[10vw]">
          {formatSceneNumber(sceneNumber, true).padStart(3, '0')}
        </output>
      </div>
      <div className="flex flex-col items-start">
        <ClapperLabel htmlFor={shotOutputId}>SHOT</ClapperLabel>
        <output
          id={shotOutputId}
          style={{ lineHeight: '1em' }}
          className="whitespace-nowrap text-[10vw]">
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
      className="mx-1 text-right text-[5vw]">
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
    <label className={'px-1 text-[2vw]' + ' ' + className} htmlFor={htmlFor}>
      {children}
    </label>
  );
}
