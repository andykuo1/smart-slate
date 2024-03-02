import { SelectItem } from '@ariakit/react';

import { formatShotNumber } from '@/components/takes/TakeNameFormat';
import { findSlateBySceneShotNumber, useClapperStore } from '@/stores/clapper';
import SelectStyle from '@/styles/Select.module.css';

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {number} props.sceneNumber
 * @param {number} props.shotNumber
 */
export default function ShotNumberList({ clapperId, sceneNumber, shotNumber }) {
  let result = [];
  for (let i = 1; i < shotNumber; ++i) {
    result.push(
      <ShotNumberListItem
        key={'shot.' + i}
        clapperId={clapperId}
        sceneNumber={sceneNumber}
        shotNumber={i}
      />,
    );
  }
  result.push(
    <ShotNumberListItem
      key={'shot.' + shotNumber}
      clapperId={clapperId}
      sceneNumber={sceneNumber}
      shotNumber={shotNumber}
      active={true}
    />,
  );
  let max = shotNumber + 26;
  for (let i = shotNumber + 1; i < max; ++i) {
    result.push(
      <ShotNumberListItem
        key={'shot.' + i}
        clapperId={clapperId}
        sceneNumber={sceneNumber}
        shotNumber={i}
      />,
    );
  }
  return result;
}

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {number} props.sceneNumber
 * @param {number} props.shotNumber
 * @param {boolean} [props.active]
 */
function ShotNumberListItem({ clapperId, sceneNumber, shotNumber, active }) {
  const slate = useClapperStore((ctx) =>
    findSlateBySceneShotNumber(ctx, clapperId, sceneNumber, shotNumber),
  );
  return (
    <SelectItem
      className={
        'whitespace-pre' +
        ' ' +
        (slate ? 'text-black' : 'text-gray-300') +
        ' ' +
        (active ? 'bg-blue-100' : '') +
        ' ' +
        SelectStyle.selectItem
      }
      value={String(shotNumber)}>
      {formatShotNumber(shotNumber).padEnd(2, ' ')}
    </SelectItem>
  );
}
