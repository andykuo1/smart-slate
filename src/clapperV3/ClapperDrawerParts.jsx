import { useNavigate } from 'react-router-dom';

import CheckBoxFillIcon from '@material-symbols/svg-400/rounded/check_box-fill.svg';
import CheckBoxIcon from '@material-symbols/svg-400/rounded/check_box.svg';
import CheckBoxOutlineBlankIcon from '@material-symbols/svg-400/rounded/check_box_outline_blank.svg';
import DeleteIcon from '@material-symbols/svg-400/rounded/delete.svg';
import DownloadIcon from '@material-symbols/svg-400/rounded/download.svg';
import HomeIcon from '@material-symbols/svg-400/rounded/home.svg';

import {
  formatProjectId,
  formatSceneShotNumber,
} from '@/components/takes/TakeNameFormat';
import FieldButton from '@/fields/FieldButton';
import FieldGroupDiscloseable from '@/fields/FieldGroupDiscloseable';
import FieldInput from '@/fields/FieldInput';
import FieldSelect from '@/fields/FieldSelect';
import FieldToggle from '@/fields/FieldToggle';
import { toDateString } from '@/serdes/ExportNameFormat';
import {
  findClapBySceneShotTakeNumber,
  getClapById,
  getClapperById,
  getClapperDetailsById,
  getSlateById,
  useClapperDispatch,
  useClapperIds,
  useClapperProductionTitle,
  useClapperStore,
  useSlateIdsInClapperOrder,
  useUNSAFE_getClapperStore,
} from '@/stores/clapper';
import { createClapper } from '@/stores/clapper/Store';
import {
  useClapperCursorClapperId,
  useClapperCursorDispatch,
} from '@/stores/clapper/cursor';
import {
  useClapperSettingsBlackboard,
  useClapperSettingsDispatch,
  useClapperSettingsStore,
} from '@/stores/clapper/settings';
import { downloadText } from '@/utils/Downloader';

export default function ClapperDrawerParts() {
  const navigate = useNavigate();
  const focusClapper = useClapperCursorDispatch((ctx) => ctx.focusClapper);

  function onHomeClick() {
    navigate('/');
    focusClapper('');
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <FieldButton className="mr-auto" Icon={HomeIcon} onClick={onHomeClick} />
      <ClapperSelector />
      <hr />
      <ClapperProjectIdInput />
      <ShotHashList />
      <FieldGroupDiscloseable title="Other Stuff">
        <ClapperSettingsBlackboardToggle />
      </FieldGroupDiscloseable>
      <FieldGroupDiscloseable title="Data Stuff">
        <ClapperExportCSVButton />
      </FieldGroupDiscloseable>
      <FieldGroupDiscloseable title="Crew Stuff">
        <ClapperSettingsCrewNamesToggle />
        <ClapperDirectorNameInput />
        <ClapperCameraNameInput />
      </FieldGroupDiscloseable>
      <FieldGroupDiscloseable title="Dangerous Stuff">
        <ClapperDeleteButton />
      </FieldGroupDiscloseable>
    </div>
  );
}

function ClapperExportCSVButton() {
  const clapperId = useClapperCursorClapperId();
  const UNSAFE_getClapperStore = useUNSAFE_getClapperStore();

  function onClick() {
    const store = UNSAFE_getClapperStore();
    const clapper = getClapperById(store, clapperId);
    const slateIds = Object.keys(clapper.slates);
    /** @type {Array<string>} */
    let lines = [];
    lines.push(
      ['SCENE', 'TAKE', 'ROLL', 'PRINT', 'DATE', 'TAKEID', 'COMMENTS'].join(
        ',',
      ),
    );
    for (let slateId of slateIds) {
      const slate = getSlateById(store, clapperId, slateId);
      const sceneShotNumber = formatSceneShotNumber(
        slate.sceneNumber,
        slate.shotNumber,
        true,
      );
      for (let clapId of slate.clapIds) {
        const clap = getClapById(store, clapperId, clapId);
        const date = new Date(clap.timestampMillis);
        lines.push(
          [
            sceneShotNumber,
            clap.takeNumber,
            clap.rollName,
            clap.printRating > 0 ? 'PRINT' : '',
            date.toLocaleString().replace(/\,/g, ''),
            clap.takeId,
            clap.comments,
          ].join(','),
        );
      }
    }
    let result = lines.join('\n');
    let dateString = toDateString(new Date());
    let productionTitle = clapper?.details?.productionTitle || 'MYMOVIE';
    let projectId = formatProjectId(productionTitle);
    let fileName = [projectId, dateString, 'CLAPS.csv'].join('_');
    downloadText(fileName, result);
  }

  return (
    <FieldButton Icon={DownloadIcon} title="Export to .csv" onClick={onClick}>
      Export to .csv
    </FieldButton>
  );
}

function ClapperDirectorNameInput() {
  const clapperId = useClapperCursorClapperId();
  const directorName = useClapperStore(
    (ctx) => getClapperDetailsById(ctx, clapperId)?.directorName,
  );
  const changeDirectorName = useClapperDispatch(
    (ctx) => ctx.changeDirectorName,
  );
  return (
    <FieldInput
      id="clapperDirectorName"
      title="Director Name"
      className="flex flex-col uppercase"
      value={directorName}
      placeholder="BILL PRESTON ESQ."
      onChange={(e) =>
        changeDirectorName(clapperId, e.target.value.toUpperCase())
      }
      autoCapitalize="characters"
    />
  );
}

function ClapperCameraNameInput() {
  const clapperId = useClapperCursorClapperId();
  const cameraName = useClapperStore(
    (ctx) => getClapperDetailsById(ctx, clapperId)?.cameraName,
  );
  const changeCameraName = useClapperDispatch((ctx) => ctx.changeCameraName);
  return (
    <FieldInput
      id="clapperCameraName"
      title="Camera Name"
      className="flex flex-col uppercase"
      value={cameraName}
      placeholder="TED LOGAN"
      onChange={(e) =>
        changeCameraName(clapperId, e.target.value.toUpperCase())
      }
      autoCapitalize="characters"
    />
  );
}

function ClapperSettingsBlackboardToggle() {
  const blackboard = useClapperSettingsBlackboard();
  const toggleBlackboardSettings = useClapperSettingsDispatch(
    (ctx) => ctx.toggleBlackboardSettings,
  );
  return (
    <FieldToggle value={blackboard} onClick={() => toggleBlackboardSettings()}>
      Toggle blackboard
    </FieldToggle>
  );
}

function ClapperSettingsCrewNamesToggle() {
  const enableCrewNames = useClapperSettingsStore((ctx) => ctx.enableCrewNames);
  const toggleCrewNames = useClapperSettingsDispatch(
    (ctx) => ctx.toggleCrewNames,
  );
  return (
    <FieldToggle value={enableCrewNames} onClick={() => toggleCrewNames()}>
      Toggle crew names
    </FieldToggle>
  );
}

function ClapperDeleteButton() {
  const clapperId = useClapperCursorClapperId();
  const deleteClapper = useClapperDispatch((ctx) => ctx.deleteClapper);
  const focusClapper = useClapperCursorDispatch((ctx) => ctx.focusClapper);
  return (
    <FieldButton
      Icon={DeleteIcon}
      title="Delete project"
      danger={true}
      onClick={() => {
        deleteClapper(clapperId);
        focusClapper('');
      }}>
      Delete project
    </FieldButton>
  );
}

function ClapperProjectIdInput() {
  const clapperId = useClapperCursorClapperId();
  const productionTitle = useClapperProductionTitle(clapperId);
  const changeProductionTitle = useClapperDispatch(
    (ctx) => ctx.changeProductionTitle,
  );
  return (
    <FieldInput
      id="clapperProjectId"
      title="Project ID"
      className="flex flex-col uppercase"
      value={productionTitle}
      placeholder="MYMOVIE"
      onChange={(e) =>
        changeProductionTitle(clapperId, e.target.value.toUpperCase())
      }
      onBlur={(e) =>
        changeProductionTitle(clapperId, productionTitle.toUpperCase())
      }
      autoCapitalize="characters"
    />
  );
}

function ClapperSelector() {
  const clapperIds = useClapperIds();
  const cursorClapperId = useClapperCursorClapperId();
  const addClapper = useClapperDispatch((ctx) => ctx.addClapper);
  const focusClapper = useClapperCursorDispatch((ctx) => ctx.focusClapper);

  /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
  function onChange(e) {
    let value = e.target.value;
    if (value === NEW_CLAPPER_OPTION) {
      let result = createClapper();
      addClapper(result);
      focusClapper(result.clapperId);
    } else {
      focusClapper(value);
    }
  }
  return (
    <FieldSelect
      id="clapper"
      title="Pick your project..."
      value={cursorClapperId}
      onChange={onChange}>
      {clapperIds.map((clapperId) => (
        <ClapperItem key={clapperId} clapperId={clapperId} />
      ))}
      <NewClapperItem />
    </FieldSelect>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 */
function ClapperItem({ clapperId }) {
  const productionTitle = useClapperProductionTitle(clapperId) || 'MYMOVIE';
  const firstCreatedMillis = useClapperStore(
    (ctx) => getClapperById(ctx, clapperId)?.firstCreatedMillis,
  );
  const dateString = new Date(firstCreatedMillis).toLocaleString();
  return (
    <option value={clapperId}>
      "{productionTitle}" - {dateString}
    </option>
  );
}

const NEW_CLAPPER_OPTION = '__NEW__';

function NewClapperItem() {
  return <option value={NEW_CLAPPER_OPTION}>+ Create new clapper</option>;
}

function ShotHashList() {
  const clapperId = useClapperCursorClapperId();
  const slateIds = useSlateIdsInClapperOrder(clapperId);
  return (
    <ul className="max-h-[50vh] overflow-y-auto">
      {slateIds.map((slateId) => (
        <ShotHashListItem
          key={slateId}
          clapperId={clapperId}
          slateId={slateId}
        />
      ))}
    </ul>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {import('@/stores/clapper/Store').SlateId} props.slateId
 */
function ShotHashListItem({ clapperId, slateId }) {
  const sceneNumber = useClapperStore(
    (ctx) => getSlateById(ctx, clapperId, slateId)?.sceneNumber,
  );
  const shotNumber = useClapperStore(
    (ctx) => getSlateById(ctx, clapperId, slateId)?.shotNumber,
  );
  const nextTakeNumber = useClapperStore(
    (ctx) => getSlateById(ctx, clapperId, slateId)?.nextTakeNumber,
  );
  const clapCount = useClapperStore(
    (ctx) => getSlateById(ctx, clapperId, slateId)?.clapIds?.length ?? 0,
  );
  const sceneShotNumber = formatSceneShotNumber(sceneNumber, shotNumber, true);
  const focusClap = useClapperCursorDispatch((ctx) => ctx.focusClap);
  const changeSceneNumber = useClapperCursorDispatch(
    (ctx) => ctx.changeSceneNumber,
  );
  const changeShotNumber = useClapperCursorDispatch(
    (ctx) => ctx.changeShotNumber,
  );
  const clapId = useClapperStore(
    (ctx) =>
      findClapBySceneShotTakeNumber(
        ctx,
        clapperId,
        sceneNumber,
        shotNumber,
        nextTakeNumber - 1,
      )?.clapId,
  );
  const timestampMillis = useClapperStore(
    (ctx) => getClapById(ctx, clapperId, clapId || '')?.timestampMillis,
  );
  const dateString = new Date(timestampMillis).toLocaleString();
  return (
    <li
      className="flex select-none items-center gap-2 px-2 hover:bg-gray-300"
      onClick={() => {
        focusClap(clapperId, slateId, '');
        changeSceneNumber(sceneNumber);
        changeShotNumber(shotNumber);
      }}>
      <Printed clapperId={clapperId} slateId={slateId} />
      Shot {sceneShotNumber} (👏 {clapCount}) - {dateString}
    </li>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {import('@/stores/clapper/Store').SlateId} props.slateId
 */
function Printed({ clapperId, slateId }) {
  const printed = useClapperStore((ctx) => {
    let clapIds = getSlateById(ctx, clapperId, slateId)?.clapIds ?? [];
    for (let clapId of clapIds) {
      let clap = getClapById(ctx, clapperId, clapId);
      if (clap.printRating > 0) {
        return 2;
      }
    }
    return clapIds.length > 0 ? 1 : 0;
  });
  return (
    <div className="-mx-1">
      {printed === 2 ? (
        <CheckBoxFillIcon className="h-4 w-4 fill-current" />
      ) : printed === 1 ? (
        <CheckBoxIcon className="h-4 w-4 fill-current" />
      ) : (
        <CheckBoxOutlineBlankIcon className="h-4 w-4 fill-current" />
      )}
    </div>
  );
}
