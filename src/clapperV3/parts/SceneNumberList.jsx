import { SelectItem } from '@ariakit/react';

import {
  findLastShotHashBySceneNumber,
  useClapperStore,
} from '@/stores/clapper';
import SelectStyle from '@/styles/Select.module.css';

import SceneNumber from '../SceneNumber';

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {number} props.sceneNumber
 */
export default function SceneNumberList({ clapperId, sceneNumber }) {
  let result = [];
  for (let i = 1; i < sceneNumber; ++i) {
    result.push(
      <SceneNumberListItem
        key={'scene.' + i}
        clapperId={clapperId}
        sceneNumber={i}
      />,
    );
  }
  result.push(
    <SceneNumberListItem
      key={'scene.' + sceneNumber}
      clapperId={clapperId}
      sceneNumber={sceneNumber}
      active={true}
    />,
  );
  let max = sceneNumber + 100;
  for (let i = sceneNumber + 1; i < max; ++i) {
    result.push(
      <SceneNumberListItem
        key={'scene.' + i}
        clapperId={clapperId}
        sceneNumber={i}
      />,
    );
  }
  return result;
}

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {number} props.sceneNumber
 * @param {boolean} [props.active]
 */
function SceneNumberListItem({ clapperId, sceneNumber, active }) {
  const shotHash = useClapperStore((ctx) =>
    findLastShotHashBySceneNumber(ctx, clapperId, sceneNumber),
  );
  return (
    <SelectItem
      className={
        'whitespace-pre' +
        ' ' +
        (shotHash ? 'text-black' : 'text-gray-300') +
        ' ' +
        (active ? 'bg-blue-100' : '') +
        ' ' +
        SelectStyle.selectItem
      }
      value={String(sceneNumber)}>
      {SceneNumber.stringify(sceneNumber)}
    </SelectItem>
  );
}
