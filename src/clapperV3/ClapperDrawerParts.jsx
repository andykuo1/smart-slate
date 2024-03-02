import { useNavigate } from 'react-router-dom';

import DeleteIcon from '@material-symbols/svg-400/rounded/delete.svg';
import HomeIcon from '@material-symbols/svg-400/rounded/home.svg';

import {
  formatProjectId,
  formatSceneShotNumber,
} from '@/components/takes/TakeNameFormat';
import FieldButton from '@/fields/FieldButton';
import FieldGroupDiscloseable from '@/fields/FieldGroupDiscloseable';
import FieldInput from '@/fields/FieldInput';
import FieldSelect from '@/fields/FieldSelect';
import {
  findClapBySceneShotTakeNumber,
  getClapById,
  getClapperById,
  getShotHashById,
  useClapperDispatch,
  useClapperIds,
  useClapperProductionTitle,
  useClapperStore,
  useShotHashIdsInOrder,
} from '@/stores/clapper';
import { createClapper } from '@/stores/clapper/Store';
import {
  useClapperCursorClapperId,
  useClapperCursorDispatch,
} from '@/stores/clapper/cursor';

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
      <FieldGroupDiscloseable title="Dangerous Stuff">
        <ClapperDeleteButton />
      </FieldGroupDiscloseable>
    </div>
  );
}

function ClapperDeleteButton() {
  const clapperId = useClapperCursorClapperId();
  const deleteClapper = useClapperDispatch((ctx) => ctx.deleteClapper);
  const focusClapper = useClapperCursorDispatch((ctx) => ctx.focusClapper);
  return (
    <FieldButton
      Icon={DeleteIcon}
      title="Delete Project"
      danger={true}
      onClick={() => {
        deleteClapper(clapperId);
        focusClapper('');
      }}>
      Delete Clapper
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
        changeProductionTitle(clapperId, formatProjectId(productionTitle))
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
  const shotHashIds = useShotHashIdsInOrder(clapperId);
  return (
    <ul className="max-h-[50vh] overflow-y-auto">
      {shotHashIds.map((shotHashId) => (
        <ShotHashListItem
          key={shotHashId}
          clapperId={clapperId}
          shotHashId={shotHashId}
        />
      ))}
    </ul>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {import('@/stores/clapper/Store').ShotHashId} props.shotHashId
 */
function ShotHashListItem({ clapperId, shotHashId }) {
  const sceneNumber = useClapperStore(
    (ctx) => getShotHashById(ctx, clapperId, shotHashId)?.sceneNumber,
  );
  const shotNumber = useClapperStore(
    (ctx) => getShotHashById(ctx, clapperId, shotHashId)?.shotNumber,
  );
  const nextTakeNumber = useClapperStore(
    (ctx) => getShotHashById(ctx, clapperId, shotHashId)?.nextTakeNumber,
  );
  const sceneShotNumber = formatSceneShotNumber(sceneNumber, shotNumber, true);
  const focusClap = useClapperCursorDispatch((ctx) => ctx.focusClap);
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
      className="select-none px-2 hover:bg-gray-300"
      onClick={() => focusClap(clapperId, clapId || '')}>
      Shot {sceneShotNumber} - {dateString}
    </li>
  );
}
