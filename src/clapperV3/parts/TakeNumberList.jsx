import { SelectItem } from '@ariakit/react';

import { formatTakeNumber } from '@/components/takes/TakeNameFormat';
import {
  getClapById,
  getSlateById,
  useClapIdsInSlateOrder,
  useClapperStore,
} from '@/stores/clapper';
import SelectStyle from '@/styles/Select.module.css';

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {import('@/stores/clapper/Store').SlateId} props.slateId
 * @param {number} props.takeNumber
 */
export default function TakeNumberList({ clapperId, slateId, takeNumber }) {
  const clapIds = useClapIdsInSlateOrder(clapperId, slateId);
  let result = [];
  for (let clapId of clapIds) {
    result.push(<TakeNumberListItem clapperId={clapperId} clapId={clapId} />);
  }
  result.push(
    <TakeNumberListItemNew clapperId={clapperId} slateId={slateId} />,
  );
  return result;
}

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {import('@/stores/clapper/Store').ClapId} props.clapId
 * @param {boolean} [props.active]
 */
function TakeNumberListItem({ clapperId, clapId, active }) {
  const takeNumber = useClapperStore(
    (ctx) => getClapById(ctx, clapperId, clapId)?.takeNumber,
  );
  return (
    <SelectItem
      className={
        'whitespace-pre' +
        ' ' +
        (active ? 'bg-blue-100' : '') +
        ' ' +
        SelectStyle.selectItem
      }
      value={String(takeNumber)}>
      {formatTakeNumber(takeNumber).padStart(2, '0')}
    </SelectItem>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {import('@/stores/clapper/Store').SlateId} props.slateId
 */
function TakeNumberListItemNew({ clapperId, slateId }) {
  const takeNumber = useClapperStore(
    (ctx) => getSlateById(ctx, clapperId, slateId)?.nextTakeNumber,
  );
  return (
    <SelectItem
      className={'whitespace-pre' + ' ' + SelectStyle.selectItem}
      value={String(takeNumber)}>
      {formatTakeNumber(takeNumber).padStart(2, '0')}
    </SelectItem>
  );
}
