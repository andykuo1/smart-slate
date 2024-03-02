import { SelectItem } from '@ariakit/react';

import { formatTakeNumber } from '@/components/takes/TakeNameFormat';
import { getShotHashById, useClapperStore } from '@/stores/clapper';
import SelectStyle from '@/styles/Select.module.css';

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {import('@/stores/clapper/Store').ShotHashId} props.shotHashId
 * @param {number} props.takeNumber
 */
export default function TakeNumberList({ clapperId, shotHashId, takeNumber }) {
  const nextTakeNumber = useClapperStore(
    (ctx) => getShotHashById(ctx, clapperId, shotHashId)?.nextTakeNumber,
  );
  let result = [];
  for (let i = 1; i < nextTakeNumber; ++i) {
    result.push(
      <SelectItem
        key={'take.' + i}
        className={
          'whitespace-pre' +
          ' ' +
          (takeNumber === i ? 'bg-blue-100' : '') +
          ' ' +
          SelectStyle.selectItem
        }
        value={String(i)}>
        {formatTakeNumber(i).padStart(2, '0')}
      </SelectItem>,
    );
  }
  result.push(
    <SelectItem
      key={'take.' + nextTakeNumber}
      className={'whitespace-pre' + ' ' + SelectStyle.selectItem}
      value={String(nextTakeNumber)}>
      {formatTakeNumber(nextTakeNumber).padStart(2, '0')}
    </SelectItem>,
  );
  return result;
}
