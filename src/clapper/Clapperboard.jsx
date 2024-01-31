// NOTE: https://www.studiobinder.com/blog/how-to-use-a-film-slate/
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@material-symbols/svg-400/rounded/arrow_back.svg';

import { useFullscreen } from '@/libs/fullscreen';
import {
  getDocumentIds,
  getFirstBlockIdInScene,
  getSceneIdsInOrder,
  getShotIdsInOrder,
} from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import {
  useCurrentCursor,
  useSetUserCursor,
  useUserStore,
} from '@/stores/user';

import ClapperCameraNameField from './ClapperCameraNameField';
import ClapperDateField from './ClapperDateField';
import ClapperDirectorNameField from './ClapperDirectorNameField';
import ClapperMoreFields from './ClapperMoreFields';
import ClapperProductionTitleField from './ClapperProductionTitleField';
import ClapperQRCodeField from './ClapperQRCodeField';
import ClapperTakeNameField from './ClapperTakeNameField';
import ClapperVerticalLabel from './ClapperVerticalLabel';

export default function Clapperboard() {
  const { documentId, sceneId, shotId, takeId } = useCurrentCursor();
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setUserCursor = useSetUserCursor();
  const setShotListMode = useUserStore((ctx) => ctx.setShotListMode);
  const navigate = useNavigate();
  const { exitFullscreen } = useFullscreen();

  useEffect(() => {
    const store = UNSAFE_getStore();
    let newDocumentId = documentId;
    let newSceneId = sceneId;
    let newShotId = shotId;
    if (!documentId) {
      newDocumentId = getDocumentIds(store)?.[0] || '';
    }
    if (newDocumentId && !sceneId) {
      newSceneId = getSceneIdsInOrder(store, newDocumentId)?.[0] || '';
    }
    if (newDocumentId && newSceneId && !shotId) {
      let blockId = getFirstBlockIdInScene(store, newDocumentId, newSceneId);
      newShotId = getShotIdsInOrder(store, newDocumentId, blockId)?.[0] || '';
    }
    if (
      newDocumentId !== documentId ||
      newSceneId !== sceneId ||
      newShotId !== shotId
    ) {
      setUserCursor(newDocumentId, newSceneId, newShotId, '');
    }
  }, [documentId, sceneId, shotId, UNSAFE_getStore, setUserCursor]);

  function onBackClick() {
    setShotListMode('detail');
    navigate('/edit');
    exitFullscreen();
  }

  return (
    <fieldset className="relative w-full h-full flex flex-col text-white text-[5vmin] font-mono overflow-hidden">
      <button
        className="absolute left-1 top-1 bg-black rounded"
        onClick={onBackClick}>
        <ArrowBackIcon className="w-6 h-6 fill-current" />
      </button>
      <div className="grid grid-cols-2 text-md">
        <ul>
          <ClapperTakeNameField
            className="border-r-4"
            documentId={documentId}
          />
          <li className="flex items-center">
            <ClapperVerticalLabel>PROD</ClapperVerticalLabel>
            <ClapperProductionTitleField
              className="mx-1 w-full uppercase bg-transparent h-[50%]"
              documentId={documentId}
            />
          </li>
          <li className="flex items-center">
            <ClapperVerticalLabel>DIR</ClapperVerticalLabel>
            <ClapperDirectorNameField
              className="mx-1 w-full uppercase bg-transparent h-[50%]"
              documentId={documentId}
            />
          </li>
          <li className="flex items-center">
            <ClapperVerticalLabel>CAM</ClapperVerticalLabel>
            <ClapperCameraNameField
              className="mx-1 w-full uppercase bg-transparent h-[50%]"
              documentId={documentId}
            />
          </li>
        </ul>

        <div className="overflow-hidden">
          <ClapperQRCodeField
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            takeId={takeId}
          />
        </div>

        <div className="col-span-2 flex flex-row">
          <div className="flex-1 flex items-center">
            <ClapperVerticalLabel>DATE</ClapperVerticalLabel>
            <ClapperDateField />
          </div>
          <div className="relative flex-1 flex items-center">
            <ClapperVerticalLabel>ETC</ClapperVerticalLabel>
            <ClapperMoreFields className="flex-1" documentId={documentId} />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-row">
        <textarea
          className="flex-1 resize-none p-2 bg-transparent"
          placeholder="Comments"
        />
      </div>
    </fieldset>
  );
}
